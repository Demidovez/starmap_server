const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const templateScheme = new Schema({
    name: String,
    title: String,
    isActive: Boolean,
    order: Number,
    image: String
});

const controllerScheme = new Schema({
    name: String,
    title: String,
    image: String
});

module.exports = {templateScheme, controllerScheme}