export default `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Star Map</title>
    <script src="lib/d3.min.js"></script>
    <script type="text/javascript" src="lib/d3.geo.projection.min.js"></script>
    <script type="text/javascript" src="celestial.js"></script>
    <style>
    
    </style>
</head>
<body>
    <div style="overflow: hidden; margin: 0 auto">
    <div id="celestial-map"></div>
    </div>

    <script>
    var config = {
      width: 800, 
      disableAnimations: true,
      projection: "orthographic", 
      projectionRatio: null, 
      transform: "equatorial", 
      center: null, 
      orientationfixed: true, 
      geopos: null, 
      follow: "zenith", 
      zoomlevel: null, 
      zoomextend: 10, 
      adaptable: true, 
      interactive: false, 
      form: false, 
      location: false, 
      formFields: {
        location: false, 
        general: false,
        stars: false,
        dsos: false,
        constellations: false,
        lines: false,
        other: false,
        download: false,
      },
      advanced: false, 
      daterange: [], 
      controls: false, 
      lang: "", 
      culture: "", 
      container: "map", 
      datapath: "data/", 
      stars: {
        show: true, 
        limit: 6, 
        colors: false,
        style: { fill: "#ffffff", opacity: 1 }, 
        designation: false, 
        designationType: "desig", 
        designationStyle: {
          fill: "#ddddbb",
          font: "11px 'Palatino Linotype', Georgia, Times, 'Times Roman', serif",
          align: "left",
          baseline: "top",
        },
        designationLimit: 2.5, 
        propername: true, 
        propernameType: "name", 
        propernameStyle: {
          fill: "#ddddbb",
          font: "13px 'Palatino Linotype', Georgia, Times, 'Times Roman', serif",
          align: "right",
          baseline: "bottom",
        },
        propernameLimit: 1.5, 
        size: 16, 
        exponent: -0.28, 
        data: "stars.6.json",
      },
      dsos: {
        show: true, 
        limit: 6, 
        colors: true, 
        style: { fill: "#cccccc", stroke: "#cccccc", width: 2, opacity: 1 }, 
        names: true, 
        namesType: "name", 
        nameStyle: {
          fill: "#000000",
          font: "11px Helvetica, Arial, serif",
          align: "left",
          baseline: "top",
        }, 
        nameLimit: 6, 
        size: null, 
        exponent: 1.4, 
        data: "dsos.bright.json", 
        symbols: {
          gg: { shape: "circle", fill: "#ff0000" }, 
          g: { shape: "circle", fill: "#ff0000" }, 
          s: { shape: "circle", fill: "#ff0000" }, 
          s0: { shape: "circle", fill: "#ff0000" }, 
          sd: { shape: "circle", fill: "#ff0000" },
          e: { shape: "circle", fill: "#ff0000" },
          i: { shape: "circle", fill: "#ff0000" },
          oc: { shape: "circle", fill: "#ffcc00" }, 
          gc: { shape: "circle", fill: "#ff9900" }, 
          en: { shape: "circle", fill: "#ff00cc" }, 
          bn: { shape: "circle", fill: "#ff00cc" }, 
          sfr: { shape: "circle", fill: "#cc00ff" }, 
          rn: { shape: "circle", fill: "#00ooff" }, 
          pn: { shape: "circle", fill: "#00cccc" }, 
          snr: { shape: "circle", fill: "#ff00cc" }, 
          dn: { shape: "circle", fill: "#999999" }, 
          pos: { shape: "circle", fill: "#cccccc" },
        },
      },
      planets: {
        show: true,
        which: [
          "sol",
          "mer",
          "ven",
          "ter",
          "lun",
          "mar",
          "jup",
          "sat",
          "ura",
          "nep",
        ],
        symbols: {
          sol: { symbol: "\u2609", letter: "Su", fill: "#ffff00" },
          mer: { symbol: "\u263f", letter: "Me", fill: "#cccccc" },
          ven: { symbol: "\u2640", letter: "V", fill: "#eeeecc" },
          ter: { symbol: "\u2295", letter: "T", fill: "#00ccff" },
          lun: { symbol: "\u25cf", letter: "L", fill: "#ffffff" }, 
          mar: { symbol: "\u2642", letter: "Ma", fill: "#ff6600" },
          cer: { symbol: "\u26b3", letter: "C", fill: "#cccccc" },
          ves: { symbol: "\u26b6", letter: "Ma", fill: "#cccccc" },
          jup: { symbol: "\u2643", letter: "J", fill: "#ffaa33" },
          sat: { symbol: "\u2644", letter: "Sa", fill: "#ffdd66" },
          ura: { symbol: "\u2645", letter: "U", fill: "#66ccff" },
          nep: { symbol: "\u2646", letter: "N", fill: "#6666ff" },
          plu: { symbol: "\u2647", letter: "P", fill: "#aaaaaa" },
          eri: { symbol: "\u26aa", letter: "E", fill: "#eeeeee" },
        },
        symbolStyle: {
          fill: "#00ccff",
          font: "bold 17px 'Lucida Sans Unicode', Consolas, sans-serif",
          align: "center",
          baseline: "middle",
        },
        symbolType: "disk", 
        names: false,
        nameStyle: {
          fill: "#00ccff",
          font: "14px 'Lucida Sans Unicode', Consolas, sans-serif",
          align: "right",
          baseline: "top",
        },
        namesType: "desig", 
      },
      constellations: {
        names: true, 
        namesType: "iau",
        nameStyle: {
          fill: "#cccc99",
          align: "center",
          baseline: "middle",
          font: [
            "14px Helvetica, Arial, sans-serif",
            "14px Helvetica, Arial, sans-serif",
            "14px Helvetica, Arial, sans-serif",
          ],
        },
        lines: true,
        lineStyle: { stroke: "#cccccc", width: 1, opacity: 0.6 },
        bounds: false,
        boundStyle: {
          stroke: "#cccc00",
          width: 0.5,
          opacity: 0.8,
          dash: [2, 4],
        },
      },
      mw: {
        show: true,
        style: { fill: "#ffffff", opacity: 0.15 }, 
      },
      lines: {
        graticule: {
          show: true,
          stroke: "#cccccc",
          dash: [],
          width: 0.6,
          opacity: 0.8,
          lon: {
            pos: [""],
            fill: "#eee",
            font: "10px Helvetica, Arial, sans-serif",
          },
          lat: {
            pos: [""],
            fill: "#eee",
            font: "10px Helvetica, Arial, sans-serif",
          },
        },
        equatorial: {
          show: false,
          stroke: "#aaaaaa",
          width: 1.3,
          opacity: 0.7,
        },
        ecliptic: {
          show: false,
          stroke: "#66cc66",
          width: 1.3,
          opacity: 0.7,
        },
        galactic: {
          show: false,
          stroke: "#cc6666",
          width: 1.3,
          opacity: 0.7,
        },
        supergalactic: {
          show: false,
          stroke: "#cc66cc",
          width: 1.3,
          opacity: 0.7,
        },
      },
      background: {
        fill: "#000000", 
        opacity: 1,
        stroke: "#000000", 
        width: 1.5,
      },
      horizon: {
        show: false,
        stroke: "#cccccc", 
        width: 1.0,
        fill: "#000000", 
        opacity: 0.5,
      },
      daylight: {
        show: false,
      },
    };
  
      Celestial.display(config);

      Celestial.addCallback(() => {
        window.callbackDraw()
      });
    </script>

    <script>
        window.rotateStarMap     = (date, location) => { Celestial.skyview({date, location}) }; 
        window.resizeStarMap     = (width)  => { Celestial.resize({ width }) }; 
        window.reloadStarMap     = (config) => { Celestial.apply(config) };
        window.callbackDraw      = () => {}
    </script>
</body>
</html>`;
