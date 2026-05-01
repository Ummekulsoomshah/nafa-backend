import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Stock } from './entities/stock.entity';
import * as fs from 'fs';
import csvParser from 'csv-parser';
import axios from 'axios';

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

  // stock.service.ts — add this method

async getStockHistory(symbol: string, range: string = '3mo') {
  try {
    // PSX ticker format for Yahoo Finance
    const yahooSymbol = `${symbol}.KA`;
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`;

    const response = await axios.get(url, {
      params: {
        interval: '1d',
        range: range, // 1mo, 3mo, 6mo, 1y
      },
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const result = response.data?.chart?.result?.[0];
    if (!result) throw new Error('No data from Yahoo Finance');

    const timestamps: number[] = result.timestamp;
    const closes: number[]     = result.indicators?.quote?.[0]?.close;
    const opens: number[]      = result.indicators?.quote?.[0]?.open;
    const highs: number[]      = result.indicators?.quote?.[0]?.high;
    const lows: number[]       = result.indicators?.quote?.[0]?.low;
    const volumes: number[]    = result.indicators?.quote?.[0]?.volume;

    const history = timestamps.map((ts, i) => ({
      date:   new Date(ts * 1000).toISOString().split('T')[0],
      open:   opens?.[i]   ? parseFloat(opens[i].toFixed(2))   : null,
      high:   highs?.[i]   ? parseFloat(highs[i].toFixed(2))   : null,
      low:    lows?.[i]    ? parseFloat(lows[i].toFixed(2))    : null,
      close:  closes?.[i]  ? parseFloat(closes[i].toFixed(2))  : null,
      volume: volumes?.[i] ?? null,
    })).filter(d => d.close !== null);

    // Calculate stats
    const prices    = history.map(h => h.close!);
    const firstPrice = prices[0];
    const lastPrice  = prices[prices.length - 1];
    const change     = lastPrice - firstPrice;
    const changePct  = ((change / firstPrice) * 100).toFixed(2);
    const highest    = Math.max(...prices);
    const lowest     = Math.min(...prices);

    return {
      symbol,
      yahooSymbol,
      range,
      history,
      stats: {
        firstPrice,
        lastPrice,
        change:    parseFloat(change.toFixed(2)),
        changePct: parseFloat(changePct),
        highest,
        lowest,
        totalDays: history.length,
      },
    };
  } catch (e) {
    throw new Error(`Failed to fetch history for ${symbol}: ${e}`);
  }
}
}