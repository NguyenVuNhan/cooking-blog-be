import { is } from "bluebird";
import { Application, NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import Log from "../middlewares/Log";
import ApplicationError from "./ApplicationError";

class Handler {
  /**
   * Handles all the not found routes
   */
  public static notFoundHandler(_express: Application): any {
    _express.use((req, res) => {
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

      Log.error(`Path '${req.originalUrl}' not found [IP: '${ip}']!`);
      return res.status(404).json({
        data: { error: "Not found" },
        message: "Not found",
        success: false,
      });
    });

    return _express;
  }

  /**
   * Handles validation results
   */
  static validatorHandler(req: Request, res: Response, next: NextFunction) {
    try {
      validationResult(req).throw();
      next();
    } catch (err) {
      res.status(400).json({
        data: { ...err },
        message: "Error",
        success: false,
      });
    }
  }

  /**
   * Handles your api/web routes errors/exception
   */
  static clientErrorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): any {
    if (err instanceof ApplicationError) {
      return res.status(err.code).json({
        data: { error: err.toString() },
        message: "Something went wrong!",
        success: false,
      });
    }

    if (req.xhr) {
      return res.status(500).json({
        data: {
          error: "Something went wrong!",
        },
        message: "Something went wrong!",
        success: false,
      });
    }

    return next(err);
  }

  /**
   * Register error / exception monitoring
   */
  static logErrors(
    err: any,
    _req: Request,
    _res: Response,
    next: NextFunction
  ): any {
    Log.error(err.stack || err.message);

    return next(err);
  }
}

export default Handler;
