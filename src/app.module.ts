import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelModule } from './modules/model';
import { AuthModule } from './modules/auth';
import { AwsModule } from './modules/aws';

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_KEY,
  AWS_REGION,
  AWS_S3_SIGNATURE_VERSION,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  JWT_TOKEN_SECRET,
} = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST,
      port: parseInt(DB_PORT, 10),
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ModelModule,
    /* Core Modules */
    AwsModule.register({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_KEY,
      region: AWS_REGION,
      s3: {
        signatureVersion: AWS_S3_SIGNATURE_VERSION,
        region: AWS_REGION,
      },
      sqs: {
        region: AWS_REGION,
      },
    }),
    AuthModule.register({
      secret: JWT_TOKEN_SECRET,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
