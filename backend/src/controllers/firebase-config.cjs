var admin = require("firebase-admin");

var serviceAccount = require("./cpen-321-ubc-course-connect-firebase-adminsdk-u9hn2-d990795c7e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports.admin = admin

