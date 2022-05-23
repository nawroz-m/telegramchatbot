const express = require("express");
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const Telegraf = require("telegraf").Telegraf;

const bot = new Telegraf(process.env.TOKEN, { polling: true });

const app = express();

const PORT = process.env.PORT || 3000;
let codeData;
fs.readFile(process.env.CODEPATH, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  codeData = data;
  //   console.log(data);
});

let firstName = null;
let lastName = null;
let cityNam = null;

bot.command("start", (ctx) => {
  firstName = null;
  lastName = null;
  cityNam = null;
  bot.telegram.sendMessage(ctx.chat.id, "Enter your first name", {});
});

bot.on("text", (msg) => {
  if (firstName === null) {
    firstName = msg.message.text;
    bot.telegram.sendMessage(msg.chat.id, "Enter your Last name ", {});
    return;
  }

  if (lastName === null) {
    lastName = msg.message.text;
    const botName = msg.botInfo.first_name;
    msg.reply(
      `Hi ${firstName} ${lastName} welcome to ${botName}, this bot is open source here is the code, \n ${codeData}`
    );
    msg.reply("Enter your city name");
    return;
  }
  if (cityNam === null) {
    cityNam = msg.message.text;
    console.log(cityNam);
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityNam}&appid=${process.env.APIID}`,
        {}
      )
      .then(function (response) {
        // console.log(response.data);
        const main = response.data.weather[0].main;
        const description = response.data.weather[0].description;
        const lat = response.data.coord.lat;

        const long = response.data.coord.lon;
        const temp = response.data.main.temp;
        const feels_like = response.data.main.feels_like;
        const windSpeed = response.data.wind.speed;
        const windDegree = response.data.wind.deg;

        msg.reply(
          `${main}. It is currently ${temp} temperature degres out. It feels like ${feels_like} degress out. With wind speed ${windSpeed} and wind degree of ${windDegree} by lat ${lat} and lon ${long} in ${cityNam}.`
        );
        return;
      });
  }
});

bot.launch();

app.listen(PORT, () => {
  console.log("Server has been started");
});
