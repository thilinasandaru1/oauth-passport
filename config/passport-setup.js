const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");

const keys = require("./keys");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      // options for the google strategy
      callbackURL: "/auth/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
      // check if user already exists on our db
      User.findOne({ googleId: profile.id }).then(currentUser => {
        if (currentUser) {
          // already have the user
          console.log("user is: ", currentUser);
          done(null, currentUser);
        } else {
          // if not, create user in our db
          new User({
            googleId: profile.id,
            username: profile.displayName,
            thumbnail: profile._json.picture
          })
            .save()
            .then(newUser => {
              console.log("new user created: ", newUser);
            });
          done(null, newUser);
        }
      });
    }
  )
);
