import { Test, TestingModule } from '@nestjs/testing';
import { TagnameController } from './tagname.controller';

describe('TagnameController', () => {
  let controller: TagnameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagnameController],
    }).compile();

    controller = module.get<TagnameController>(TagnameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
