const Usermodel = require('../model/User.model')

module.exports.verifyUser = async (req, res, next) => {
    try {
      const { email } = req.method == "GET" ? req.query : req.body;
  
      let user = await Usermodel.findOne({ email });
  
      if (!user) {
        return res.status(404).send({ msg: "User not found" });
      }
      if (user) {
        next();
      }
    } catch (err) {
      return res.status(404).send({ err: "Authentication Error" });
    }
  };


  