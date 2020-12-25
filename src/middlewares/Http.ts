import { Application } from "express";
import compress from "compression";
import connect from "connect-mongo";
import bodyParser from "body-parser";
import session from "express-session";

import Log from "./Log";
import Locals from "../providers/Locals";
import Passport from "../providers/Passport";

const MongoStore = connect(session);

class Http {
  public static mount(express: Application): Application {
    Log.info("Booting the 'HTTP' middleware...");

    // Enables the request body parser
    express.use(
      bodyParser.json({
        limit: Locals.config().maxUploadLimit,
      })
    );

    express.use(
      bodyParser.urlencoded({
        limit: Locals.config().maxUploadLimit,
        parameterLimit: Locals.config().maxParameterLimit,
        extended: false,
      })
    );

    // Disable the x-powered-by header in response
    express.disable("x-powered-by");

    /**
     * Enables the session store
     *
     * Note: You can also add redis-store
     * into the options object.
     */
    const options = {
      resave: true,
      saveUninitialized: true,
      secret: Locals.config().appSecret,
      cookie: {
        maxAge: 1209600000, // two weeks (in ms)
      },
      store: new MongoStore({
        url: process.env.MONGOOSE_URL,
        autoReconnect: true,
      }),
    };

    express.use(session(options));

    // Enables the "gzip" / "deflate" compression for response
    express.use(compress());

    // Loads the passport configuration
    express = Passport.mountPackage(express);

    return express;
  }
}

export default Http;
