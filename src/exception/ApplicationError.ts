class ApplicationError implements Error {
  public name = "ApplicationError";
  constructor(public message: string, public code: number = 400) {}
  toString() {
    return `${this.name}: ${this.message}`;
  }
}

export default ApplicationError;
