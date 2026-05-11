const { ReadableStream } = require("node-superfetch"); 
// Si da error de ReadableStream, esto lo suele arreglar.
const http = require('http');
// Esto crea un servidor básico para que Render mantenga el bot 24/7
http.createServer(function (req, res) {
  res.write('Bot is online');
  res.end();
}).listen(process.env.PORT || 8080);

// Configuración de variables (Prioriza las de Render por seguridad)
const config = require("./config.json");
const token = process.env.TOKEN || config.token;
const mongoUrl = process.env.MONGO_URL || 'mongo url'; // Reemplaza 'mongo url' si no usas variables de entorno
const default_prefix = config.default_prefix;
const color = config.color;

const Discord = require("discord.js");
require("@haileybot/sanitize-role-mentions")();

const client = new Discord.Client({
  disableMentions: "everyone",
  fetchAllMembers: true,
  partials: ['MESSAGE', 'REACTION']
});

const mongoose = require('mongoose');
mongoose.connect(mongoUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => console.log('Conectado a MongoDB correctamente'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

const jointocreate = require("./jointocreate");
jointocreate(client);

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.db = require("quick.db");

module.exports = client;

["command", "event"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

// Esto es para que el bot aparezca como si estuviera en Android
Discord.Constants.DefaultOptions.ws.properties.$browser = "Discord Android";

client.login(token);
