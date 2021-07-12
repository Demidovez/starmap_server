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

export function editStarMapClassicV1(dom, options) {
  const { rotate, config } = options;

  var promiseResolve;

  const promise = new Promise((resolve, _) => {
    promiseResolve = (svg) => resolve(svg);
  });

  dom.window.initedStartMap = () => {
    if (rotate) {
      dom.window.rotateStarMap(rotate);
    }

    if (config) {
      dom.window.reloadStarMap(config);
    }

    dom.window.downloadSVG().then((svg) => promiseResolve(svg));
  };

  dom.window.eval("window.initedStartMap()");

  return promise;
}
