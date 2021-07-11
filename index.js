import express from "express";
import {
  getImageFromAssets,
  getAllTemplates,
  getControllersByTemplate,
} from "./helpers/index.js";
const app = express();
import mongoose from "mongoose";
import { createStarMap, editStarMap } from "./starmap/index.js";

// Соединение с БД
mongoose.connect("mongodb://62.75.195.219:28018/starmap", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

var domStarMap = createStarMap();

app.use(express.urlencoded({ extended: true }));

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

// Создаем звездную карту
app.post("/get_classic_v1_map", async (req, res) => {
  const background = req.body.background;

  var options = {};

  if (background) {
    options = {
      rotate: { center: [52.1649, 29.1333, 0] },
      config: {
        background: { fill: background },
      },
    };
  }

  res.setHeader("Content-Type", "image/svg+xml");

  editStarMap(domStarMap, options).then((data) => res.send(data));
});

app.listen(3000, () => {
  console.log(
    `Приложение прослушивает порт в ${new Date().toLocaleString()} http://localhost:3000`
  );
});
