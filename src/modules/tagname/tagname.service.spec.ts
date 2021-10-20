import { Test, TestingModule } from '@nestjs/testing';
import { TagnameService } from './tagname.service';

describe('TagnameService', () => {
  let service: TagnameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagnameService],
    }).compile();

    service = module.get<TagnameService>(TagnameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
