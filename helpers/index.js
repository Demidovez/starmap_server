const fs = require("fs");
const mongoose = require("mongoose");
const { templateScheme, controllerScheme } = require("../mongo/shemas");
const Template = mongoose.model("Template", templateScheme);
const Controller = mongoose.model("Controller", controllerScheme);

const getImageFromAssets = (res, category, name) => {
  let directory_name = "assets/images/" + category + "/" + name;

  const filename = fs.existsSync(directory_name);

  if (!filename) {
    directory_name = "assets/images/image_not_available.jpeg";
  }

  fs.readFile(directory_name, (err, content) => {
    if (err) {
      res.writeHead(400, { "Content-type": "text/html" });
      res.end("No such image");
    } else {
      res.writeHead(200);
      res.end(content);
    }
  });
};

const getAllTemplates = async () => {
  const templates = await Template.find({}, (err, templates) => {
    if (err) return [];

    return templates;
  }).lean();

  return templates;
};

const getControllersByTemplate = async (template) => {
  const templateFinded = await Template.findOne({name: template}, (err, templateOne) => {
    if (err) return {};

    return templateOne;
  }).lean();

  const controllers = await Controller.find({name: {$in: templateFinded.controllers}}, (err, controllers) => {
    if (err) return [];

    return controllers;
  }).lean();

  return controllers;
};

module.exports = { getImageFromAssets, getAllTemplates, getControllersByTemplate };
