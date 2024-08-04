const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactUsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    }
});

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

module.exports = ContactUs;
