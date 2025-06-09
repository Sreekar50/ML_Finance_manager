const userModel = require("../models/userModel");
const { exec } = require('child_process');
const path = require('path');

exports.processTransaction = (req, res) => {
    if (!req.files || !req.body.target_savings) {
        return res.status(400).json({ error: 'No file or target savings value provided.' });
    }

    const file = req.files.file;
    const targetSavings = req.body.target_savings;

    const filePath = path.join(__dirname, '../uploads', file.name);
    file.mv(filePath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'File upload failed.' });
        }

        exec(`python3 transactions.py ${filePath} ${targetSavings}`, (error, stdout, stderr) => {
            if (error) {
                return res.status(500).json({ error: stderr });
            }
            res.json({ output: stdout });
        });
    });
};


const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });
    if (!user) {
      return res.status(404).send("User Not Found");
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};


const registerController = async (req, res) => {
  try {
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).json({
      success: true,
      newUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

module.exports = { loginController, registerController };
