import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';
import winstonLogger from 'winston-logger';

export function console_log(task: string, status: string): void {
  console.log(
    chalk.yellow('[', chalk.magenta(`${task}`), ']::'),
    chalk.cyan(`${status}`)
  );
}

export function requestLogger(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const successGreen = chalk.hex('#3BAF2A');
  console_log(`${chalk.bold(request.method)}`, `${chalk.white(request.url)}`);
  response.on('finish', () => {
    const isSuccess = response.statusCode === 200;
    console.log(
      `    -> ${
        isSuccess
          ? successGreen(response.statusCode)
          : chalk.red(response.statusCode)
      } ${response.statusMessage}`
    );
  });
  next();
}

export function printSuccessMsg(msg: string): void {
  console.log(chalk.green(`✅ SUCCESS - ${msg}`));
}

export function printError(error: unknown): void {
  console.log(chalk.red(`⚠ ERROR - ${error}`));
}

export function errorLogger(res: Response, error: unknown) {
  printError(error);
  const err = JSON.stringify(error);
  winstonLogger.error(err);
  res.status(500).send(err);
}
