const express = require("express");

require("dotenv").config();

const fs = require("fs");

const axios = require("axios");

const Telegraf = require("telegraf").Telegraf;

const path = require("path");

const bot = new Telegraf(process.env.TOKEN, { polling: true });

const app = express();

const PORT = process.env.PORT || 3000;

// codeData will return my code which is written;
let codeData;

// Read the file which written code.
fs.readFile(path.dirname(__filename + "/app.js"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  codeData = data;
});

let firstName = null;
let lastName = null;
let cityNam = null;

// Start bot by /start command
bot.command("start", (ctx) => {
  firstName = null;
  lastName = null;
  cityNam = null;

  bot.telegram.sendMessage(
    ctx.chat.id,
    `Welcom to ${ctx.botInfo.first_name} bot. \n\n Enter your first name.`,
    {}
  );
});

bot.on("text", (msg) => {
  //let's check whether user is entered firs name or not
  if (firstName === null) {
    firstName = msg.message.text;
    bot.telegram.sendMessage(msg.chat.id, "Enter your Last name. ", {});
    return;
  }

  // let's check wheter user entered last name or not;
  if (lastName === null) {
    lastName = msg.message.text;
    const botName = msg.botInfo.first_name;
    msg.reply(
      `Hi ${firstName} ${lastName} welcome to ${botName}, this bot is open source here is the code, \n\n\n ${codeData} \n \n \n Enter your city name.`
    );
    return;
  }

  // Let's check whether user is entered city name or not if yes then chat will stoped and to restart you need to start from /star;
  if (cityNam === null) {
    cityNam = msg.message.text;

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

// Launch ur bot
bot.launch();

// Listen to the server
app.listen(PORT, () => {
  console.log("Server has been started " + PORT);
});
