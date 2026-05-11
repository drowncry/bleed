const { readdirSync } = require("fs");
const Ascii = require("ascii-table");
const path = require("path");
let table = new Ascii("Comandos");
table.setHeading("Comando", "Estado");

module.exports = (client) => {
    // Forzamos que el config esté disponible globalmente para evitar errores de ruta
    global.config = require("../config.json");

    const categorias = ["configuration", "fun", "information", "lastfm", "moderation", "owner", "utility"];

    categorias.forEach(dir => {
        const commands = readdirSync(`./${dir}/`).filter(file => file.endsWith(".js"));
    
        for (let file of commands) {
            try {
                let pull = require(`../${dir}/${file}`);
                if (pull.name) {
                    client.commands.set(pull.name, pull);
                    table.addRow(file, '✅');
                } else {
                    table.addRow(file, `❌ -> help.name`);
                }
            } catch (e) {
                console.log(`Error en ${file}: ${e.message}`);
                table.addRow(file, `❌ -> Error`);
            }
        }
    });
    console.log(table.toString());
}
