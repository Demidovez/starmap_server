import express from "express";
import {
  getImageFromAssets,
  getAllTemplates,
  getControllersByTemplate,
} from "./helpers/index.js";
import mongoose from "mongoose";
import {
  createDomStarMapClassicV1,
  editStarMapClassicV1,
} from "./starmap/templates/classic_v1/index.js";

const app = express();

// Соединение с БД
mongoose.connect("mongodb://62.75.195.219:28018/starmap", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

var domClassicV1 = createDomStarMapClassicV1()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
app.post("/get_classic_v1_map", (req, res) => {
  const background = req.body.background;
  const rotate = req.body.rotate;

  var options = {};

  if (rotate) {
    options = { ...options, rotate: { center: rotate } };
  }

  if (background) {
    options = {
      ...options,
      config: {
        background: { fill: background },
      },
    };
  }

  res.setHeader("Content-Type", "image/svg+xml");

  editStarMapClassicV1(domClassicV1, options).then((data) => {
    res.send(data);
  });
});

app.listen(3000, () => {
  console.log(
    `Приложение прослушивает порт в ${new Date().toLocaleString()} http://localhost:3000`
  );
});
