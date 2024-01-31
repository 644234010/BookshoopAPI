const db = require("../config/db");
const bcrypt = require("bcryptjs");
const sign = require("../middleware/jwtMiddleware").sign;

//New user Resister
const register = async function (req, res) {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  let user = {
    username: req.body.username,
    role: req.body.role,
    password: hashedPassword,
  };

  res.setHeader("Content-Type", "application/json");

  try {
    var referencePath = "/users/" + user.username + "/";

    const hasUsername = await db
      .ref(referencePath)
      .once("value")
      .then((res) => res.exists());

    //Add to Firebase
    var userReference = db.ref(referencePath);
    if (hasUsername == false) {
      let useradd = {
        username: user.username,
        password: hashedPassword,
        role: user.role,
      };

      let error = await userReference.update(useradd);
      if (error) {
        res
          .status(error.statusCode || 500)
          .send("Data could not be saved." + error);
      } else {
        return res
          .status(201)
          .send({ error: false, message: "New user registered" });
      }
    } else {
      res
        .status(409)
        .send({ error: "Cannot add this username, username is already used." });
    }
  } catch (err) {
    return res.send(err);
  }
};

//User Sign In and get Token
const signin = async function (req, res) {
  res.setHeader("Content-Type", "application/json");

  const secretkey = process.env.SECRET;

  var username = req.body.username;
  var referencePath = "/users/" + username + "/";

  const hasUsername = await db
    .ref(referencePath)
    .once("value")
    .then((res) => res.exists());

  if (hasUsername == false) {
    return res.status(401).send({ error: "Cannot find this username." });
  } else {
    const userDetail = await db
      .ref(referencePath)
      .once("value")
      .then((res) => res.val());

    let hashedPassword = userDetail.password;
    let username = userDetail.username;
    const correct = bcrypt.compareSync(req.body.password, hashedPassword);
    if (correct) {
      let user = {
        username: req.body.username,
        role: userDetail.role,
        password: hashedPassword,
      };

      // create a token
      let token = sign(user, secretkey);

      return res.status(201).send({
        error: false,
        message: "user sigin",
        username: username,
        accessToken: token,
      });
    } else {
      return res.status(401).send("login fail");
    }
  }
};

module.exports = {
  register,
  signin,
};
