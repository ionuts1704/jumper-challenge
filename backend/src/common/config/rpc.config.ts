import * as process from 'process';
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { arbitrumSepolia, optimismSepolia } from 'viem/chains';

export default registerAs('rpc', () => {
  const values = {
    apiKey: process.env.RPC_API_KEY,
    // supportedChains: {
    //   [arbitrumSepolia.id]: {
    //     name: arbitrumSepolia.name,
    //     chainId: arbitrumSepolia.id,
    //     rpcUrl: `https://arb-sepolia.g.alchemy.com/v2/${process.env.RPC_API_KEY}`,
    //     contracts: ['0xD0c10d64A70C5dF6497d3a4A9A0A0319060108ad'],
    //   },
    //   [optimismSepolia.id]: {
    //     name: optimismSepolia.name,
    //     chainId: optimismSepolia.id,
    //     rpcUrl: `https://opt-sepolia.g.alchemy.com/v2/${process.env.RPC_API_KEY}`,
    //     contracts: ['0x95F1eaF2313bd83aDe3d3301CeF8c6588ad19BC6'],
    //   },
    // },
  };

  const schema = Joi.object({
    apiKey: Joi.string().required(),
    // supportedChains: Joi.object().pattern(
    //   Joi.number(),
    //   Joi.object({
    //     name: Joi.string().required(),
    //     chainId: Joi.number().required(),
    //     rpcUrl: Joi.string().required(),
    //     contracts: Joi.array().items(Joi.string()).min(1),
    //   }),
    // ),
  });

  const { error } = schema.validate(values, { abortEarly: false });

  if (error) {
    throw new Error(`Validation failed: ${error.message}`);
  }

  return values;
});
