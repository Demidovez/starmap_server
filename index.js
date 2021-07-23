import express from "express";
import {
  getImageFromAssets,
  getDataFromAssets,
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

var domClassicV1 = createDomStarMapClassicV1();

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

// Достаем исходные данные для карты
app.get("/data/:name", (req, res) => {
  const name = req.params.name;

  getDataFromAssets(res, name);
});

// Создаем звездную карту
app.post("/get_classic_v1_map", (req, res) => {
  const date = req.body.date;
  const location = req.body.location;
  const width = req.body.width;
  const options = req.body.options;

  var config = {
    date,
    location,
    width,
    options,
  };

  editStarMapClassicV1(domClassicV1, config).then((data) => {
    const img = Buffer.from(
      data.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": img.length,
    });

    res.end(img);
  });
});

app.listen(3000, () => {
  console.log(
    `Приложение прослушивает порт в ${new Date().toLocaleString()} http://localhost:3000`
  );
});
