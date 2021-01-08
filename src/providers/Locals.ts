import { Application } from "express";
import dotenv from "dotenv";

class Locals {
  /**
   * Makes env configs available for your app
   * throughout the app's runtime
   */
  public static config(): any {
    dotenv.config({
      path: `${__dirname}/../../.env${
        process.env.NODE_ENV === "test" ? ".test" : ""
      }`,
    });

    return {
      node_env: process.env.NODE_ENV || "development",
      isProduction: process.env.NODE_ENV === "production",
      isTest: process.env.NODE_ENV === "test",
      isDevelopment: process.env.NODE_ENV === "development",
      maxUploadLimit: process.env.APP_MAX_UPLOAD_LIMIT || "50mb",
      maxParameterLimit: process.env.APP_MAX_PARAMETER_LIMIT || "5000",

      url: process.env.APP_URL || `http://localhost:${process.env.PORT}`,
      port: process.env.PORT || 5000,
      appSecret: process.env.APP_SECRET || "This is your responsibility!",
      mongooseUrl: process.env.MONGOOSE_URL,

      name: process.env.APP_NAME || "My App",
      year: new Date().getFullYear(),
      description: process.env.APP_DESCRIPTION || "App description",

      isCORSEnabled: process.env.CORS_ENABLED || true,
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || 3,
      apiPrefix: process.env.API_PREFIX || "api",

      logDays: process.env.LOG_DAYS || 10,

      queueMonitor: process.env.QUEUE_HTTP_ENABLED || true,
      queueMonitorHttpPort: process.env.QUEUE_HTTP_PORT || 5550,

      redisHttpPort: process.env.REDIS_QUEUE_PORT || 6379,
      redisHttpHost: process.env.REDIS_QUEUE_HOST || "127.0.0.1",
      redisPrefix: process.env.REDIS_QUEUE_DB || "q",
      redisDB: process.env.REDIS_QUEUE_PREFIX || 3,
    };
  }

  /**
   * Injects your config to the app's locals
   */
  public static init(express: Application): Application {
    express.locals = { ...express.locals, ...this.config() };
    return express;
  }
}

export default Locals;
