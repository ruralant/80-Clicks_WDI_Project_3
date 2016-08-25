dbURIs = {
  test: "mongodb://localhost/userauth-test",
  development: 'mongodb://localhost/userauth',
  prodcution: process.env.MONGODB_URI || "mongodb://localhost/userauth"
}

module.exports = function (env) {
  return dbURIs[env];
}