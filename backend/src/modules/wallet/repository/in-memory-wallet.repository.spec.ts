import { Test, TestingModule } from '@nestjs/testing';
import { WalletRepository } from './wallet.repository';
import { InMemoryWalletRepository } from './in-memory-wallet.repository';

import * as siwe from 'siwe';

// Mock the siwe library
jest.mock('siwe', () => ({
  generateNonce: jest.fn(),
}));

describe('InMemoryWalletRepository', () => {
  let repository: InMemoryWalletRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: WalletRepository,
          useClass: InMemoryWalletRepository,
        },
      ],
    }).compile();

    repository = module.get<InMemoryWalletRepository>(WalletRepository);

    // Reset and setup the mock for generateNonce
    jest.resetAllMocks();
    (siwe.generateNonce as jest.Mock).mockImplementation(() => 'mock-nonce');
  });

  describe('getById', () => {
    it('should return undefined for a non-existent wallet', () => {
      // Act
      const result = repository.getById('non-existent-id');

      // Assert
      expect(result).toBeUndefined();
    });

    it('should return a wallet when it exists', () => {
      // Arrange
      const id = 'existing-wallet-id';
      repository.save(id);

      // Act
      const result = repository.getById(id);

      // Assert
      expect(result).toBeDefined();
      expect(result).toEqual({
        id,
        nonce: 'mock-nonce',
      });
    });
  });

  describe('save', () => {
    it('should create a new wallet with a nonce', () => {
      // Arrange
      const id = 'new-wallet-id';

      // Act
      const result = repository.save(id);

      // Assert
      expect(result).toEqual({
        id,
        nonce: 'mock-nonce',
      });
      expect(siwe.generateNonce).toHaveBeenCalledTimes(1);
    });

    it('should override an existing wallet if the ID already exists', () => {
      // Arrange
      const id = 'duplicate-wallet-id';

      // First save
      repository.save(id);

      // Mock a different nonce for second save
      (siwe.generateNonce as jest.Mock).mockReturnValueOnce('another-nonce');

      // Act
      const result = repository.save(id);

      // Assert
      expect(result).toEqual({
        id,
        nonce: 'another-nonce',
      });
      expect(siwe.generateNonce).toHaveBeenCalledTimes(2);

      // Verify the wallet was updated in the repository
      expect(repository.getById(id)).toEqual({
        id,
        nonce: 'another-nonce',
      });
    });
  });

  describe('updateNonceById', () => {
    it('should return undefined for a non-existent wallet', () => {
      // Act
      const result = repository.updateNonceById('non-existent-id');

      // Assert
      expect(result).toBeUndefined();
      expect(siwe.generateNonce).not.toHaveBeenCalled();
    });

    it('should update the nonce for an existing wallet', () => {
      // Arrange
      const id = 'existing-wallet-id';
      repository.save(id);

      // Mock a different nonce for the update
      (siwe.generateNonce as jest.Mock).mockReturnValueOnce('updated-nonce');

      // Act
      const result = repository.updateNonceById(id);

      // Assert
      expect(result).toEqual({
        id,
        nonce: 'updated-nonce',
      });
      expect(siwe.generateNonce).toHaveBeenCalledTimes(2); // Once for save, once for update

      // Verify the wallet was updated in the repository
      expect(repository.getById(id)).toEqual({
        id,
        nonce: 'updated-nonce',
      });
    });
  });
});