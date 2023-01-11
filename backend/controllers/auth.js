const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function isInvalidString(string) {
  if (string === undefined || string.length === 0) {
    return true;
  }
  return false;
}

exports.register = (req, res, next) => {
  const { name, phone, password } = req.body;
  console.log(req.body);
  if (
    isInvalidString(name) ||
    isInvalidString(password) ||
    isInvalidString(phone)
  ) {
    res.status(400).json({
      message: "Bad Request: Either Email or Password is missing",
      success: false,
    });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    User.findAll({ where: { phone: phone } }).then((users) => {
      const user = users[0];
      if (user) {
        res.json({
          success: false,
          message: "User Already exist. Please Login",
        });
      } else {
        console.log("password is hashed As : ", hash);
        User.create({
            name: name,
            phone: phone,
            password: hash
        })
          .then(() => {
            res.status(200).json({
              success: true,
              message: "Congratulations!! You have signed up successfully",
            });
          })
          .catch((err) => {
            console.log(err);
            res.json({ success: false, message: "error while registering" });
          });
      }
    });
  });
};

exports.login = async (req, res, next) => {
  console.log(req.body);
  const { phone, password } = req.body;
  if (isInvalidString(phone) || isInvalidString(password)) {
   return res.status(400).json({
      message: "Bad Request: Either Email or Password is missing",
      success: false,
    });
  }

  try {
    const user = await User.findOne({ where: { phone: phone } });
    if (!user)
      return res.status(404).json({ success: false, message: "user does not exist" });

    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch)
      return res.status(401).json({ success: false, message: "Incorrect Password" });

    const token = jwt.sign({ id: user.id }, `${process.env.TOKEN_SECRET}`);
    return res.json({
      token: token,
      phone: user.phone,
      success: true,
      message: "Congratulation!, Successfully logged in",
    });
  } catch (err) {
    res.json(err);
    console.log(err);
  }
};
