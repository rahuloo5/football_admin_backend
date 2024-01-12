const User = require("../../db/config/user.model");
const {
  GeneratesSignature,
} = require("../middleware/authorization.middleware");

const userSignup = async (req, resp) => {
  try {
    const { firstName, lastName, email_id, phone_number, password } = req.body;
    console.log(req.body, "checking body is here");
    // Check if user with the given email already exists
    const existingUser = await User.findOne({ email_id });
    if (existingUser) {
      return resp
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email_id,
      phone_number,
      password,
    });

    // Save the user to the database
    await newUser.save();

    resp.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ message: "Internal server error" });
  }
};

const userlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(req.body, "checking buy here only");

    const user = await User.findOne({ email_id: email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log(user);
    if (user.password === password) {
      let signature = await GeneratesSignature({
        _id: user?._id,
        email: user?.email,
      });
      return res.status(200).json({
        token: signature,
      });
    }
    return res.status(200).json({
      message: "invalid credential",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get all usres
const getalluser = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//delete users by id
const deleteduser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//update users by id
const updateuser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new user
const user = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  userSignup,
  userlogin,
  getalluser,
  user,
  deleteduser,
  updateuser,
  getUserById,
};
