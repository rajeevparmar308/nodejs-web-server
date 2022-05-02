const express = require("express");
const app = express();
app.get("", (req, res) => {
  res.send("<h1>Home Page</h1>");
});
app.get("/about", (req, res) => {
  res.send([
    {
      weatherForcast: "Its sunny",
      location: "Shimla",
    },
    {
      weatherForcast: "Its Cloudy",
      location: "Kinnaur",
    },
  ]);
});
app.get("/help", (req, res) => {
  res.send("Help Page");
});
app.listen(3000, (req, res) => {
  console.log("Server is up and running");
});
