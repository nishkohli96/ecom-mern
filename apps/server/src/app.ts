import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import swaggerUI, { SwaggerUiOptions } from 'swagger-ui-express';
import { ApiRoutesConfig } from '@ecom-mern/shared';
import { requestLogger } from '@/utils';
import { ENV_VARS } from '@/app-constants';
import winstonLogger from '@/winston-logger';
import * as Routes from '@/routes';
import swaggerConfig from '@/docs/swagger';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsConfig = {
  origin: [ENV_VARS.client_url],
  credentials: true
};

app.use(cors(corsConfig));
app.use(cookieParser());
app.use(requestLogger);

/* https://www.npmjs.com/package/helmet */
app.use(helmet());

/* https://www.npmjs.com/package/express-mongo-sanitize#what-is-this-module-for */
app.use(
  mongoSanitize({
    allowDots: true,
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
      winstonLogger.warn(`This request[${key}] is sanitized`, req);
    }
  })
);

/* Serve swagger docs on "/api-docs" endpoint */
const swaggerOptions: SwaggerUiOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { background-color: #000000 }'
};
app.get('/api-docs/swagger.json', (_, res: Response) =>
  res.json(swaggerConfig)
);
app.use(
  '/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(swaggerConfig, swaggerOptions)
);

const apiPrefix = ApiRoutesConfig.apiPrefix;
function generateRoute(pathName: string) {
  return `${apiPrefix}/${pathName}`;
}

app.get(apiPrefix, (_, response: Response) => {
  response.status(200).send('Api is up & running!!!');
});

app.use(generateRoute(ApiRoutesConfig.auth.pathName), Routes.authRouter);
app.use(
  generateRoute(ApiRoutesConfig.checkout.pathName),
  Routes.checkoutRouter
);
app.use(generateRoute(ApiRoutesConfig.cart.pathName), Routes.cartRouter);
app.use(generateRoute(ApiRoutesConfig.grocery.pathName), Routes.groceryRouter);
app.use(generateRoute(ApiRoutesConfig.orders.pathName), Routes.orderRouter);
app.use(generateRoute(ApiRoutesConfig.user.pathName), Routes.userRouter);
app.use(
  generateRoute(ApiRoutesConfig.razorpay.pathName),
  Routes.razorpayRouter
);

/* To be written at last */
app.get('*', (req: Request, response: Response) => {
  const notFoundMsg = `Not Found - "${req.originalUrl}"`;
  winstonLogger.warn(notFoundMsg);
  response.status(404).send({
    success: false,
    message: notFoundMsg,
    data: null
  });
});

export default app;
