const Contact = require("../models/Contact.js");
const nodemailer = require("nodemailer");

exports.submitContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const newMessage = await Contact.create({ name, email, subject, message });
    
    // Nodemailer logic here...
    
    res.status(201).json({ success: true, message: "Message sent!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Make sure it looks exactly like this
exports.getContactMessages = async (req, res) => {
  try {
    // 1. Fetch from DB
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    
    // 2. Log to your SERVER terminal to verify
    console.log("Found messages in DB:", messages.length);

    // 3. Send raw array (best for your current frontend)
    res.status(200).json(messages); 
  } catch (error) {
    res.status(500).json({ message: "Error fetching from database" });
  }
};

exports.updateMessageStatus = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (message) {
      message.status = req.body.status || "Read";
      await message.save();
      res.json({ message: "Status updated" });
    }
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};