const User = require("../../db/config/user.model");
const {
  GeneratesSignature,
} = require("../middleware/authorization.middleware");

const userSignup = async (req, resp) => {
  try {
    const { firstName, lastName, email, number, password } = req.body;
    console.log(req.body, "checking body is here");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return resp
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      number,
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

// const userlogin = async (req, res) => {

//   try {
//     const { email, password } = req.body;

//     console.log(req.body, "checking buy here only");

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }
//     console.log(user);
//     if (user.password === password) {
//       let signature = await GeneratesSignature({
//         _id: user?._id,
//         email: user?.email,
//       });
//       return res.status(200).json({
//         token: signature,
//       });
//     }
//     return res.status(200).json({
//       message: "invalid credential",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const userlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(req.body, "checking login here only");

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.password === password) {
      let signature = await GeneratesSignature({
        _id: user._id,
        email: user.email,
      });

      return res.status(200).json({
        token: signature,
      });
    }

    return res.status(401).json({
      message: "Invalid credentials",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new user
const createuser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
const getalluser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user by ID
const updateuser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user by ID
const deleteduser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  userSignup,
  userlogin,

  getalluser,
  createuser,
  deleteduser,
  updateuser,
  getUserById,
};
