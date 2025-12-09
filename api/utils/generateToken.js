// jsonwebtoken library is for creating and verifying JWTs
const jwt = require("jsonwebtoken");

// this function to generate a JWT for a given user ID

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
// sytax: jwt.sign(payload, secretOrPrivateKey, options)
// Payload: contains the user ID in the token, Secret:  secret key stored in environment variables
module.exports = generateToken;
