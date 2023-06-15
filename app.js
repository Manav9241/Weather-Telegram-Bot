require("dotenv").config();

// const { Telegraf } = require("telegraf");
const { Telegraf, Scenes, session } = require("telegraf");


const { message } = require("telegraf/filters");
const axios = require("axios");
const https = require("https");

const bot = new Telegraf(process.env.BOT_TOKEN);

// bot.start((ctx) => ctx.reply('Welcome to the Weather Bot!'));



//// Code change to redirect to any page after the end of weather command /////
const startScene = new Scenes.BaseScene('start');

// Define the start scene behavior
startScene.enter((ctx) => {
  ctx.reply('Welcome to the Weather Bot!');
});

// Register the start scene with the bot
const stage = new Scenes.Stage([startScene]);
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => ctx.scene.enter('start'));

//////////////




bot.command("weather" , async function(ctx){
    //console.log(ctx);
    const city = ctx.message.text.split(" ")[1];
    const unit = "metric";

    const weatherAPIKey = '1bb4d724ad22b03b05420c242c1c1063';
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + weatherAPIKey + "&units="+unit;

    https.get(url , function(response){
        //console.log(response);

        response.on("data" , function(data){
            // console.log(weatherData);

            const weatherData = JSON.parse(data);
            const temperature = weatherData.main.temp;
            const description = weatherData.weather[0].description;

            const icon = weatherData.weather[0].icon;
            const iconUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
            const replyText = "The current temperature in " + city + " is " + temperature + "°C with " + description + ".";

            ctx.replyWithPhoto({ url: iconUrl })
                .then(() => {
                    ctx.reply(replyText);
                })
                .then(() => {
                    ctx.scene.enter('start');
                })
                .catch((error) => {
                    console.log('Error sending photo or redirecting to start:', error);
                });
        });

    }).on("error" , (error)=>{
        console.log(error);
    });;


});


bot.launch()
    .then(()=> console.log("Bot launched succesfully"));

// async function getWeather(location)
