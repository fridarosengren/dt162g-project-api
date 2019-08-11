//
// AUTHOR: Frida Rosengren
// DATE: 2019-03-05
// ASSIGNMENT: JavaScriptbaserad webbutveckling - Projekt
// DESCRIPTION: app.js, webservice for a message board
//

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const config = require("./config.json");

// Connect to mongodb database
mongoose.connect(config.db, {
    useNewUrlParser: true
});

// Use defined Schema for database
var Messages = require("./app/models/messages.js");

// Allow access to webservice from all origins
app.all("/*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    next();
});

// Start server on port 3000 OR let heroku set port;
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on port " + port + "!"));

// Create static path
app.use(express.static(path.join(__dirname, "public")));

// GET ALL - get all messages
app.get("/messages", (req, res) => {
    // Find and show all messages in database
    Messages.find(function(err, obj) {
        if (err) {
            res.send(err);
        }
        res.contentType("application/json");
        res.send(obj); // Return result from database
    }).sort({ _id: -1 });
});

// GET BY ID - get message with chosen id
app.get("/messages/:id", (req, res) => {
    // Get given id
    var id = req.params.id;

    // Find and show message with given id
    Messages.find(
        {
            _id: id
        },
        function(err, obj) {
            if (err) {
                res.send(err);
            }
            res.contentType("application/json");
            res.send(obj); // Return result from database
        }
    );
});

// Use body-parser to handle POST for getting values
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// POST - Create new message
app.post("/messages", (req, res) => {
    // Create new instance of messages-schema
    var msg = new Messages();

    // Get body values
    msg.heading = req.body.heading;
    msg.author = req.body.author;
    msg.message = req.body.message;
    msg.category = req.body.category;

    // Save new post to database
    msg.save(err => {
        if (err) {
            res.send(err); // Send error
        }
        // Send json-string with message if successful
        res.contentType("application/json");
        res.send({ message: "Successfully added post" });
    });
});

// DELETE - delete message with chosen id
app.delete("/messages/:id", (req, res) => {
    // Get given id
    var id = req.params.id;

    // Delete message
    Messages.deleteOne(
        {
            _id: id
        },
        function(err, Messages) {
            if (err) {
                res.send(err); // Send error
            }
            // Send json-string with message if successful
            res.contentType("application/json");
            res.send({ message: "Successfully deleted post" });
        }
    );
});

// PUT - Update message with chosen id
app.put("/messages/:id", (req, res) => {
    // Get given id
    var id = req.params.id;

    // Create new instance of messages-schema
    var msg = new Messages();

    // Get values to change
    msg.heading = req.body.heading;
    msg.author = req.body.author;
    msg.message = req.body.message;
    msg.category = req.body.category;

    // Find message with given id and update with new body values
    Messages.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                heading: msg.heading,
                author: msg.author,
                message: msg.message,
                category: msg.category
            }
        },
        function(err, Messages) {
            if (err) {
                res.send(err); // Send error
            }
            // Send json-string with message if successful
            res.contentType("application/json");
            res.send({ message: "Successfully updated post" });
        }
    );
});
