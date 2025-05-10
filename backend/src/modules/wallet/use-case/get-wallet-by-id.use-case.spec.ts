import { Test, TestingModule } from '@nestjs/testing';
import { GetWalletByIdUseCase } from './get-wallet-by-id.use-case';
import { WalletRepository } from '../repository/wallet.repository';

describe('GetWalletByIdUseCase', () => {
  let useCase: GetWalletByIdUseCase;
  let walletRepository: WalletRepository;

  beforeEach(async () => {
    // Create a mock for the WalletRepository
    const walletRepositoryMock = {
      getById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetWalletByIdUseCase,
        {
          provide: WalletRepository,
          useValue: walletRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<GetWalletByIdUseCase>(GetWalletByIdUseCase);
    walletRepository = module.get<WalletRepository>(WalletRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a wallet when it exists', () => {
      // Arrange
      const mockWallet = {
        id: 'existing-wallet-id',
        nonce: 'some-nonce',
      };
      jest.spyOn(walletRepository, 'getById').mockReturnValue(mockWallet);

      // Act
      const result = useCase.execute('existing-wallet-id');

      // Assert
      expect(result).toEqual(mockWallet);
      expect(walletRepository.getById).toHaveBeenCalledWith('existing-wallet-id');
      expect(walletRepository.getById).toHaveBeenCalledTimes(1);
    });

    it('should return undefined when wallet does not exist', () => {
      // Arrange
      jest.spyOn(walletRepository, 'getById').mockReturnValue(undefined);

      // Act
      const result = useCase.execute('non-existent-wallet-id');

      // Assert
      expect(result).toBeUndefined();
      expect(walletRepository.getById).toHaveBeenCalledWith('non-existent-wallet-id');
      expect(walletRepository.getById).toHaveBeenCalledTimes(1);
    });

    it('should pass the exact ID to the repository', () => {
      // Arrange
      const testId = 'test-wallet-id-123';
      jest.spyOn(walletRepository, 'getById');

      // Act
      useCase.execute(testId);

      // Assert
      expect(walletRepository.getById).toHaveBeenCalledWith(testId);
    });

    it('should not modify the wallet data returned from repository', () => {
      // Arrange
      const mockWallet = {
        id: 'wallet-id',
        nonce: 'original-nonce',
        // Add any other properties that might be in a real wallet
      };
      jest.spyOn(walletRepository, 'getById').mockReturnValue({...mockWallet});

      // Act
      const result = useCase.execute('wallet-id');

      // Assert
      expect(result).toEqual(mockWallet);
      // Ensure deep equality to verify no properties were modified
      expect(JSON.stringify(result)).toBe(JSON.stringify(mockWallet));
    });

    it('should handle empty string ID', () => {
      // Arrange
      jest.spyOn(walletRepository, 'getById');

      // Act
      useCase.execute('');

      // Assert
      expect(walletRepository.getById).toHaveBeenCalledWith('');
    });
  });
});