export default `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Star Map</title>
    <script src="lib/d3.min.js"></script>
    <script type="text/javascript" src="lib/d3.geo.projection.min.js"></script>
    <script type="text/javascript" src="celestial.js"></script>
</head>
<body>
    <div style="overflow: hidden; margin: 0 auto">
    <div id="celestial-map"></div>
    </div>

    <script>
    var config = {
      width: 800, // Default width, 0 = full parent element width; height is determined by projection
      disableAnimations: true,
      projection: "orthographic", // Map projection used: see below
      projectionRatio: null, // Optional override for default projection ratio
      transform: "equatorial", // Coordinate transformation: equatorial (default), ecliptic, galactic, supergalactic
      center: null, // Initial center coordinates in set transform [longitude, latitude, orientation] all in degrees null = default center [0,0,0]
      orientationfixed: true, // Keep orientation angle the same as center[2]
      geopos: null, // optional initial geographic position [lat,lon] in degrees,overrides center
      follow: "zenith", // on which coordinates to center the map, default: zenith, if location enabled, otherwise center
      zoomlevel: null, // initial zoom level 0...zoomextend; 0|null = default, 1 = 100%, 0 < x <= zoomextend
      zoomextend: 10, // maximum zoom level
      adaptable: true, // Sizes are increased with higher zoom-levels
      interactive: false, // Enable zooming and rotation with mousewheel and dragging
      form: true, // Display form for interactive settings. Needs a div with id="celestial-form", created automatically if not present
      location: false, // Display location settings. Deprecated, use formFields below
      formFields: {
        location: true, // Set visiblity for each group of fields with the respective id
        general: true,
        stars: true,
        dsos: true,
        constellations: true,
        lines: true,
        other: true,
        download: true,
      },
      advanced: true, // Display fewer form fields if false
      daterange: [], // Calender date range; null: displaydate-+10; [n<100]: displaydate-+n; [yr]: yr-+10;[yr, n<100]: [yr-n, yr+n]; [yr0, yr1]
      controls: true, // Display zoom controls
      lang: "", // Global language override for names, any name setting that has the chosen language available
      // Default: desig or empty string for designations, other languages as used anywhere else
      culture: "", // Source of constellations and star names, default "iau", other: "cn" Traditional Chinese
      container: "map", // ID of parent element, e.g. div, null = html-body
      datapath: "data/", // Path/URL to data files, empty = subfolder 'data'
      stars: {
        show: true, // Show stars
        limit: 6, // Show only stars brighter than limit magnitude
        colors: false, // Show stars in spectral colors, if not use default color
        style: { fill: "#ffffff", opacity: 1 }, // Default style for stars
        designation: false, // Show star names (Bayer, Flamsteed, Variable star, Gliese or designation,
        // i.e. whichever of the previous applies first); may vary with culture setting
        designationType: "desig", // Which kind of name is displayed as designation (fieldname in starnames.json)
        designationStyle: {
          fill: "#ddddbb",
          font: "11px 'Palatino Linotype', Georgia, Times, 'Times Roman', serif",
          align: "left",
          baseline: "top",
        },
        designationLimit: 2.5, // Show only names for stars brighter than nameLimit
        propername: true, // Show proper name (if present)
        propernameType: "name", // Languge for proper name, default IAU name; may vary with culture setting
        // (see list below of languages codes available for stars)
        propernameStyle: {
          fill: "#ddddbb",
          font: "13px 'Palatino Linotype', Georgia, Times, 'Times Roman', serif",
          align: "right",
          baseline: "bottom",
        },
        propernameLimit: 1.5, // Show proper names for stars brighter than propernameLimit
        size: 14, // Maximum size (radius) of star circle in pixels
        exponent: -0.28, // Scale exponent for star size, larger = more linear
        data: "stars.6.json", // Data source for stellar data,
        // number indicates limit magnitude
      },
      dsos: {
        show: true, // Show Deep Space Objects
        limit: 6, // Show only DSOs brighter than limit magnitude
        colors: true, // // Show DSOs in symbol colors if true, use style setting below if false
        style: { fill: "#cccccc", stroke: "#cccccc", width: 2, opacity: 1 }, // Default style for dsos
        names: true, // Show DSO names
        namesType: "name", // Type of DSO ('desig' or language) name shown
        // (see list below for languages codes available for dsos)
        nameStyle: {
          fill: "#000000",
          font: "11px Helvetica, Arial, serif",
          align: "left",
          baseline: "top",
        }, // Style for DSO names
        nameLimit: 6, // Show only names for DSOs brighter than namelimit
        size: null, // Optional seperate scale size for DSOs, null = stars.size
        exponent: 1.4, // Scale exponent for DSO size, larger = more non-linear
        data: "dsos.bright.json", // Data source for DSOs,
        // opt. number indicates limit magnitude
        symbols: {
          //DSO symbol styles, 'stroke'-parameter present = outline
          gg: { shape: "circle", fill: "#ff0000" }, // Galaxy cluster
          g: { shape: "circle", fill: "#ff0000" }, // Generic galaxy
          s: { shape: "circle", fill: "#ff0000" }, // Spiral galaxy
          s0: { shape: "circle", fill: "#ff0000" }, // Lenticular galaxy
          sd: { shape: "circle", fill: "#ff0000" }, // Dwarf galaxy
          e: { shape: "circle", fill: "#ff0000" }, // Elliptical galaxy
          i: { shape: "circle", fill: "#ff0000" }, // Irregular galaxy
          oc: { shape: "circle", fill: "#ffcc00" }, // Open cluster
          gc: { shape: "circle", fill: "#ff9900" }, // Globular cluster
          en: { shape: "circle", fill: "#ff00cc" }, // Emission nebula
          bn: { shape: "circle", fill: "#ff00cc" }, // Generic bright nebula
          sfr: { shape: "circle", fill: "#cc00ff" }, // Star forming region
          rn: { shape: "circle", fill: "#00ooff" }, // Reflection nebula
          pn: { shape: "circle", fill: "#00cccc" }, // Planetary nebula
          snr: { shape: "circle", fill: "#ff00cc" }, // Supernova remnant
          dn: { shape: "circle", fill: "#999999" }, // Dark nebula grey
          pos: { shape: "circle", fill: "#cccccc" }, // Generic marker
        },
      },
      planets: {
        //Show planet locations, if date-time is set
        show: true,
        // List of all objects to show
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
        // Font styles for planetary symbols
        symbols: {
          // Character and color for each symbol in 'which' above (simple circle: \u25cf), optional size override for Sun & Moon
          sol: { symbol: "\u2609", letter: "Su", fill: "#ffff00" },
          mer: { symbol: "\u263f", letter: "Me", fill: "#cccccc" },
          ven: { symbol: "\u2640", letter: "V", fill: "#eeeecc" },
          ter: { symbol: "\u2295", letter: "T", fill: "#00ccff" },
          lun: { symbol: "\u25cf", letter: "L", fill: "#ffffff" }, // overridden by generated crecent, except letter & size
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
        symbolType: "disk", // Type of planet symbol: 'symbol' graphic planet sign, 'disk' filled circle scaled by magnitude
        // 'letter': 1 or 2 letters S Me V L Ma J S U N
        names: false, // Show name in nameType language next to symbol
        nameStyle: {
          fill: "#00ccff",
          font: "14px 'Lucida Sans Unicode', Consolas, sans-serif",
          align: "right",
          baseline: "top",
        },
        namesType: "desig", // Language of planet name (see list below of language codes available for planets),
        // or desig = 3-letter designation
      },
      constellations: {
        names: true, // Show constellation names
        namesType: "iau", // Type of name Latin (iau, default), 3 letter designation (desig) or other language (see list below)
        nameStyle: {
          fill: "#cccc99",
          align: "center",
          baseline: "middle",
          font: [
            "14px Helvetica, Arial, sans-serif", // Style for constellations
            "12px Helvetica, Arial, sans-serif", // Different fonts for diff.
            "11px Helvetica, Arial, sans-serif",
          ],
        }, // ranked constellations
        lines: true, // Show constellation lines, style below
        lineStyle: { stroke: "#cccccc", width: 1, opacity: 0.6 },
        bounds: false, // Show constellation boundaries, style below
        boundStyle: {
          stroke: "#cccc00",
          width: 0.5,
          opacity: 0.8,
          dash: [2, 4],
        },
      },
      mw: {
        show: true, // Show Milky Way as filled multi-polygon outlines
        style: { fill: "#ffffff", opacity: 0.15 }, // Style for MW layers
      },
      lines: {
        // Display & styles for graticule & some planes
        graticule: {
          show: true,
          stroke: "#cccccc",
          width: 0.6,
          opacity: 0.8,
          // grid values: "outline", "center", or [lat,...] specific position
          lon: {
            pos: [""],
            fill: "#eee",
            font: "10px Helvetica, Arial, sans-serif",
          },
          // grid values: "outline", "center", or [lon,...] specific position
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
        // Background style
        fill: "#000000", // Area fill
        opacity: 1,
        stroke: "#000000", // Outline
        width: 1.5,
      },
      horizon: {
        //Show horizon marker, if location is set and map projection is all-sky
        show: false,
        stroke: "#cccccc", // Line
        width: 1.0,
        fill: "#000000", // Area below horizon
        opacity: 0.5,
      },
      daylight: {
        //Show day sky as a gradient, if location is set and map projection is hemispheric
        show: false,
      },
    };
  
      var planets = {
        sol: "#ff0",
        lun: "#fff",
        mer: "#e2e2e2",
        ven: "#f5f5f0",
        mar: "#efd1af",
        jup: "#e6e1df",
        sat: "#eddebc",
      };
  
      var limitMagnitude = 6, radius = 1.2, grayscale = false, starColor = d3.scale.linear().domain([-1.5, 0, limitMagnitude + 1]).range(["white", "white", "black"]), dt = new Date();
  
      Celestial.add({
        type: "json",
        file: "https://ofrohn.github.io/data/stars." + limitMagnitude + ".json",
  
        callback: function (error, json) {
          if (error) return console.warn(error);
          var stars = Celestial.getData(json, config.transform);
  
          Celestial.container
            .selectAll(".astars")
            .data(stars.features)
            .enter()
            .append("path")
            .attr("class", "astar");
  
          Celestial.redraw();
        },
  
        redraw: function () {
          Celestial.context.globalAlpha = 1;
          var indexColor = "#fff", planet;
  
          Celestial.container.selectAll(".astar").each(function (d) {
            if (Celestial.clip(d.geometry.coordinates)) {
              var pt = Celestial.mapProjection(d.geometry.coordinates);
  
              if (grayscale === false) indexColor = Celestial.starColor(d);
              starColor.range([indexColor, indexColor, "black"]);
              Celestial.context.fillStyle = starColor(d.properties.mag);
              Celestial.context.beginPath();
              Celestial.context.arc(pt[0], pt[1], radius, 0, 2 * Math.PI);
              Celestial.context.closePath();
              Celestial.context.fill();
            }
          });
  
          if (!Celestial.origin) return;
          var o = Celestial.origin(dt).spherical();
  
          for (var key in planets) {
            var planet = Celestial.getPlanet(key, dt);
            if(planet != undefined) {
                if (!Celestial.clip(planet.ephemeris.pos)) continue;
                var pt = Celestial.mapProjection(planet.ephemeris.pos);
                if (key === "lun") {
                Celestial.symbol().type("crescent").size(110).age(planet.ephemeris.age).position(pt)(Celestial.context);
                } else {
                if (key === "sol") radius = 2;
                else radius = 1.2 - (planet.ephemeris.mag + 5) / 10;
                Celestial.context.fillStyle =
                    grayscale === false ? planets[key] : "#eee";
                Celestial.context.beginPath();
                Celestial.context.arc(pt[0], pt[1], radius * 2, 0, 2 * Math.PI);
                Celestial.context.closePath();
                Celestial.context.fill();
                }
            }
          }
        },
      });
  
      Celestial.display(config);
    </script>

    <script>
        window.rotateStarMap = (rotate) => { Celestial.rotate(rotate) }; 
        window.reloadStarMap = (config) => { Celestial.reload(config) }; 
    </script>
</body>
</html>`;
