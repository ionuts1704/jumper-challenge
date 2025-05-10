import { Test, TestingModule } from '@nestjs/testing';
import { SaveWalletUseCase } from './save-wallet.use-case';
import { Wallet, WalletRepository } from '../repository/wallet.repository';

describe('SaveWalletUseCase', () => {
  let useCase: SaveWalletUseCase;
  let walletRepository: WalletRepository;

  beforeEach(async () => {
    // Create a mock for the WalletRepository
    const walletRepositoryMock = {
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveWalletUseCase,
        {
          provide: WalletRepository,
          useValue: walletRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<SaveWalletUseCase>(SaveWalletUseCase);
    walletRepository = module.get<WalletRepository>(WalletRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should save a wallet and return the saved wallet', () => {
      // Arrange
      const mockWallet: Wallet = {
        id: 'wallet-id',
        nonce: 'generated-nonce',
      };
      jest.spyOn(walletRepository, 'save').mockReturnValue(mockWallet);

      // Act
      const result = useCase.execute('wallet-id');

      // Assert
      expect(result).toEqual(mockWallet);
      expect(walletRepository.save).toHaveBeenCalledWith('wallet-id');
      expect(walletRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should pass the exact ID to the repository', () => {
      // Arrange
      const testId = 'specific-wallet-id-123';
      const mockWallet: Wallet = {
        id: testId,
        nonce: 'some-nonce',
      };
      jest.spyOn(walletRepository, 'save').mockReturnValue(mockWallet);

      // Act
      useCase.execute(testId);

      // Assert
      expect(walletRepository.save).toHaveBeenCalledWith(testId);
    });

    it('should return the exact wallet object from the repository', () => {
      // Arrange
      const mockWallet: Wallet = {
        id: 'wallet-id',
        nonce: 'unique-nonce-value',
      };
      jest.spyOn(walletRepository, 'save').mockReturnValue(mockWallet);

      // Act
      const result = useCase.execute('wallet-id');

      // Assert
      expect(result).toBe(mockWallet); // Testing reference equality
    });

    it('should handle empty string ID', () => {
      // Arrange
      const mockWallet: Wallet = {
        id: '',
        nonce: 'nonce-for-empty-id',
      };
      jest.spyOn(walletRepository, 'save').mockReturnValue(mockWallet);

      // Act
      const result = useCase.execute('');

      // Assert
      expect(result).toEqual(mockWallet);
      expect(walletRepository.save).toHaveBeenCalledWith('');
    });

    it('should handle special characters in ID', () => {
      // Arrange
      const specialId = 'wallet-id!@#$%^&*()';
      const mockWallet: Wallet = {
        id: specialId,
        nonce: 'nonce-for-special-id',
      };
      jest.spyOn(walletRepository, 'save').mockReturnValue(mockWallet);

      // Act
      const result = useCase.execute(specialId);

      // Assert
      expect(result).toEqual(mockWallet);
      expect(walletRepository.save).toHaveBeenCalledWith(specialId);
    });
  });
});
