import { Test, TestingModule } from '@nestjs/testing';
import { GetWalletTokensUseCase } from './get-wallet-tokens.use-case';
import { NetworkService } from '../../shared/service/network.service';

// Using the provided TokenData interface
interface TokenData {
  name: string;
  symbol: string;
  balance: number;
  contractAddress: string;
  chainId: number;
  chainName: string;
}

describe('GetWalletTokensUseCase', () => {
  let useCase: GetWalletTokensUseCase;
  let networkService: NetworkService;

  beforeEach(async () => {
    // Create a mock for the NetworkService
    const networkServiceMock = {
      getAllTokens: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetWalletTokensUseCase,
        {
          provide: NetworkService,
          useValue: networkServiceMock,
        },
      ],
    }).compile();

    useCase = module.get<GetWalletTokensUseCase>(GetWalletTokensUseCase);
    networkService = module.get<NetworkService>(NetworkService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should call getAllTokens with the correct wallet address', async () => {
      // Arrange
      const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
      const mockTokens: TokenData[] = [
        {
          name: 'Ethereum',
          symbol: 'ETH',
          balance: 1.5,
          contractAddress: '0x0',
          chainId: 1,
          chainName: 'Ethereum Mainnet',
        },
        {
          name: 'Dai Stablecoin',
          symbol: 'DAI',
          balance: 100,
          contractAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
          chainId: 1,
          chainName: 'Ethereum Mainnet',
        },
      ];
      jest.spyOn(networkService, 'getAllTokens').mockResolvedValue(mockTokens);

      // Act
      const result = await useCase.execute(walletAddress);

      // Assert
      expect(networkService.getAllTokens).toHaveBeenCalledWith(walletAddress);
      expect(networkService.getAllTokens).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockTokens);
    });

    it('should return the exact response from the network service', async () => {
      // Arrange
      const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
      const mockTokens: TokenData[] = [
        {
          name: 'Ethereum',
          symbol: 'ETH',
          balance: 1.5,
          contractAddress: '0x0',
          chainId: 1,
          chainName: 'Ethereum Mainnet',
        },
      ];
      jest.spyOn(networkService, 'getAllTokens').mockResolvedValue(mockTokens);

      // Act
      const result = await useCase.execute(walletAddress);

      // Assert
      expect(result).toBe(mockTokens); // Testing reference equality
    });

    it('should handle empty wallet address', async () => {
      // Arrange
      const emptyWalletAddress = '';
      const mockEmptyResult: TokenData[] = [];
      jest.spyOn(networkService, 'getAllTokens').mockResolvedValue(mockEmptyResult);

      // Act
      const result = await useCase.execute(emptyWalletAddress);

      // Assert
      expect(networkService.getAllTokens).toHaveBeenCalledWith(emptyWalletAddress);
      expect(result).toEqual(mockEmptyResult);
    });

    it('should pass through errors from the network service', async () => {
      // Arrange
      const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
      const mockError = new Error('Network error');
      jest.spyOn(networkService, 'getAllTokens').mockRejectedValue(mockError);

      // Act & Assert
      await expect(useCase.execute(walletAddress)).rejects.toThrow(mockError);
      expect(networkService.getAllTokens).toHaveBeenCalledWith(walletAddress);
    });

    it('should handle different wallet address formats', async () => {
      // Arrange
      const checksumAddress = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed';
      const mockTokens: TokenData[] = [
        {
          name: 'Polygon',
          symbol: 'MATIC',
          balance: 500,
          contractAddress: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
          chainId: 137,
          chainName: 'Polygon Mainnet',
        },
      ];
      jest.spyOn(networkService, 'getAllTokens').mockResolvedValue(mockTokens);

      // Act
      const result = await useCase.execute(checksumAddress);

      // Assert
      expect(networkService.getAllTokens).toHaveBeenCalledWith(checksumAddress);
      expect(result).toEqual(mockTokens);
    });

    it('should handle tokens with zero balance', async () => {
      // Arrange
      const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
      const mockTokens: TokenData[] = [
        {
          name: 'Ethereum',
          symbol: 'ETH',
          balance: 0,
          contractAddress: '0x0',
          chainId: 1,
          chainName: 'Ethereum Mainnet',
        },
        {
          name: 'Uniswap',
          symbol: 'UNI',
          balance: 0,
          contractAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
          chainId: 1,
          chainName: 'Ethereum Mainnet',
        },
      ];
      jest.spyOn(networkService, 'getAllTokens').mockResolvedValue(mockTokens);

      // Act
      const result = await useCase.execute(walletAddress);

      // Assert
      expect(networkService.getAllTokens).toHaveBeenCalledWith(walletAddress);
      expect(result).toEqual(mockTokens);
    });

    it('should handle tokens from multiple chains', async () => {
      // Arrange
      const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
      const mockTokens: TokenData[] = [
        {
          name: 'Ethereum',
          symbol: 'ETH',
          balance: 1.5,
          contractAddress: '0x0',
          chainId: 1,
          chainName: 'Ethereum Mainnet',
        },
        {
          name: 'Polygon',
          symbol: 'MATIC',
          balance: 500,
          contractAddress: '0x0',
          chainId: 137,
          chainName: 'Polygon Mainnet',
        },
        {
          name: 'Binance Coin',
          symbol: 'BNB',
          balance: 2.75,
          contractAddress: '0x0',
          chainId: 56,
          chainName: 'Binance Smart Chain',
        },
      ];
      jest.spyOn(networkService, 'getAllTokens').mockResolvedValue(mockTokens);

      // Act
      const result = await useCase.execute(walletAddress);

      // Assert
      expect(networkService.getAllTokens).toHaveBeenCalledWith(walletAddress);
      expect(result).toEqual(mockTokens);
    });
  });
});
