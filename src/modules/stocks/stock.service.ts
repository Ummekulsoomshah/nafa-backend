import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Stock } from './entities/stock.entity';
import * as fs from 'fs';
import csvParser from 'csv-parser';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    private readonly dataSource: DataSource,
  ) {}

  // ── Latest only subquery helper ──
  private latestStocksQuery() {
    return this.dataSource
      .createQueryBuilder(Stock, 's')
      .innerJoin(
        (qb) =>
          qb
            .select('sub.symbol', 'symbol')
            .addSelect('MAX(sub.timestamp)', 'latest_time')
            .from(Stock, 'sub')
            .groupBy('sub.symbol'),
        'latest',
        's.symbol = latest.symbol AND s.timestamp = latest.latest_time',
      );
  }

  async findAll(): Promise<Stock[]> {
    return this.latestStocksQuery().getMany();
  }

  async findByTicker(ticker: string): Promise<Stock | null> {
    return this.latestStocksQuery()
      .where('s.symbol = :ticker', { ticker })
      .getOne();
  }

  async findBySector(sector: string): Promise<Stock[]> {
    return this.latestStocksQuery()
      .where('s.sector = :sector', { sector })
      .getMany();
  }

  async findByRisk(riskLevel: string): Promise<Stock[]> {
    return this.latestStocksQuery()
      .where('s.risk_level = :riskLevel', { riskLevel })
      .getMany();
  }

  async findByShariah(status: string): Promise<Stock[]> {
    return this.latestStocksQuery()
      .where('s.shariah_status = :status', { status })
      .getMany();
  }

  async insertDataFromCsv(filePath: string): Promise<void> {
    const stocks: Stock[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          const stock = new Stock();
          stock.symbol         = row['symbol'];
          stock.name           = row['name'];
          stock.open           = parseInt(row['open']);
          stock.high           = parseInt(row['high']);
          stock.low            = parseInt(row['low']);
          stock.current_price  = parseInt(row['current_price']);
          stock.change         = parseInt(row['change']);
          stock.volume         = parseInt(row['volume']);
          stock.beta           = parseInt(row['beta']);
          stock.risk_level     = row['risk_level'];
          stock.sector         = row['sector'];
          stock.shariah_status = row['shariah_status'];
          stock.timestamp      = row['timestamp'];
          stocks.push(stock);
        })
        .on('end', async () => {
          try {
            await this.stockRepository.save(stocks);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  }
}