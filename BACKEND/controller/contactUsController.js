const ContactUs = require('../models/ContactUsModel');

// Controller to handle adding contact us details
exports.addContactUs = async (req, res) => {
    const { name, phone, email, reason } = req.body;

    try {
        const newContactUs = new ContactUs({ name, phone, email, reason });
        await newContactUs.save();
        res.status(201).json({ message: "Contact Us details added successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to add Contact Us details", error: error.message });
    }
};
// Controller to handle fetching all contact us details
exports.getAllContactUs = async (req, res) => {
    try {
        const contactUsDetails = await ContactUs.find();
        res.status(200).json(contactUsDetails);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch Contact Us details", error: error.message });
    }
};
