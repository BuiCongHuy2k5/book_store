import * as path from 'path';

import * as dotenv from 'dotenv';

import {
  getOsEnv,
  getOsPaths,
  normalizePort,
  toBool,
  toNumber,
  toArray,
  toOptionalNumber,
  getOsEnvOptional,
} from '@Libs/env/utils';

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({
  path: path.join(process.cwd(), `.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`),
});

/**
 * Environment variables
 */
export const env = {
  node: process.env.NODE_ENV || 'local',
  isProduction: process.env.NODE_ENV === 'prod',
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key',
  apmEnabled: !!getOsEnvOptional('ELASTIC_APM_SERVICE_NAME'),
  serverType: process.env.SERVER_TYPE || 'producer', //server type include "producer, worker"
  jobDefinitions: toArray(getOsEnv('JOB_DEFINITIONS')),
  serviceName: getOsEnvOptional('SERVICE_NAME') || 'starter',
  promise: {
    concurrency: toNumber(getOsEnv('PROMISE_CONCURRENCY')),
    retryTime: toNumber(getOsEnv('PROMISE_RETRY_TIME')) || 3,
  },
  app: {
    name: getOsEnv('APP_NAME'),
    host: getOsEnv('APP_HOST'),
    externalPort: getOsEnv('APP_EXTERNAL_PORT'),
    schema: getOsEnv('APP_SCHEMA'),
    routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
    externalRoutePrefix: getOsEnv('APP_EXTERNAL_ROUTE_PREFIX'),
    beRoutePrefix: getOsEnv('APP_BE_ROUTE_PREFIX'),
    port: normalizePort(getOsEnv('APP_PORT')),
  },
  log: {
    level: getOsEnv('LOG_LEVEL'),
    json: toBool(getOsEnvOptional('LOG_JSON')),
  },
  mongodb: {
    uri: getOsEnv('MONGODB_URI'),
  },
  db: {
    type: getOsEnv('DB_TYPE'),
    host: getOsEnv('DB_HOST'),
    port: toNumber(getOsEnv('DB_PORT')),
    username: getOsEnv('DB_USERNAME'),
    password: getOsEnv('DB_PASSWORD'),
    database: getOsEnv('DB_DATABASE'),
    schema: getOsEnv('DB_SCHEMA'),
    synchronize: toBool(getOsEnv('DB_SYNCHRONIZE')),
    logging: getOsEnv('DB_LOGGING'),
    logger: getOsEnv('DB_LOGGER'),
    migrations: getOsPaths('DB_MIGRATIONS'),
  },
  swagger: {
    enabled: toBool(getOsEnv('SWAGGER_ENABLED')),
    route: getOsEnv('SWAGGER_ROUTE'),
    apiDocs: getOsEnv('SWAGGER_API_DOCS'),
  },
  monitor: {
    enabled: toBool(getOsEnv('MONITOR_ENABLED')),
    route: getOsEnv('MONITOR_ROUTE'),
    username: getOsEnv('MONITOR_USERNAME'),
    password: getOsEnv('MONITOR_PASSWORD'),
  },
  graphql: {
    editor: toBool(getOsEnv('GRAPHQL_EDITOR')),
    path: getOsEnv('GRAPHQL_PATH'),
    subscriptionPath: getOsEnv('GRAPHQL_SUBSCRIPTION_PATH'),
  },
  redis: {
    url: getOsEnv('REDIS_URL_DOCKER') || 'redis://redis:6379', // Chỉ sử dụng REDIS_URL từ biến môi trường hoặc URL mặc định
    defaultExpirationTimeInSeconds: toNumber(process.env.REDIS_DEFAULT_EXPIRE) || 300, // Đặt thời gian hết hạn mặc định
  },
  jwt: {
    publicKey: getOsEnvOptional('JWT_PUBLIC_KEY'),
    privateKey: getOsEnvOptional('JWT_PRIVATE_KEY'),
  },
  graphqlJwt: {
    publicKey: getOsEnvOptional('GRAPHQL_JWT_PUBLIC_KEY'),
    privateKey: getOsEnvOptional('GRAPHQL_JWT_PRIVATE_KEY'),
  },
  aws: {
    region: getOsEnvOptional('AWS_REGION') || 'ap-southeast-1',
  },
  imageUploader: {
    maxSize: toNumber(getOsEnv('IMAGE_UPLOADER_MAX_SIZE_IN_BYTES')),
  },
  dataloaderCache: {
    ttlInMilliseconds: toNumber(getOsEnvOptional('DATALOADER_CACHE_TIME_TO_LIVE_IN_MILLISECONDS')) || 300000,
    max: toNumber(getOsEnvOptional('DATALOADER_CACHE_MAX_ITEMS')) || 100,
  },
  keycloak: {
    clientId: getOsEnv('KEYCLOAK_CLIENT_ID'),
    clientSecret: getOsEnv('KEYCLOAK_CLIENT_SECRET'),
    tokenUri: `${getOsEnv('KEYCLOAK_SERVER_URL')}/realms/${getOsEnv('KEYCLOAK_REALM')}/protocol/openid-connect/token`,
  },
};
export const envResolved = {
  ...env.redis,
  redis: {
    url: env.redis.url,
  },
};


