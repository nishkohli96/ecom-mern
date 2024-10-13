import { Response } from 'express';
import httpStatus from 'http-status';
import { JsonObject } from '@ecom-mern/shared';

type ResponsePayload = {
  res: Response;
  message?: string;
  data?: JsonObject | null;
  error?: string[];
};

class ResponseService {
  private respond(
    res: Response,
    statusCode: number,
    message: string,
    data: JsonObject | null,
    error: string[] | null
  ) {
    return res.status(statusCode).json({
      statusCode,
      message,
      data,
      error
    });
  }

  /* 200 */
  success({ res, message, data }: ResponsePayload) {
    return this.respond(
      res,
      httpStatus.OK,
      message ?? (httpStatus[200] as string),
      data ?? null,
      null
    );
  }

  /* 400 */
  badRequest({ res, message, error }: ResponsePayload) {
    return this.respond(
      res,
      httpStatus.BAD_REQUEST,
      message ?? (httpStatus[400] as string),
      null,
      error ?? []
    );
  }

  /* 401 */
  unauthorized({ res, message, error }: ResponsePayload) {
    return this.respond(
      res,
      httpStatus.UNAUTHORIZED,
      message ?? (httpStatus[401] as string),
      null,
      error ?? []
    );
  }

  /* 403 */
  forbidden({ res, message, error }: ResponsePayload) {
    return this.respond(
      res,
      httpStatus.FORBIDDEN,
      message ?? (httpStatus[403] as string),
      null,
      error ?? []
    );
  }

  /* 404 */
  notFound({ res, message, error }: ResponsePayload) {
    return this.respond(
      res,
      httpStatus.NOT_FOUND,
      message ?? (httpStatus[404] as string),
      null,
      error ?? []
    );
  }

  /* 422 */
  validationFailed({ res, message, error }: ResponsePayload) {
    return this.respond(
      res,
      httpStatus.UNPROCESSABLE_ENTITY,
      message ?? (httpStatus[422] as string),
      null,
      error ?? []
    );
  }

  /* 500 */
  serverError({ res, message, error }: ResponsePayload) {
    return this.respond(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      message ?? (httpStatus[500] as string),
      null,
      error ?? []
    );
  }
}

export default new ResponseService();
