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
        window.downloadSVG = () => { return Celestial.exportSVG()};

        window.rotateStarMap = (rotate) => { Celestial.rotate(rotate) }; 
        window.reloadStarMap = (config) => { Celestial.reload(config) }; 
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
</body>
</html>`;
