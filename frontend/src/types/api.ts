export type ConnectWalletResponse = {
  id: string;
  nonce: string;
};

export type TokenDto = {
  name: string;
  symbol: string;
  balance: number;
  contractAddress: string;
  chainId: number;
  chainName: string;
};
