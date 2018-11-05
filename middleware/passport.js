const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
const { cert } = require('../config/keys');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: cert,
};

module.exports = new JwtStrategy(options, async (payload, done) => {
  try {
    // здесь payload это payload нашего token, с его свойствами email, userId
    const user = await User.findById((payload.userId)).select('email');
    // console.log('passport user:', user);

    if (user) {
      // в метод done необходимо передать три параметра: done(error, user, info)
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (e) {
    console.log(e);
  }
});
