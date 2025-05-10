import { Global, Module } from '@nestjs/common';

import { NetworkService } from './service/network.service';

@Global()
@Module({
  providers: [NetworkService],
  exports: [NetworkService],
})
export class SharedModule {}
