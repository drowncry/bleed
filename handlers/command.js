const { readdirSync } = require("fs");
const Ascii = require("ascii-table");
let table = new Ascii("Comandos");
table.setHeading("Comando", "Estado");

module.exports = (client) => {
    // Estas son las carpetas que el bot va a leer ahora
    const categorias = [
        "configuration", 
        "fun", 
        "information", 
        "lastfm", 
        "moderation", 
        "owner", 
        "utility"
    ];

    categorias.forEach(dir => {
        const commands = readdirSync(`./${dir}/`).filter(file => file.endsWith(".js"));
    
        for (let file of commands) {
            let pull = require(`../${dir}/${file}`);
    
            if (pull.name) {
                client.commands.set(pull.name, pull);
                table.addRow(file, '✅');
            } else {
                table.addRow(file, `❌ -> falta help.name`);
                continue;
            }
    
            if (pull.aliases && Array.isArray(pull.aliases)) 
                pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });
    
    console.log(table.toString());
}
