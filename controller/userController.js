const userModel = require("../model/User.model");
const bcrypt = require("bcrypt");
const asynchandler = require("express-async-handler");

//create middleware for verifying logged in user
module.exports.createPassword = async (req, res) => {
  try {
    const { confirmPassword, department } = req.body;
    const { email } = req.user;

    const user = await userModel.findOne({ email }).lean();

    if (!user) {
      return res.status(400).send({ msg: "Cant find user" });
    }
    if (user.password) {
      return res.status(400).send({ msg: "Password exists" });
    }

    if (confirmPassword) {
      const hashedPassword = await bcrypt.hash(confirmPassword, 10);
      await userModel.findOneAndUpdate(
        { email },
        {
          password: hashedPassword,
          department,
        }
      );
    }

    res.status(201).send({ msg: "New password created successfully" });
  } catch (error) {
    return res.status(500).send({ msg: "Unable to create password" });
  }
};

//get all user
module.exports.getAllUsers = asynchandler(async (req, res) => {
  // Get all users from MongoDB
  const users = await userModel.find().select("-password").lean();

  return res.send(users);
});

// approve and reject user
module.exports.getApproval = async (req, res) => {
  try {
    const { approve, _id } = req.body;

    const user = await userModel.findById(_id).exec();
    if (!user) {
      return res.status(400).send({ msg: "User not found" });
    }

    if (user.verified) {
      return res.status(401).send("User is already approved");
    }

    if (!approve) {
      const result = await user.deleteOne();
      const reply = `Username ${result.username} with ID ${result._id} deleted`;
      return res.status(200).send(reply);
    }

    await userModel.findOneAndUpdate(
      { _id },
      {
        verified: true,
      }
    );
    return res.status(201).send({ _id: _id });
  } catch (error) {
    console.log({ error });
    return res.status(500).send(error);
  }
};

// get user
module.exports.getUser = asynchandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(501).send({ error: "Invalid id" });
  }
  const user = await userModel.findOne({ _id: id }).select("-password").lean();

  if (!user) {
    return res.status(400).send({ error: "Couldnt find User" });
  }
  return res.status(201).send(user);
});

//update user

module.exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.user;

    if (userId) {
      const body = req.body;
      console.log(body.department)
      const user = await userModel.findOne({ _id: userId }).lean();

      if (body.oldPass || body.newPass) {
        const passwordCheck = await bcrypt.compare(body.oldPass, user.password);  
        if (!passwordCheck) {
          return res.status(400).send({msg: "Password dont match"});
        }
        const hashedPassword = await bcrypt.hash(body.newPass, 10);
        body.password = hashedPassword;
        const updateUser = await userModel.findOneAndUpdate(
          { _id: userId },

          body,
          {new: true}
        );
        if (!updateUser) {
          return res.status(500).send({ msg: "Error while updating" });
        }
      } else {
        const updateUser = await userModel.findOneAndUpdate(
          { _id: userId },

          body,
          {new: true}
        );
        if (!updateUser) {
          return res.status(500).send({ msg: "Error while updating" });
        }
      }

      return res.status(201).send({ msg: "Record updated successfully" });
    }
  } catch (err) {
    return res.status(500).send({ msg: "Userdata not found" });
  }
};

//delete user
module.exports.deleteUser = asynchandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).send({ msg: "User id required" });
  }
  const user = await userModel.findById(id).exec();

  if (!user) {
    return res.status(400).send({ msg: "User not found" });
  }
  const result = await user.deleteOne();
  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  return res.status(400).send(reply);
});
