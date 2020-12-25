import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import User from "../../models/User";
import Locals from "../../providers/Locals";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: Locals.config().appSecret,
};

class JWT {
  public static init(passport: typeof import("passport")): void {
    passport.use(
      new Strategy(opts, (payload, done) => {
        User.findById(payload.id)
          .then((user) => (user ? done(null, user) : done(null, false)))
          .catch((err) => done(err, false));
      })
    );
  }
}

export default JWT;
