import { Application } from "express";
import Locals from "./Locals";
import Log from "../middlewares/Log";

import apiRouter from "./../routes/api";

class Routes {
  public mountApi(express: Application): Application {
    const apiPrefix = Locals.config().apiPrefix;
    Log.info("Routes :: Mounting API Routes...");

    return express.use(`/${apiPrefix}`, apiRouter);
  }
}

export default new Routes();
