import bcrypt from "bcrypt";
import { userModel } from "../models/userData.js";
import { sendCookie } from "../utils/sendCookie.js";

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const userExist = await userModel.findOne({ email });

    if (!userExist) {
      return res
        .status(400)
        .json({ message: `User with ${email} doesn't exist` });
    }

    const passwordMatched = await bcrypt.compare(password, userExist.password);

    if (!passwordMatched) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const userData = Object.assign({}, userExist.toObject());
    delete userData.password;

    sendCookie(userData, res, `Welcome back, ${userData.name}`, 201);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const signupUserController = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    if (name == "" || email == "" || password == "") {
      return next(new ErrorHandler("Empty Input Fields", 404));
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
      return next(new ErrorHandler("Invalid Name Entered", 404));
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return next(new ErrorHandler("Invalid email entered", 404));
    } else if (password.length < 8) {
      return next(new ErrorHandler("Password too short", 404));
    } else {
      let user = await userModel.findOne({ email });

      if (user) {
        return next(
          new ErrorHandler("User with the provided email already exists", 404)
        );
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      user = await userModel.create({
        name,
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        success: true,
        message: "Registered Successfully!",
      });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
