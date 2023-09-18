const userModel = require("../model/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const logger = require("../logger/logger");

//login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { method, originalUrl } = req;
    const apimessage = `[${method}] ${originalUrl}`;

    if (!email || !password) {
      logger.error(`${apimessage}  All fields are required`);
      return res.status(400).send({ msg: "All fields are required!" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      logger.error(`${apimessage}  Cant find user`);
      return res.status(404).send({ msg: "Cant find user" });
    }
    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      logger.error(`${apimessage}  Password dont match`);
      return res.status(400).send({ msg: "Password dont match" });
    }

    if (!user.verified) {
      logger.error(`${apimessage} User is not approved yet`);
      return res.status(401).send({ msg: "User is not approved yet" });
    }

    //create jwt token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        roles: user.roles,
        department: user.department,
        firstName: user.firstname,
        lastName: user.lastname,
        passwordExists: true,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1m" }
    );

    const refreshToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        roles: user.roles,
        department: user.department,
        firstName: user.firstname,
        lastName: user.lastname,
        passwordExists: true,
      },
      process.env.REFRESH_TOKEN_sECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // res.header('Authorization',accessToken)
    logger.info(`${apimessage} User ${user.username} Successfully logged in`);
    return res.status(200).send(accessToken);
  } catch (err) {
    return res.status(500).send({ msg: err });
  }
};

//get new access token

module.exports.refresh = async (req, res) => {
  let cookie = req.cookies;
  const { method, originalUrl } = req;
  const apimessage = `[${method}] ${originalUrl}`;

  if (!cookie?.jwt) {
    logger.error(`${apimessage} Unauthorized`);
    return res.status(401).send({ msg: "Unauthorized" });
  }

  const refreshToken = cookie.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_sECRET,
    async (err, decoded) => {
      const foundUser = await userModel.findOne({ email: decoded.email });
      if (!foundUser) {
        logger.error(`${apimessage} Unauthorized`);
        return res.status(401).send({ msg: "Unauthorized" });
      }
      const accessToken = jwt.sign(
        {
          userId: foundUser._id,
          email: foundUser.email,
          username: foundUser.username,
          roles: foundUser.roles,
          department: foundUser.department,
          firstName: foundUser.firstname,
          lastName: foundUser.lastname,
          passwordExists: foundUser.password ? true : false,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1m" }
      );
      // res
      // .header('Authorization', accessToken)

      return res.status(200).send({
        accessToken,
      });
    }
  );
};

// clear cookie

module.exports.logout = async (req, res) => {
  let cookie = req.cookies;
  const { method, originalUrl } = req;
  const apimessage = `[${method}] ${originalUrl}`;

  if (!cookie?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
  logger.info(`${apimessage}  Cookie cleared`);
  return res.send({ msg: "cookie cleared" });
};

//login with google
module.exports.loginWithGoogle = async (req, res) => {
  try {
    const { method, originalUrl } = req;
    const apimessage = `[${method}] ${originalUrl}`;

    if (req.body.googleAccessToken) {
      const { googleAccessToken } = req.body;

      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        }
      );

      if (response) {
        const email = response.data.email;

        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
          return res.status(404).send({ msg: "User not found" });
        }
        if (!existingUser.verified) {
          return res.status(401).send({ msg: "User is not approved yet" });
        }

        const accessToken = jwt.sign(
          {
            email: existingUser.email,
            id: existingUser._id,
            username: existingUser.username,
            roles: existingUser.roles,
            loggedWithGoogle: true,
            passwordExists: existingUser.password ? true : false,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1m" }
        );
        const refreshToken = jwt.sign(
          {
            email: existingUser.email,
            id: existingUser._id,
            username: existingUser.username,
            roles: existingUser.roles,
            passwordExists: existingUser.password ? true : false,
            loggedWithGoogle: true,
          },
          process.env.REFRESH_TOKEN_sECRET,
          {
            expiresIn: "1d",
          }
        );

        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        if (!existingUser.password) {
          return res.send({ accessToken: accessToken, passwordExist: false });
        }
        logger.info(
          `${apimessage} ${existingUser.username} Successfully logged in`
        );
        return res
          .status(200)
          .send({ accessToken: accessToken, passwordExist: true });
      }
    }
  } catch (error) {
    console.log({ error });
    return res.status(500).send(error);
  }
};

//verify user

// Register
module.exports.register = async (req, res) => {
  try {
    const { method, originalUrl } = req;
    const apimessage = `[${method}] ${originalUrl}`;

    const {
      email,
      password,
      firstname,
      department,
      lastname,
      username,
      roles,
      verified,
    } = req.body;

    const existEmail = await userModel.findOne({ email }).lean().exec();
    if (existEmail) {
      logger.error(`${apimessage} Please enter a unique email`);
      return res.status(400).send({ msg: "Please enter a unique email" });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userObject = {
        username,
        firstname,
        lastname,
        department,
        password: hashedPassword,
        email,
        roles,
        verified,
      };
      const user = await userModel.create(userObject);
      if (user) {
        logger.info(`${apimessage} New user ${username} created successful`);
        return res
          .status(201)
          .send({ msg: `New user ${username} created successful` });
      } else {
        logger.error(`${apimessage} Invalid user data received`);
        res.status(400).send({ msg: "Invalid user data received" });
      }
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
};

//signup with google
module.exports.signupwithgoogle = async (req, res) => {
  try {
    const { method, originalUrl } = req;
    const apimessage = `[${method}] ${originalUrl}`;

    if (req.body.googleAccessToken) {
      const { googleAccessToken } = req.body;

      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        }
      );

      if (response) {
        const email = response.data.email;
        const firstname = response.data.given_name;
        const lastname = response.data.family_name;
        const username = response.data.name;
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
          return res.status(404).json({ message: "User already exist!" });
        }

        const user = new userModel({
          username,
          firstname,
          lastname,
          email,
        });

        await user.save();
        logger.info(`${apimessage} New user ${username} created successful`);
        res.status(200).json({ msg: "User successfully registered" });
      }
    }
  } catch (error) {
    console.log({ error });
  }
};
