import Log from "../middlewares/Log";

class ApplicationError implements Error {
  public name = "ApplicationError";
  constructor(public message: string, public code: number = 400) {
    Log.info(`${code} - ${this.name}: ${message}`);
  }
  toString() {
    return `${this.message}`;
  }
}

export default ApplicationError;
