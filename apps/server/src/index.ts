import 'dotenv/config';
import os from 'os';
import chalk from 'chalk';
import { createClient } from 'redis';
import mongoose from 'mongoose';
import { ENV_VARS } from '@/app-constants';
import { console_log } from '@/utils';
import app from './app';

const hostName = os.hostname();
const port = ENV_VARS.port;

const redis_username = ENV_VARS.redis.username;
const redis_user_pswd = ENV_VARS.redis.password;
const redis_host = ENV_VARS.redis.host;
const redis_port = ENV_VARS.redis.port;
const redisURL = `redis://${redis_username}:${redis_user_pswd}@${redis_host}:${redis_port}`;

/**
 *  If no redis username or password is set in
 *  connection string, the authentication will fail.
 *  In that case, connect to local instance of redis
 *  on port 6379.
 */
const client = createClient({
  ...(Boolean(redis_username) && {
    url: redisURL
  })
});

const db_url = ENV_VARS.mongo.cluster_url;
const db_name = ENV_VARS.mongo.db_name;
const db_user = ENV_VARS.mongo.cluster_user;
const db_pswd = ENV_VARS.mongo.cluster_pswd;
const db_connection_string = `mongodb+srv://${db_user}:${db_pswd}@${db_url}/${db_name}?retryWrites=true&w=majority`;

async function bootstrap() {
  // try {
  //   if (!client.isOpen) {
  //     await client.connect();
  //   }
  //   console_log('Connected to Redis', `${redis_host}:${redis_port}`);
  // } catch (err) {
  //   console.log(chalk.red('⚠ Redis Connection Error ⚠'));
  //   console.log(err);
  //   process.exit(1);
  // }

  try {
    await mongoose.connect(db_connection_string, {
      autoIndex: true
    });
    console_log('Connected to DATABASE', `${db_name}@${db_url}`);
  } catch (err) {
    console.log(chalk.red('⚠ Error connecting to the Database ⚠'));
    console.log(err);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(
      chalk.yellow(
        `[ ⚡️ ${chalk.magenta(hostName)} ⚡️ ]`,
        chalk.cyan(`Server running on port ${port}`)
      )
    );
  });
}

/* Gracefully handle SIGTERM or SIGINT */
async function handleExit(signal: string) {
  console.log(`Received ${signal}`);
  console_log('Database', 'Disconnecting... 🔌');
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error while disconnecting from the database:', error);
  }
  process.exit(0);
}

process.on('SIGTERM', () => handleExit('SIGTERM'));
process.on('SIGINT', () => handleExit('SIGINT'));

bootstrap();
