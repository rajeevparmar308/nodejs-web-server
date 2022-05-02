const path = require("path");
const express = require("express");
const hbs = require("hbs");
const fetch = require("node-fetch");

const app = express();

const publicDirectoryPath = path.join(__dirname, "./public");

const viewDirectoryPath = path.join(__dirname, "./templates/views");

const partialDirectoryPath = path.join(__dirname, "./templates/partials");

console.log(publicDirectoryPath);

app.use(express.static(publicDirectoryPath));

app.set("view engine", "hbs");

app.set("views", viewDirectoryPath);

hbs.registerPartials(partialDirectoryPath);

app.get("", (req, res) => {
  console.log("Inside home");
  res.render("index", {
    title: "my first page",
    designer: "rajeev parmar 2",
  });
});

app.get("/weather", (req, res) => {
  console.log(req.query);
  if (!req.query.place) {
    res.send("Please provide a valid place");
  }
  const address = req.query.place;

  const weather = async (locationAddress) => {
    try {
      const url =
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        locationAddress +
        ".json?access_token=pk.eyJ1IjoicmFqZWV2MzA4IiwiYSI6ImNsMWQ3NTc5cDA0ZHYzanM1aXBibzc4Z2QifQ.paiwzCGD2gwKARUaFrdpCw&limit=1";

      const locResponse = await fetch(url);

      const data = await locResponse.json();

      if (data.message !== "Not Found" && data.features.length > 0) {
        const lat = data.features[0].center[0];
        const long = data.features[0].center[1];

        const weatherURL =
          "http://api.weatherstack.com/current?access_key=781f708b233141a1d6ffdbfd3ae5197e&query=" +
          long +
          "," +
          lat;
        const weatherResponse = await fetch(weatherURL);
        const weatherData = await weatherResponse.json();

        if (weatherData.error && weatherData.error.code == 601) {
          res.send(
            "Please specify a valid location identifier using the query parameter"
          );
        } else {
          res.send(
            `Currently it's ${weatherData.current.weather_descriptions[0]} in ${weatherData.location.name} with a temperature of ${weatherData.current.temperature} degree celcius.`
          );
        }
      } else {
        res.send("Couldn't find location");
      }
    } catch (e) {
      console.log(e);
      // if (e.type === "system") {
      //   console.log("unable to connect to server. Please try later.");
      // }
    }
  };

  weather(address);
});

app.get("*", (req, res) => {
  res.send("Please check URL");
});

app.listen(3200, () => {
  console.log("Server2 is up and running on port 3200");
});
