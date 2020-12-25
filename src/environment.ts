import * as dotenv from "dotenv";

dotenv.config({
  path: `${__dirname}/../.env.${
    process.env.NODE_ENV === "test" ? ".test" : ""
  }`,
});

/**
 * Environment variables
 */
export const env = {
  node: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  isDevelopment: process.env.NODE_ENV === "development",
};
