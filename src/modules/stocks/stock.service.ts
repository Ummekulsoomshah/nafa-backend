import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import * as fs from 'fs';
import csvParser from 'csv-parser';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  async insertDataFromCsv(filePath: string): Promise<void> {
    const stocks: Stock[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          const stock = new Stock();
          stock.Ticker = row['Ticker'];
          stock.CompanyName = row['CompanyName'];
          stock.Status = row['Status'];
          stock.OpenPrice = row['OpenPrice'];
          stock.ClosePrice = row['ClosePrice'];
          stock.DailyReturn = row['DailyReturn%'];
          stock.SharesOutstanding = row['SharesOutstanding'];
          stock.MarketCap = row['MarketCap'];
          stock.CAGR = row['CAGR'];
          stock.Volatility = row['Volatility'];
          stock.RiskScore = row['RiskScore'];
          stock.RiskLevel = row['RiskLevel'];
          stock.Sector = row['Sector'];
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
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async findAll(): Promise<Stock[]> {
    return this.stockRepository.find();
  }

  async findByTicker(ticker: string): Promise<Stock | null> {
    return this.stockRepository.findOne({ where: { Ticker: ticker } });
  }
  
}