import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockService } from './stock.service';
import { Stock } from './entities/stock.entity';
import { StockController } from './stock.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  controllers:[StockController],
  providers: [StockService]
})
export class StockModule {}