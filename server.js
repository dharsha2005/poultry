const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname)));

mongoose.connect("mongodb://127.0.0.1:27017/contactsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const ContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    msg: String,
});

const Contact = mongoose.model("Contact", ContactSchema);

app.post("/contacts", async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ error: "Failed to create contact" });
    }
});

app.get("/contacts", async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch contacts" });
    }
});

app.put("/contacts/:id", async (req, res) => {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(updatedContact);
    } catch (error) {
        res.status(500).json({ error: "Failed to update contact" });
    }
});

app.delete("/contacts/:id", async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: "Contact deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete contact" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
