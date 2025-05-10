import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NetworkService } from './network.service';
import { Alchemy, TokenBalanceType } from 'alchemy-sdk';

// Mock Alchemy SDK
jest.mock('alchemy-sdk', () => {
  return {
    Alchemy: jest.fn().mockImplementation(() => ({
      core: {
        getTokenBalances: jest.fn(),
        getTokenMetadata: jest.fn(),
      },
    })),
    Network: {
      ETH_MAINNET: 'eth-mainnet',
      MATIC_MAINNET: 'matic-mainnet',
    },
    TokenBalanceType: {
      ERC20: 'erc20',
    },
  };
});

describe('NetworkService', () => {
  let service: NetworkService;
  let configService: ConfigService;
  let mockConfigGet: jest.Mock;

  beforeEach(async () => {
    // Create a fresh mock for each test
    mockConfigGet = jest.fn().mockReturnValue('mock-api-key');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NetworkService,
        {
          provide: ConfigService,
          useValue: {
            get: mockConfigGet,
          },
        },
      ],
    }).compile();

    service = module.get<NetworkService>(NetworkService);
    configService = module.get<ConfigService>(ConfigService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllTokens', () => {
    const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';

    it('should fetch tokens from all supported chains', async () => {
      // Arrange - Setup for Ethereum chain
      const ethereumTokenBalances = {
        tokenBalances: [
          { contractAddress: '0xToken1', tokenBalance: '1000000000000000000' },
          { contractAddress: '0xToken2', tokenBalance: '2000000000000000000' },
        ],
      };

      // Setup for Polygon chain
      const polygonTokenBalances = {
        tokenBalances: [
          { contractAddress: '0xToken3', tokenBalance: '3000000000000000000' },
        ],
      };

      // First instance for Ethereum
      const mockEthereumAlchemyInstance = {
        core: {
          getTokenBalances: jest.fn().mockResolvedValue(ethereumTokenBalances),
          getTokenMetadata: jest.fn()
            .mockResolvedValueOnce({ name: 'Token1', symbol: 'TK1', decimals: 18 })
            .mockResolvedValueOnce({ name: 'Token2', symbol: 'TK2', decimals: 18 }),
        },
      };

      // Second instance for Polygon
      const mockPolygonAlchemyInstance = {
        core: {
          getTokenBalances: jest.fn().mockResolvedValue(polygonTokenBalances),
          getTokenMetadata: jest.fn()
            .mockResolvedValue({ name: 'Token3', symbol: 'TK3', decimals: 18 }),
        },
      };

      // Mock the Alchemy constructor to return different instances based on network
      (Alchemy as jest.Mock).mockImplementationOnce(() => mockEthereumAlchemyInstance)
        .mockImplementationOnce(() => mockPolygonAlchemyInstance);

      // Act
      const result = await service.getAllTokens(walletAddress);

      // Assert
      expect(result.length).toBe(3);

      // Check Ethereum tokens
      expect(result).toContainEqual({
        name: 'Token1',
        symbol: 'TK1',
        balance: 1,
        contractAddress: '0xToken1',
        chainId: 1,
        chainName: 'Ethereum',
      });

      expect(result).toContainEqual({
        name: 'Token2',
        symbol: 'TK2',
        balance: 2,
        contractAddress: '0xToken2',
        chainId: 1,
        chainName: 'Ethereum',
      });

      // Check Polygon token
      expect(result).toContainEqual({
        name: 'Token3',
        symbol: 'TK3',
        balance: 3,
        contractAddress: '0xToken3',
        chainId: 137,
        chainName: 'Polygon',
      });

      // Verify correct parameters
      expect(mockEthereumAlchemyInstance.core.getTokenBalances).toHaveBeenCalledWith(
        walletAddress,
        { type: TokenBalanceType.ERC20 }
      );

      expect(mockPolygonAlchemyInstance.core.getTokenBalances).toHaveBeenCalledWith(
        walletAddress,
        { type: TokenBalanceType.ERC20 }
      );
    });

    it('should handle chain-level errors gracefully', async () => {
      // Arrange - Mock Ethereum (fails) and Polygon (succeeds)

      // Ethereum instance that throws an error
      const mockEthereumAlchemyInstance = {
        core: {
          getTokenBalances: jest.fn().mockRejectedValue(new Error('Chain error')),
          getTokenMetadata: jest.fn(),
        },
      };

      // Polygon instance that succeeds
      const mockPolygonAlchemyInstance = {
        core: {
          getTokenBalances: jest.fn().mockResolvedValue({
            tokenBalances: [
              { contractAddress: '0xToken3', tokenBalance: '3000000000000000000' },
            ],
          }),
          getTokenMetadata: jest.fn().mockResolvedValue({
            name: 'Token3',
            symbol: 'TK3',
            decimals: 18,
          }),
        },
      };

      // Mock Alchemy constructor to return different instances
      (Alchemy as jest.Mock).mockImplementationOnce(() => mockEthereumAlchemyInstance)
        .mockImplementationOnce(() => mockPolygonAlchemyInstance);

      // Spy on console.error
      jest.spyOn(console, 'error').mockImplementation(() => {});

      // Act
      const result = await service.getAllTokens(walletAddress);

      // Assert
      expect(result.length).toBe(1);

      // Only Polygon token should be in results
      expect(result[0]).toEqual({
        name: 'Token3',
        symbol: 'TK3',
        balance: 3,
        contractAddress: '0xToken3',
        chainId: 137,
        chainName: 'Polygon',
      });

      // Verify error was logged
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle empty token list', async () => {
      // Arrange
      const mockEmptyAlchemyInstance = {
        core: {
          getTokenBalances: jest.fn().mockResolvedValue({ tokenBalances: [] }),
          getTokenMetadata: jest.fn(),
        },
      };

      // Use this mock for all Alchemy instantiations
      (Alchemy as jest.Mock).mockImplementation(() => mockEmptyAlchemyInstance);

      // Act
      const result = await service.getAllTokens(walletAddress);

      // Assert
      expect(result).toEqual([]);
    });
  });
});
