import { Injectable } from '@nestjs/common';
import { Alchemy, Network, TokenBalanceType } from 'alchemy-sdk';
import { ConfigService } from '@nestjs/config';

// Define interfaces for token data
export interface TokenData {
  name: string;
  symbol: string;
  balance: number;
  contractAddress: string;
  chainId: number;
  chainName: string;
}

export interface ChainTokens {
  chainId: number;
  chainName: string;
  tokens: TokenData[];
}

@Injectable()
export class NetworkService {
  private readonly apiKey: string;

  private readonly supportedChains = [
    { id: 1, networkEnum: Network.ETH_MAINNET, name: 'Ethereum' },
    { id: 137, networkEnum: Network.MATIC_MAINNET, name: 'Polygon' },
  ];

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('rpc.apiKey') as string;
  }

  /**
   * Get Alchemy instance for a specific chain
   */
  private getAlchemyInstance(network: Network): Alchemy {
    return new Alchemy({
      apiKey: this.apiKey,
      network: network,
    });
  }

  /**
   * Get all ERC-20 tokens for a wallet on a specific chain
   */
  private async getTokensForChain(
    walletAddress: string,
    chain: { id: number; networkEnum: Network; name: string },
  ): Promise<ChainTokens> {
    try {
      const alchemy = this.getAlchemyInstance(chain.networkEnum);

      // Get all token balances
      const balances = await alchemy.core.getTokenBalances(walletAddress, {
        type: TokenBalanceType.ERC20,
      });

      // Get metadata for all tokens
      const tokensWithMetadata = await Promise.all(
        balances.tokenBalances.map(async (token) => {
          try {
            const metadata = await alchemy.core.getTokenMetadata(
              token.contractAddress,
            );

            const decimals = metadata.decimals || 18;
            const formattedBalance =
              parseInt(token.tokenBalance as string) / Math.pow(10, decimals);

            return {
              name: metadata.name || 'Unknown Token',
              symbol: metadata.symbol || '???',
              balance: formattedBalance,
              contractAddress: token.contractAddress,
              chainId: chain.id,
              chainName: chain.name,
            };
          } catch (error) {
            // Handle metadata errors gracefully
            console.error(
              `Error fetching metadata for token ${token.contractAddress} on ${chain.name}:`,
              error,
            );
            return {
              name: 'Unknown Token',
              symbol: '???',
              balance: 0,
              contractAddress: token.contractAddress,
              chainId: chain.id,
              chainName: chain.name,
            };
          }
        }),
      );

      return {
        chainId: chain.id,
        chainName: chain.name,
        tokens: tokensWithMetadata,
      };
    } catch (error) {
      console.error(`Error fetching tokens for ${chain.name}:`, error);
      return {
        chainId: chain.id,
        chainName: chain.name,
        tokens: [],
      };
    }
  }

  /**
   * Get all ERC-20 tokens across all supported chains
   */
  async getAllTokens(walletAddress: string): Promise<TokenData[]> {
    try {
      // Get tokens for each chain in parallel
      const chainResults = await Promise.all(
        this.supportedChains.map((chain) =>
          this.getTokensForChain(walletAddress, chain),
        ),
      );

      // Flatten the results
      const allTokens = chainResults.flatMap((result) => result.tokens);

      return allTokens;
    } catch (error) {
      console.error('Error fetching all tokens:', error);
      throw new Error(`Failed to fetch tokens: ${error.message}`);
    }
  }
}
