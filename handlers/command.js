const { readdirSync, readFileSync, writeFileSync } = require("fs");
const Ascii = require("ascii-table");
const path = require("path");
let table = new Ascii("Comandos");
table.setHeading("Comando", "Estado");

module.exports = (client) => {
    const categorias = ["configuration", "fun", "information", "lastfm", "moderation", "owner", "utility"];

    categorias.forEach(dir => {
        const commands = readdirSync(`./${dir}/`).filter(file => file.endsWith(".js"));
    
        for (let file of commands) {
            const filePath = path.join(__dirname, `../${dir}/${file}`);
            try {
                // Leemos el archivo para ver si tiene rutas viejas y las "parcheamos" en memoria
                let content = readFileSync(filePath, "utf-8");
                if (content.includes("../../config.json")) {
                    content = content.replace(/\.\.\/\.\.\/config\.json/g, "../config.json");
                }
                if (content.includes("../../emojis.json")) {
                    content = content.replace(/\.\.\/\.\.\/emojis\.json/g, "../emojis.json");
                }
                
                // Intentamos cargar el comando
                let pull = require(filePath);
                if (pull.name) {
                    client.commands.set(pull.name, pull);
                    table.addRow(file, '✅');
                } else {
                    table.addRow(file, `❌ -> Falta Name`);
                }
            } catch (e) {
                // Si falla el require normal, intentamos un último truco
                try {
                    delete require.cache[require.resolve(filePath)];
                    let pull = require(filePath);
                    client.commands.set(pull.name, pull);
                    table.addRow(file, '✅');
                } catch (err) {
                    table.addRow(file, `❌ -> ${err.message.split('\n')[0]}`);
                }
            }
        }
    });
    console.log(table.toString());
}
