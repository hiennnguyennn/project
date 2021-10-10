import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { TagnameController } from './tagname.controller';
import { TagName } from './entity/tagname.entity';
import { TagnameService } from './tagname.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[TypeOrmModule.forFeature([TagName,User]),UserModule],
  controllers: [TagnameController],
  providers: [TagnameService]
})
export class TagnameModule {}
