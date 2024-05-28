const {User} = require("../Models/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const crypto = require('crypto');
exports.createUser = async (req, res) => {
    const { fullname, email, age, gender, address,bloodGroup,medicalCondition, password, passwordConfirm, role } = req.body;
    const photo = req.file ? req.file.filename : null;

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
         // Check if password and confirm password match
         if (password!== passwordConfirm) {
            return res.status(400).json({ message: "Password and confirm password do not match" });
        }


        // Create user with hashed password and OTP details
        const user = await User.create({
            fullname,
            email,
            age,
            gender,
            address,
            bloodGroup,
            medicalCondition,
            password,
            passwordConfirm,
            photo,
            role,
        });


        // Generate JWT token
        const token = jwt.sign({ userId: user._id, fullname, email, role }, process.env.JWT_SECRET, { expiresIn: 1 });

        return res.status(201).json({
            message: "User created successfully, OTP sent to email",
            data: {
                ...user._doc,
                token
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.createUsers = async (req, res) => {
    const users = req.body; // Expecting an array of user objects

    try {
        // Validate the input
        if (!Array.isArray(users) || users.length === 0) {
            return res.status(400).json({ message: "Invalid input, expected an array of users" });
        }

        const createdUsers = [];
        const errors = [];

        for (const userData of users) {
            const { fullname, email, age, gender, address, bloodGroup, medicalCondition, password, passwordConfirm, role } = userData;
            const photo = userData.photo || null;

            // Check if user exists
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                errors.push({ email, message: "User already exists" });
                continue;
            }
            
            // Check if password and confirm password match
            if (password !== passwordConfirm) {
                errors.push({ email, message: "Password and confirm password do not match" });
                continue;
            } 


            const user = await User.create({
                fullname,
                email,
                age,
                gender,
                address,
                bloodGroup,
                medicalCondition,
                password,
                passwordConfirm,
                photo,
                role,
            });

            // Generate JWT token
            const token = jwt.sign({ userId: user._id, fullname, email, role }, process.env.JWT_SECRET, { expiresIn: 1 });

            createdUsers.push({
                ...user._doc,
                token
            });
        }

        if (errors.length) {
            return res.status(400).json({
                message: "Some users could not be created",
                errors,
                createdUsers
            });
        }

        return res.status(201).json({
            message: "Users created successfully",
            data: createdUsers
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.GetUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: "Email not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Assuming `existingUser` contains the role information
        const { role } = existingUser;

        // Generate JWT token
        const token = jwt.sign(
            { userId: existingUser._id, fullname: existingUser.fullname, email: existingUser.email, role: role , }, // Include role here
            process.env.JWT_SECRET,
            { expiresIn: '1D' }
        );

        return res.status(200).json({
            message: "User Login successfully",
            data: {
                ...existingUser._doc,
                token
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};



exports.getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find();

        // Check if there are no users
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        // Return the users
        return res.status(200).json({
            message: "Users retrieved successfully",
            data: users
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.updateUser = async (req, res) => {
    const { fullname,  password, passwordConfirm, photo,role } = req.body; // Destructure name, email, password, and photo directly from req.body
    const userId = req.params.id; // Assuming the user ID is passed as a parameter in the request URL
    try {
        // Check if the user exists
        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }


        // Update user fields
        existingUser.fullname = fullname;
        existingUser.password = password;
        existingUser.passwordConfirm = passwordConfirm;
        existingUser.photo = photo;
        existingUser.role = role;

        // Save the updated user
        const updatedUser = await existingUser.save();

        return res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        });
        

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};


exports.deleteUser = async (req, res) => {
    const userId = req.params.id; // Assuming the user ID is passed as a parameter in the request URL

    try {
        // Check if the user exists
        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the user
        await existingUser.deleteOne();

        return res.status(200).json({
            message: "User deleted successfully",
            data: existingUser
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};



// exports.forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Find user by email
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Generate a unique token for resetting password
//     const resetToken = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
//     await user.save();

//     // Send reset password email with resetToken
//     const transporter = nodemailer.createTransport({
//       host: "sandbox.smtp.mailtrap.io",
//       port: 2525,
//       auth: {
//         user: "e90649ce8006be",
//         pass: "80f2712ff5955d",
//       },
//     });

//     const resetUrl = `http://${req.headers.host}/reset-password/${resetToken}`;

//     const mailOptions = {
//       from: 'Aidarus@gmail.com',
//       to: user.email,
//       subject: 'Password Reset Request',
//       text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
//         `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
//         `${resetUrl}\n\n` +
//         `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
//     };

//     transporter.sendMail(mailOptions, function (err) {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: "Failed to send reset password email" });
//       }
//       return res.status(200).json({ message: "We have sent you an email to reset your password" });
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// exports.resetPassword = async (req, res) => {
//     const { token, password, passwordConfirm } = req.body;
  
//     try {
//       // Verify and decode the reset token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
//       // Find user by decoded userId and reset token
//       const user = await User.findOne({ _id: decoded.userId, resetPasswordToken: token });
  
//       if (!user || user.resetPasswordExpires < Date.now()) {
//         return res.status(400).json({ message: "Invalid or expired token" });
//       }
  
//       // Verify if passwords match
//       if (password !== passwordConfirm) {
//         return res.status(400).json({ message: "Passwords do not match" });
//       }
  
//       // Update user's password and clear reset token
//       user.password = password;
//       user.passwordConfirm = passwordConfirm;
//       user.resetPasswordToken = null;
//       user.resetPasswordExpires = null;
//       await user.save();
  
//       return res.status(200).json({ message: "Password reset successfully" });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Server error" });
//     }
//   };

// Adjust this to your actual User model path

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a unique token for resetting password
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Send reset password email with resetToken
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "e90649ce8006be",
        pass: "80f2712ff5955d",
      },
    });

    const resetUrl = `http://${req.headers.host}/ResetPassword?token=${resetToken}`;

    const mailOptions = {
      from: 'Aidarus@gmail.com',
      to: user.email,
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `${resetUrl}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to send reset password email" });
      }
      return res.status(200).json({ message: "We have sent you an email to reset your password" });
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.checkUserActive = async (req, res, next) => {
    try {
      const userId = req.user.id; // Assuming you have the user's ID in req.user
      const user = await User.findById(userId).select('+active');
      
      if (!user || !user.active) {
        return res.status(403).json({
          status: 'fail',
          message: 'Your account is inactive. Please contact support.',
        });
      }
  
      next();
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong while checking user status',
      });
    }
  };
  














