import { SiweMessage } from 'siwe';

interface CreateSiweMessageOptions {
  address: string;
  chainId: number;
  nonce: string;
  statement?: string;
  domain?: string;
  uri?: string;
  version?: string;
}

export const createSiweMessage = (options: CreateSiweMessageOptions): string => {
  const {
    address,
    chainId,
    nonce,
    statement = 'Sign in with Ethereum to the ERC-20 Dashboard.',
    domain = window.location.host,
    uri = window.location.origin,
    version = '1',
  } = options;

  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri,
    version,
    chainId,
    nonce,
  });

  return message.prepareMessage();
};

export default createSiweMessage;
