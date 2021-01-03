import { Application } from "express";
import Locals from "../providers/Locals";
import CORS from "./CORS";

import Http from "./Http";

class Kernel {
  public static init(express: Application): Application {
    // Check if CORS is enabled
    if (Locals.config().isCORSEnabled) {
      // Mount CORS middleware
      express = CORS.mount(express);
    }

    // Mount basic express apis middleware
    express = Http.mount(express);

    return express;
  }
}

export default Kernel;
