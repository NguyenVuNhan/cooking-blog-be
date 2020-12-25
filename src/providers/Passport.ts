import { Application } from "express";
import passport from "passport";

import JWT from "../services/strategies/JWT";

import User from "../models/User";
import Log from "../middlewares/Log";

class Passport {
  public mountPackage(express: Application): Application {
    express = express.use(passport.initialize());
    express = express.use(passport.session());

    passport.serializeUser<any, any>((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser<any, any>((id, done) => {
      User.findById(id)
        .then((user) => done(null, user))
        .catch((err) => done(err, false));
    });

    this.mountLocalStrategies();

    return express;
  }

  public mountLocalStrategies(): void {
    try {
      JWT.init(passport);
    } catch (err) {
      Log.error(err.stack);
    }
  }
}

export default new Passport();
