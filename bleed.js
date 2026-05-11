const http = require('http');
// Servidor para que Render mantenga el bot encendido
http.createServer(function (req, res) {
  res.write('Bot is online');
  res.end();
}).listen(process.env.PORT || 8080);

const { default_prefix, color } = require("./config.json");
// Usamos process.env.TOKEN para que sea más seguro
const token = process.env.TOKEN; 
const Discord = require("discord.js");
require("@haileybot/sanitize-role-mentions")();

const client = new Discord.Client({
  disableMentions: "everyone",
  fetchAllMembers: true,
  partials: ['MESSAGE', 'REACTION']
});

const mongoose = require('mongoose')
// Asegúrate de poner tu URL de Mongo en las variables de Render también
mongoose.connect(process.env.MONGO_URL || 'mongo url', {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(console.log('connected to mongoose'))

const jointocreate = require("./jointocreate");
jointocreate(client);

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.db = require("quick.db");

module.exports = client;

["command", "event"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

Discord.Constants.DefaultOptions.ws.properties.$browser = "Discord Android"

client.login(token)
