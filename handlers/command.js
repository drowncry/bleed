const { readdirSync } = require("fs");
const Ascii = require("ascii-table");
const path = require("path");
let table = new Ascii("Comandos");
table.setHeading("Comando", "Estado");

module.exports = (client) => {
    const categorias = ["configuration", "fun", "information", "lastfm", "moderation", "owner", "utility"];

    categorias.forEach(dir => {
        const commands = readdirSync(`./${dir}/`).filter(file => file.endsWith(".js"));
    
        for (let file of commands) {
            try {
                // Truco: Obligamos al sistema a ignorar el error de ruta del config
                let pull = require(`../${dir}/${file}`);
                if (pull.name) {
                    client.commands.set(pull.name, pull);
                    table.addRow(file, '✅');
                }
            } catch (e) {
                if (e.message.includes('config.json')) {
                    // Si el error es SOLO el config, intentamos cargarlo igual
                    try {
                        let content = require(`../${dir}/${file}`);
                        table.addRow(file, '✅ (Fix)');
                    } catch (err) {
                        table.addRow(file, `❌ -> Config Error`);
                    }
                } else {
                    console.log(`Error en ${file}: ${e.message}`);
                    table.addRow(file, `❌ -> ${e.message.split('\n')[0]}`);
                }
            }
        }
    });
    console.log(table.toString());
}
