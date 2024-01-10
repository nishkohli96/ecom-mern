import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { ApiRoutesConfig } from '@ecom/mern-shared';
import { requestLogger } from 'utils';
import { ENV_VARS } from 'app-constants';
import winstonLogger from 'winston-logger';
import * as Routes from 'routes';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsConfig = {
  origin: [ENV_VARS.client_url],
  credentials: true,
};

app.use(cors(corsConfig));
app.use(cookieParser());
app.use(requestLogger);

/* https://www.npmjs.com/package/helmet */
app.use(helmet());

/* https://www.npmjs.com/package/express-mongo-sanitize#what-is-this-module-for */
app.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      winstonLogger.warn(`This request[${key}] is sanitized`, req);
    },
  })
);

const apiPrefix = ApiRoutesConfig.apiPrefix;

app.get(apiPrefix, (_: Request, response: Response) => {
  response.status(200).send('Api is up & running!!!');
});

app.use(`${apiPrefix}/${ApiRoutesConfig.auth.pathName}`, Routes.authRouter);
app.use(
  `${apiPrefix}/${ApiRoutesConfig.checkout.pathName}`,
  Routes.checkoutRouter
);
app.use(`${apiPrefix}/${ApiRoutesConfig.cart.pathName}`, Routes.cartRouter);
app.use(
  `${apiPrefix}/${ApiRoutesConfig.grocery.pathName}`,
  Routes.groceryRouter
);
app.use(`${apiPrefix}/${ApiRoutesConfig.orders.pathName}`, Routes.orderRouter);
app.use(`${apiPrefix}/${ApiRoutesConfig.user.pathName}`, Routes.userRouter);
app.use(
  `${apiPrefix}/${ApiRoutesConfig.razorpay.pathName}`,
  Routes.razorpayRouter
);

/* To be written at last */
app.get('*', (req: Request, response: Response) => {
  const notFoundMsg = `Not Found - "${req.originalUrl}"`;
  winstonLogger.warn(notFoundMsg);
  response.status(404).send({
    success: false,
    message: notFoundMsg,
    data: null,
  });
});

export default app;
