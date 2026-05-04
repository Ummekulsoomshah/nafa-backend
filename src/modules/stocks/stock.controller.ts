import { Controller, Post, Get, Param, Query } from "@nestjs/common";
import { StockService } from "./stock.service";
import { ApiTags } from "@nestjs/swagger";

@Controller('stocks')
export class StockController {
    constructor(
        private readonly stockservice: StockService
    ) { }

    @ApiTags('stock api')
    @Post('add-stock')
    async addStock() {
        return await this.stockservice.insertDataFromCsv("src/data/PSX_Combined_100_plus.csv");
    }

    @Get('all-stocks')
    async findAll() {
        return await this.stockservice.findAll();
    }

    @Get(':ticker')
    async findByTicker(@Param('ticker') ticker: string) {
        return await this.stockservice.findByTicker(ticker);
    }

    @Get('history/:symbol')
    async getStockHistory(
        @Param('symbol') symbol: string,
        @Query('range') range: string = '3mo',
    ) {
        return await this.stockservice.getStockHistory(symbol, range);
    }
    @Get('db-history/:symbol')
async getDbHistory(@Param('symbol') symbol: string) {
  return await this.stockservice.getDbHistory(symbol);
}
}