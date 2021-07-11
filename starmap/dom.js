export default `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Star Map</title>
    <script src="lib/d3.min.js"></script>
    <script type="text/javascript" src="lib/d3.geo.projection.min.js"></script>
    <script type="text/javascript" src="celestial.js"></script>
    <link rel="stylesheet" href="celestial.css" />
    <style type="text/css">.btn {display: inline-block; font: bold 14pt "Lucida Console", Consolas, monospace; margin: 0 6px; padding: 2px 6px; border: 2px solid #000; border-radius: 3px; background: rgba(204, 204, 255, 0.6); cursor: pointer;}</style>
</head>
<body>
    <div style="overflow: hidden; margin: 0 auto">
    <div id="celestial-map"></div>
    </div>

    <script>
        window.downloadSVG = () => { return Celestial.exportSVG()};
    </script>
    <script>
    var config = window.getConfig();
  
      var planets = {
        sol: "#ff0",
        lun: "#fff",
        mer: "#e2e2e2",
        ven: "#f5f5f0",
        mar: "#efd1af",
        jup: "#e6e1df",
        sat: "#eddebc",
      };
  
      // Asterisms canvas style properties for lines and text
      var limitMagnitude = 6,
        radius = 1.2,
        grayscale = false,
        starColor = d3.scale
          .linear()
          .domain([-1.5, 0, limitMagnitude + 1])
          .range(["white", "white", "black"]),
        dt = new Date();
  
      Celestial.add({
        type: "json",
        file: "https://ofrohn.github.io/data/stars." + limitMagnitude + ".json",
  
        callback: function (error, json) {
          if (error) return console.warn(error);
          // Load the geoJSON file and transform to correct coordinate system, if necessary
          var stars = Celestial.getData(json, config.transform);
  
          // Add to celestiasl objects container in d3
          Celestial.container
            .selectAll(".astars")
            .data(stars.features)
            .enter()
            .append("path")
            .attr("class", "astar");
  
          // Trigger redraw to display changes
          Celestial.redraw();
        },
  
        redraw: function () {
          Celestial.context.globalAlpha = 1;
          // Default color for grayscale
          var indexColor = "#fff",
            planet;
  
          // Select the added objects by class name as given previously
          Celestial.container.selectAll(".astar").each(function (d) {
            // If point is visible (this doesn't work automatically for points)
            if (Celestial.clip(d.geometry.coordinates)) {
              // get point coordinates
              var pt = Celestial.mapProjection(d.geometry.coordinates);
  
              // draw on canvas
              // if not grayscale get the stars color from its b-v index
              if (grayscale === false) indexColor = Celestial.starColor(d);
              // Set color range to the stars color
              starColor.range([indexColor, indexColor, "black"]);
              // Set object color
              Celestial.context.fillStyle = starColor(d.properties.mag);
              // Start the drawing path
              Celestial.context.beginPath();
              // Thats a circle in html5 canvas
              Celestial.context.arc(pt[0], pt[1], radius, 0, 2 * Math.PI);
              // Finish the drawing path
              Celestial.context.closePath();
              // Fill the object path with the prevoiusly set fill color
              Celestial.context.fill();
            }
          });
  
          if (!Celestial.origin) return;
          var o = Celestial.origin(dt).spherical();
  
          for (var key in planets) {
            var planet = Celestial.getPlanet(key, dt);
            if (!Celestial.clip(planet.ephemeris.pos)) continue;
            var pt = Celestial.mapProjection(planet.ephemeris.pos);
            if (key === "lun") {
              Celestial.symbol()
                .type("crescent")
                .size(110)
                .age(planet.ephemeris.age)
                .position(pt)(Celestial.context);
            } else {
              if (key === "sol") radius = 2;
              else radius = 1.2 - (planet.ephemeris.mag + 5) / 10;
              Celestial.context.fillStyle =
                grayscale === false ? planets[key] : "#eee";
              // Start the drawing path
              Celestial.context.beginPath();
              // draw circle on canvas
              Celestial.context.arc(pt[0], pt[1], radius * 2, 0, 2 * Math.PI);
              // Finish the drawing path
              Celestial.context.closePath();
              // Fill the object path with the prevoiusly set fill color
              Celestial.context.fill();
            }
          }
        },
      });

      var countRedraw = 0

      Celestial.addCallback(() => {
        countRedraw++;

        if(countRedraw == 12) {
            window.onModulesLoaded()
        }
      })
  
      Celestial.display(config);
      
    </script>
</body>
</html>`;
