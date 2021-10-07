import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { TagnameController } from './tagname.controller';
import { TagName } from './tagname.entity';
import { TagnameService } from './tagname.service';

@Module({
  imports:[TypeOrmModule.forFeature([TagName,User])],
  controllers: [TagnameController],
  providers: [TagnameService]
})
export class TagnameModule {}
