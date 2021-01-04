import { Application } from "express";
import Locals from "../providers/Locals";
import CORS from "./CORS";

import Http from "./Http";
import Swagger from "./Swagger";

class Kernel {
  public static init(express: Application): Application {
    // Check if CORS is enabled
    if (Locals.config().isCORSEnabled) {
      // Mount CORS middleware
      express = CORS.mount(express);
    }

    // Mount basic express apis middleware
    express = Http.mount(express);

    // Mount basic document middleware
    express = Swagger.mount(express);

    return express;
  }
}

export default Kernel;
