const express = require("express");
const { getImageFromAssets, getAllTemplates, getControllersByTemplate } = require("./helpers");
const app = express();
const mongoose = require("mongoose");

// Соединение с БД
mongoose.connect("mongodb://localhost:28018/starmap", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.get("/", (req, res) => {
  res.send("<h2>Привет Express</h2>");
});

// Достаем все шаблоны
app.get("/all_templates", async (req, res) => {
  const templates = await getAllTemplates();

  res.send(templates);
});

// Достаем котроллеры шаблона
app.get("/get_controllers/:template", async (req, res) => {
  const template = req.params.template;

  const controllers = await getControllersByTemplate(template);

  res.send(controllers);
});

// Достаем изображение
app.get("/images/:category/:name", (req, res) => {
  const category = req.params.category;
  const name = req.params.name;

  getImageFromAssets(res, category, name);
});

app.listen(3000, () => {
  console.log(
    `Приложение прослушивает порт в ${new Date().toLocaleString()} http://localhost:3000`
  );
});
