import { Application } from "express";
import { INext, IReq, IRes } from "../@types/vendors";
import Log from "../middlewares/Log";

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
   * Handles your api/web routes errors/exception
   */
  public static clientErrorHandler(
    err: any,
    req: IReq,
    res: IRes,
    next: INext
  ): any {
    Log.error(err.stack);

    if (req.xhr) {
      return res.status(500).send({
        data: {
          error: "Something went wrong!",
        },
        message: "Something went wrong!",
        success: false,
      });
    } else {
      return next(err);
    }
  }

  /**
   * Register your error / exception monitoring
   * tools right here ie. before "next(err)"!
   */
  public static logErrors(err: any, _req: IReq, _res: IRes, next: INext): any {
    Log.error(err.stack);

    return next(err);
  }
}

export default Handler;
