// Add bot by going to https://discord.com/api/oauth2/authorize?client_id=798538562253488128&permissions=3072&scope=bot

const Discord = require("discord.js");
require('dotenv').config();

const request = require('superagent');
const Promise = this.Promise || require('promise');
const agent = require('superagent-promise')(request, Promise);

const wtf = require('wtf_wikipedia');

const NodeCache = require( "node-cache" );
const cache = new NodeCache();

const client = new Discord.Client();
const baseurl = 'https://liquipedia.net/starcraft/api.php';

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 

client.login(process.env.BOT_TOKEN);

client.on('message', message => {
  if (message.content.startsWith('!bw')) {
    const page = message.content.slice(4);
    (async (page, message) => {
      try {
        const res = await request.get(baseurl + '?action=query&prop=revisions&rvprop=content&format=json&titles='+page+'&rvsection=0');
        let wtxt = cache.get(page);
        if ( wtxt == undefined ){
          wtxt = Object.values(res.body.query.pages).pop().revisions.pop()["*"];
          cache.set( page, wtxt, 21600 );
        }
        const doc = wtf(wtxt);

        const pic = doc.images(0).json().thumb;

        const ib = doc.infobox();
        const kv = ib.keyValue(); 
        const text = Object.keys(kv).filter(v => !v.startsWith('bonus') && !v.startsWith('image')).map(v => v + ': ' + kv[v].replace('.png', '') + '\n').join('');

        const embed = new Discord.MessageEmbed()
          .setThumbnail(pic.replace('https://wikipedia.org/wiki/', 'https://liquipedia.net/starcraft/'))
          .setDescription(text);
        await message.channel.send(embed);
        await sleep(2);
      } catch (err) {
        console.error(err);
      }
    })(page, message);
  }
});