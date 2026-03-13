import { Controller, Post ,Get,Param} from "@nestjs/common";
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
}