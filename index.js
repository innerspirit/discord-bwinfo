const Discord = require("discord.js");
require('dotenv').config();

const request = require('superagent');
const Promise = this.Promise || require('promise');
const agent = require('superagent-promise')(request, Promise);

const client = new Discord.Client();
const baseurl = 'https://liquipedia.net/starcraft/api.php';

client.login(process.env.BOT_TOKEN);

client.on('message', message => {
  if (message.content === '!' + "marine") {
    (async () => {
      try {
        const res = await request.get(baseurl + '?action=query&prop=revisions&rvprop=content&format=json&titles=Marine&rvsection=0');
        console.log(res.body.query.pages[1103].revisions[0]["*"]);
        // const embed = new Discord.RichEmbed()
        //   .setDescription(query.pages[1103].revisions[0]["*"]);
        // message.channel.send(embed);
      } catch (err) {
        console.error(err);
      }
    })();
  }
});