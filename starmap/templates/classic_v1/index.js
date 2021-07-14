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
  const { rotate, widthMap, options } = config;

  var promiseResolve;

  const promise = new Promise((resolve, _) => {
    promiseResolve = (png) => resolve(png);
  });

  dom.window.initedStartMap = () => {
    if (rotate) {
      dom.window.rotateStarMap(rotate);
    }

    if (widthMap) {
      dom.window.resizeStarMap(widthMap);
    }

    if (options) {
      dom.window.reloadStarMap(options);
    }

    promiseResolve(dom.window.document.querySelector("canvas").toDataURL("image/png"));
  };

  dom.window.eval("window.initedStartMap()");

  return promise;
}
