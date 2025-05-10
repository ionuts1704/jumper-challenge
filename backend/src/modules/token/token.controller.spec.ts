import { Test, TestingModule } from '@nestjs/testing';
import { TokenController } from './token.controller';
import { GetWalletTokensUseCase } from './use-case/get-wallet-tokens.use-case';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

// Using the provided TokenData interface structure
interface TokenData {
  name: string;
  symbol: string;
  balance: number;
  contractAddress: string;
  chainId: number;
  chainName: string;
}

describe('TokenController', () => {
  let controller: TokenController;
  let getWalletTokensUseCase: GetWalletTokensUseCase;

  beforeEach(async () => {
    // Create mock for GetWalletTokensUseCase
    const getWalletTokensUseCaseMock = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [
        {
          provide: GetWalletTokensUseCase,
          useValue: getWalletTokensUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<TokenController>(TokenController);
    getWalletTokensUseCase = module.get<GetWalletTokensUseCase>(
      GetWalletTokensUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getWalletTokens', () => {
    it('should get tokens for the authenticated wallet address', async () => {
      // Arrange
      const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
      const mockRequest = {
        user: {
          walletAddress,
        },
      } as unknown as Request;

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

      jest
        .spyOn(getWalletTokensUseCase, 'execute')
        .mockResolvedValue(mockTokens);

      // Act
      const result = await controller.getWalletTokens(mockRequest);

      // Assert
      expect(result).toEqual(mockTokens);
      expect(getWalletTokensUseCase.execute).toHaveBeenCalledWith(
        walletAddress,
      );
      expect(getWalletTokensUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should extract wallet address from request user object', async () => {
      // Arrange
      const walletAddress = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed';
      const mockRequest = {
        user: {
          walletAddress,
          // Additional user properties that should be ignored
          id: 'user-123',
          email: 'user@example.com',
        },
      } as unknown as Request;

      const mockTokens: TokenData[] = [];
      jest
        .spyOn(getWalletTokensUseCase, 'execute')
        .mockResolvedValue(mockTokens);

      // Act
      await controller.getWalletTokens(mockRequest);

      // Assert
      expect(getWalletTokensUseCase.execute).toHaveBeenCalledWith(
        walletAddress,
      );
    });

    it('should handle case when user has no tokens', async () => {
      // Arrange
      const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
      const mockRequest = {
        user: {
          walletAddress,
        },
      } as unknown as Request;

      const mockEmptyTokens: TokenData[] = [];
      jest
        .spyOn(getWalletTokensUseCase, 'execute')
        .mockResolvedValue(mockEmptyTokens);

      // Act
      const result = await controller.getWalletTokens(mockRequest);

      // Assert
      expect(result).toEqual([]);
      expect(getWalletTokensUseCase.execute).toHaveBeenCalledWith(
        walletAddress,
      );
    });

    it('should propagate errors from the use case', async () => {
      // Arrange
      const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
      const mockRequest = {
        user: {
          walletAddress,
        },
      } as unknown as Request;

      const mockError = new Error('Network error');
      jest
        .spyOn(getWalletTokensUseCase, 'execute')
        .mockRejectedValue(mockError);

      // Act & Assert
      await expect(controller.getWalletTokens(mockRequest)).rejects.toThrow(
        mockError,
      );
      expect(getWalletTokensUseCase.execute).toHaveBeenCalledWith(
        walletAddress,
      );
    });

    it('should handle tokens with zero balance', async () => {
      // Arrange
      const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
      const mockRequest = {
        user: {
          walletAddress,
        },
      } as unknown as Request;

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
          name: 'Polygon',
          symbol: 'MATIC',
          balance: 0,
          contractAddress: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
          chainId: 1,
          chainName: 'Ethereum Mainnet',
        },
      ];

      jest
        .spyOn(getWalletTokensUseCase, 'execute')
        .mockResolvedValue(mockTokens);

      // Act
      const result = await controller.getWalletTokens(mockRequest);

      // Assert
      expect(result).toEqual(mockTokens);
      expect(getWalletTokensUseCase.execute).toHaveBeenCalledWith(
        walletAddress,
      );
    });

    it('should handle tokens from multiple chains', async () => {
      // Arrange
      const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
      const mockRequest = {
        user: {
          walletAddress,
        },
      } as unknown as Request;

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
          name: 'Avalanche',
          symbol: 'AVAX',
          balance: 10,
          contractAddress: '0x0',
          chainId: 43114,
          chainName: 'Avalanche C-Chain',
        },
      ];

      jest
        .spyOn(getWalletTokensUseCase, 'execute')
        .mockResolvedValue(mockTokens);

      // Act
      const result = await controller.getWalletTokens(mockRequest);

      // Assert
      expect(result).toEqual(mockTokens);
      expect(getWalletTokensUseCase.execute).toHaveBeenCalledWith(
        walletAddress,
      );
    });
  });
});
