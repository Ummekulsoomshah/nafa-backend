import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();
const configService = new ConfigService();

const isTsEnv = __filename.endsWith('.ts');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASS'),
  database: configService.get<string>('DB_NAME'),
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false,
  entities: ['**/*.entity.ts'],
 migrations: [isTsEnv ? 'src/db/migrations/*.ts' : 'dist/db/migrations/*.js'],
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;