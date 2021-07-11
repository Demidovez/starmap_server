import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const templateScheme = new Schema({
  name: String,
  title: String,
  isActive: Boolean,
  order: Number,
  image: String,
});

export const controllerScheme = new Schema({
  name: String,
  title: String,
  image: String,
});
