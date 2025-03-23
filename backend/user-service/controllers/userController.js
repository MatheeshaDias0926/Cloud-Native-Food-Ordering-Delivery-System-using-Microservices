const User = require("../models/users");

//importing bcrypt
const bcrypt = require("bcrypt");

const validator = require("validator");
//importing jsonwebtoken
const jwt = require("jsonwebtoken");

//Creating a Token to give access to users to user services
//user id and user's role is passed with token
const createToken = (_id, role, name) => {
  console.log(process.env.SECRET);
  return jwt.sign({ _id, role, name }, process.env.SECRET, {
    expiresIn: "60m",
  });
};

//signup function
const signUp = async (req, res, next) => {
  const { name, mobile, email, address, password, role } = req.body;
  console.log(name, mobile, email, address, password, role);
  //validation for all the input fields
  if (!name || !mobile || !email || !address || !password) {
    throw Error("All fields must be filled");
  }

  //checking wheather password is valid or not
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }

  let existingUser;
  //chaecking whether user already sign up or not based on the email
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
  }

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exist...login instead " });
  }

  const salt = await bcrypt.genSalt(6);
  //hashsync is a function that can hasing the password
  const hashedpassword = await bcrypt.hash(password, salt);

  //creating a new User
  const user = new User({
    name,
    mobile,
    email,
    address,
    password: hashedpassword,
    role: role || "buyer",
  });

  try {
    await user.save(); //saving document(a new user to) into DB

    const token = createToken(user._id, user.role, user.name); //calling to createToken function to create a token for user

    //Create and setting a cookie with the user's ID and token
    res.cookie(String(user._id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60),
      httpOnly: true, //if this option isn't here cookie will be visible to the frontend
      sameSite: "lax",
    });

    res
      .status(201)
      .json({ message: "user succesfully registered", User: user, token }); //sending the new user details with token as a message for the response
  } catch (err) {
    console.log(err);
    throw new Error("Error saving user");
  }
};

//login function
const login = async (req, res, next) => {
  const { email, password } = req.body;

  //checking whether pasword and login fields are filled or not
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  let loggeduser;

  //check whether user is exist on the db, based on the email
  try {
    loggeduser = await User.findOne({ email: email });
  } catch (err) {
    return new Error(err);
  }

  //if user is noth found in the db
  if (!loggeduser) {
    return res.status(400).json({ message: "User not found.Sign up please" });
  }

  //checking password and comare it with exist user's password in the db
  const isPasswordCorrect = bcrypt.compareSync(password, loggeduser.password);

  //if password and email are invalid
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid email/password" });
  }
  //calling to createToken function to create a token for user
  const token = createToken(loggeduser._id, loggeduser.role);

  //Create and setting a cookie with the user's ID and token
  res.cookie(String(loggeduser._id), token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 30),
    httpOnly: true, //if this option isn't here cookie will be visible to the frontend
    sameSite: "lax",
  });

  //we send this msg along with the token and user details
  return res
    .status(200)
    .json({ message: "Successfully logged in", User: loggeduser, token });
};

//gets own profile details
const getUser = async (req, res, next) => {
  const userid = req.userId; //gets user Id from the token
  let user;

  //console.log("user ID (get USER)" + userid)

  try {
    //find the password with userId
    user = await User.findById(userid, "-password"); //this minus operator is used to restrict getting user password.But other details will get
  } catch (err) {
    return new Error(err);
  }

  //if user not found return this message
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ user }); //if user is exist
};

//get all the users
const getUsers = async (req, res, next) => {
  let users;

  //find all the users
  try {
    users = await User.find({});
  } catch (err) {
    console.log(err);
  }

  //if users are not in db
  if (!users) {
    res.status(404).json({ message: "There are no Users added" });
  } else {
    res.status(200).json({ users }); //display users if there are users
  }
};

//logout function
const logout = (req, res, next) => {
  const userid = req.userId; //request user Id from the token
  const cookies = req.headers.cookie; //request cookie from the header

  //exttracting token from the cookies
  const prevToken = cookies.split("=")[1];

  //if token is not found return this response
  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find token" });
  }

  //varifying token using secret key from the environmental variables
  jwt.verify(String(prevToken), process.env.SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" }); //if not verified return this error
    }

    //if token is varified return this success message as response
    res.clearCookie(`${userid}`);
    req.cookies[`${userid}`] = "";
    return res.status(200).json({ message: "Successfully Logged Out" });
  });
};

//delete Acc

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userId);

    res.clearCookie(`${req.userId}`);
    req.cookies[`${req.userId}`] = "";
    res.json({ message: "Account deleted successfully!!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in deleting you account" });
  }
};

//update Acc
const updateProfile = async (req, res, next) => {
  const userId = req.userId;
  const { name, mobile, email, address } = req.body;
  let user;

  if (!name || !mobile || !email || !address) {
    throw Error("All fields must be filled");
  }

  //checking wheather password is valid or not
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }

  let existingUser;
  //chaecking whether user already sign up or not based on the email
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
  }

  if (existingUser) {
    return res.status(400).json({
      message: "This email is already exists. use a different email. ",
    });
  }
  try {
    user = await User.findByIdAndUpdate(userId, {
      name,
      mobile,
      email,
      address,
    });
    user = await user.save();
  } catch (err) {
    console.log(err);
  }
  if (!user) {
    return res.status(404).json({ message: "Unable to Update by id" });
  }
  return res.status(200).json({ user });
};

//update the password
const updatePassword = async (req, res, next) => {
  const userId = req.userId; //request user Id from the url
  const { password } = req.body;

  if (!password) {
    throw Error("Password should be field");
  }

  const salt = await bcrypt.genSalt(6);
  //hashsync is a function that can hasing the password
  const hashednewpassword = await bcrypt.hash(password, salt);

  try {
    //check whether user is exist in the db
    const user = await User.findByIdAndUpdate(
      userId,
      { password: hashednewpassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating password" });
  }
};

// Get all delivery personnel
const getDeliveryPersonnel = async (req, res) => {
  try {
    const deliveryPersonnel = await User.find({ role: "delivery_personnel" });
    res.status(200).json({ deliveryPersonnel });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching delivery personnel" });
  }
};

// Get all restaurant staff
const getRestaurantStaff = async (req, res) => {
  try {
    const restaurantStaff = await User.find({ role: "seller" });
    res.status(200).json({ restaurantStaff });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching restaurant staff" });
  }
};

// Update delivery personnel status
const updateDeliveryPersonnelStatus = async (req, res) => {
  const { userId, isActive } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "Delivery personnel not found" });
    }
    res.status(200).json({ message: "Status updated successfully", user });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error updating delivery personnel status" });
  }
};

// Update restaurant staff status
const updateRestaurantStaffStatus = async (req, res) => {
  const { userId, isActive } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "Restaurant staff not found" });
    }
    res.status(200).json({ message: "Status updated successfully", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating restaurant staff status" });
  }
};

module.exports = {
  signUp,
  login,
  getUser,
  getUsers,
  logout,
  deleteUser,
  updateProfile,
  updatePassword,
  getDeliveryPersonnel,
  getRestaurantStaff,
  updateDeliveryPersonnelStatus,
  updateRestaurantStaffStatus,
};
