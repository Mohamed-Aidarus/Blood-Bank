const { User } = require("../Models/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const crypto = require('crypto');
const logger = require('../utils/logger');

exports.createUser = async (req, res) => {
    const { fullname, email, age, gender, address, bloodGroup, medicalCondition, password, passwordConfirm, role } = req.body;
    const photo = req.file ? req.file.filename : null;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        if (password !== passwordConfirm) {
            return res.status(400).json({ message: "Password and confirm password do not match" });
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

        const token = jwt.sign({ userId: user._id, fullname, email, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(201).json({
            message: "User created successfully,",
            data: { ...user._doc, token },
        });

    } catch (error) {
        logger.error(`Error creating user: ${error.message}`);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.createUsers = async (req, res) => {
    const users = req.body;

    try {
        if (!Array.isArray(users) || users.length === 0) {
            return res.status(400).json({ message: "Invalid input, expected an array of users" });
        }

        const createdUsers = [];
        const errors = [];

        for (const userData of users) {
            const { fullname, email, age, gender, address, bloodGroup, medicalCondition, password, passwordConfirm, role } = userData;
            const photo = userData.photo || null;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                errors.push({ email, message: "User already exists" });
                continue;
            }
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

            const token = jwt.sign({ userId: user._id, fullname, email, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

            createdUsers.push({ ...user._doc, token });
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
        logger.error(`Error creating users: ${error.message}`);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.getUser = async (req, res) => {
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

        const { role } = existingUser;
        const token = jwt.sign(
            { userId: existingUser._id, fullname: existingUser.fullname, email: existingUser.email, role },
            process.env.JWT_SECRET,
            { expiresIn: '1D' }
        );

        return res.status(200).json({
            message: "User login successful",
            data: { ...existingUser._doc, token }
        });

    } catch (error) {
        logger.error(`Error logging in user: ${error.message}`);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.search= async (req, res) => {
    try {
      const { email } = req.query;
      const user = await User.findOne({ email });
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        return res.status(200).json({
            message: "Users retrieved successfully",
            data: users
        });

    } catch (error) {
        logger.error(`Error fetching users: ${error.message}`);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateUser = async (req, res) => {
    const { email, fullname,  role } = req.body;
   

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "Email not found" });
        }

        existingUser.fullname = fullname;
        existingUser.role = role;

        const updatedUser = await existingUser.save();

        return res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        });

    } catch (error) {
        logger.error(`Error updating user: ${error.message}`);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.updateProfile = async (req, res) => {
    const { email, fullname,age, gender, address, bloodGroup,photo  } = req.body;
   

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "Email not found" });
        }

        existingUser.fullname = fullname;
        existingUser.age = age;
        existingUser.gender = gender;
        existingUser.address = address;
        existingUser.bloodGroup = bloodGroup;
        existingUser.photo = photo;
        

        const updatedUser = await existingUser.save();

        return res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        });

    } catch (error) {
        logger.error(`Error updating user: ${error.message}`);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.updateAllUsers = async (req, res) => {
    const updates = req.body;

    try {
        if (!Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({ message: "Invalid input, expected an array of updates" });
        }

        const updatedUsers = [];
        const errors = [];

        for (const updateData of updates) {
            const { id, fullname, password, passwordConfirm, photo, role } = updateData;

            const existingUser = await User.findById(id);
            if (!existingUser) {
                errors.push({ id, message: "User not found" });
                continue;
            }

            existingUser.fullname = fullname;
            if (password !== passwordConfirm) {
                errors.push({ id, message: "Password and confirm password do not match" });
                continue;
            }
            existingUser.password = password;
            existingUser.passwordConfirm = passwordConfirm;
            existingUser.photo = photo;
            existingUser.role = role;

            const updatedUser = await existingUser.save();
            updatedUsers.push(updatedUser);
        }

        if (errors.length) {
            return res.status(400).json({
                message: "Some users could not be updated",
                errors,
                updatedUsers
            });
        }

        return res.status(200).json({
            message: "Users updated successfully",
            data: updatedUsers
        });

    } catch (error) {
        logger.error(`Error updating users: ${error.message}`);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        await existingUser.deleteOne();

        return res.status(200).json({
            message: "User deleted successfully",
            data: existingUser
        });

    } catch (error) {
        logger.error(`Error deleting user: ${error.message}`);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.deleteAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        await User.deleteMany({});

        return res.status(200).json({
            message: "All users deleted successfully",
            data: users
        });

    } catch (error) {
        logger.error(`Error deleting all users: ${error.message}`);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const resetUrl = `${process.env.FRONTEND_URL}?token=${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Please click on the button below to complete the process:</p>
                <a href="${resetUrl}" style="text-decoration: none;">
                    <button style="
                        background-color: #4CAF50;
                        border: none;
                        color: white;
                        padding: 15px 32px;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 16px;
                        margin: 4px 2px;
                        cursor: pointer;
                    ">Reset Password</button>
                </a>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `,
        };

        transporter.sendMail(mailOptions, function (err) {
            if (err) {
                logger.error(`Error sending reset password email: ${err.message}`);
                return res.status(500).json({ message: "Failed to send reset password email" });
            }
            return res.status(200).json({ message: "We have sent you an email to reset your password" });
        });
    } catch (error) {
        logger.error(`Error in forgotPassword: ${error.message}`);
        return res.status(500).json({ message: "Server error" });
    }
};



exports.resetPassword = async (req, res) => {
    const { email, password, passwordConfirm } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        user.password = password;
        user.passwordConfirm = passwordConfirm;
        await user.save();

        // Send confirmation email
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Password Reset Confirmation',
            html: `
                <p>Hello ${user.fullname},</p>
                <p>Your password has been successfully reset. If you did not request this change, please contact our support team immediately.</p>
                <p>Best regards,</p>
                <p>Aidarus</p>
            `,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                logger.error(`Error sending confirmation email: ${err.message}`);
                return res.status(500).json({ message: "Password reset, but failed to send confirmation email" });
            }
            logger.info(`Password reset confirmation email sent: ${info.response}`);
            return res.status(200).json({ message: "Password reset successfully" });
        });

    } catch (error) {
        logger.error(`Error resetting password: ${error.message}`);
        return res.status(500).json({ message: "Server error" });
    }
};



  

// exports.checkUserActive = async (req, res, next) => {
//     try {
//       const userId = req.user.id; // Assuming you have the user's ID in req.user
//       const user = await User.findById(userId).select('+active');
      
//       if (!user || !user.active) {
//         return res.status(403).json({
//           status: 'fail',
//           message: 'Your account is inactive. Please contact support.',
//         });
//       }
  
//       next();
//     } catch (err) {
//       res.status(500).json({
//         status: 'error',
//         message: 'Something went wrong while checking user status',
//       });
//     }
//   };
  

  

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



// Adjust this to your actual User model path














