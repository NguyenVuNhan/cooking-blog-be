import { Application } from "express";

import Http from "./Http";

class Kernel {
  public static init(express: Application): Application {
    // Mount basic express apis middleware
    express = Http.mount(express);

    return express;
  }
}

export default Kernel;
