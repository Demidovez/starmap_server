import jsdom from "jsdom";
import path from "path";
import { fileURLToPath } from "url";
const { JSDOM } = jsdom;
import htmlDom from "./dom.js";

export function createDomStarMapClassicV1() {
  const dom = new JSDOM(htmlDom, {
    url:
      "file://" +
      path.join(path.dirname(fileURLToPath(import.meta.url)), "../../"),
    runScripts: "dangerously",
    resources: "usable",
  });

  return dom;
}

export function editStarMapClassicV1(dom, config) {
  const { date, location, width, options } = config;

  var promiseResolve;

  const promise = new Promise((resolve, _) => {
    promiseResolve = (png) => resolve(png);
  });

  dom.window.initedStartMap = () => {
    dom.window.rotateStarMap(date, location);
    dom.window.resizeStarMap(width);
    dom.window.reloadStarMap(options);

    dom.window.callbackDraw = () => {
      promiseResolve(
        dom.window.document.querySelector("canvas").toDataURL("image/png")
      );
    };
  };

  dom.window.eval("window.initedStartMap()");

  return promise;
}
