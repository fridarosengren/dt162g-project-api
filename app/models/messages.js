// Mongodb schema for posts
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define new schema
var messageSchema = new Schema ({
    heading: String,
    author: String,
    message: String,
    category: String 
});

// Send Schema
module.exports = mongoose.model("messages", messageSchema);
