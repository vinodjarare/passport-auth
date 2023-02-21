const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

exports.connectPassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const existingUser = await User.findOne({ profileId: profile.id });

          if (existingUser) {
            return done(null, existingUser);
          }

          const newUser = await User.create({
            profileId: profile.id,
            name: profile.displayName,
            photo: profile.photos[0].value,
            provider: profile.provider,
          });

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // use email as username
      },
      function (email, password, done) {
        User.findOne({ email: email }, function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, { message: "Incorrect email." });
          }
          console.log(user);
          bcrypt.compare(password, user.password, function (err, isMatch) {
            if (err) {
              return done(err);
            }
            if (!isMatch) {
              return done(null, false, { message: "Incorrect password." });
            }
            return done(null, user);
          });
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
