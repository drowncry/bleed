const { readdirSync } = require("fs");
const Ascii = require("ascii-table");
let table = new Ascii("Comandos");
table.setHeading("Comando", "Estado");

module.exports = (client) => {
    // Lista de carpetas según tu imagen
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
            try {
                // Forzamos la limpieza de caché para evitar errores de rutas previas
                delete require.cache[require.resolve(`../${dir}/${file}`)];
                let pull = require(`../${dir}/${file}`);
        
                if (pull.name) {
                    client.commands.set(pull.name, pull);
                    table.addRow(file, '✅');
                } else {
                    table.addRow(file, `❌ -> help.name`);
                }
        
                if (pull.aliases && Array.isArray(pull.aliases)) {
                    pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
                }
            } catch (e) {
                // Este log te dirá en la consola qué archivos tienen mal la ruta del config.json
                console.log(`Error en ${file}: ${e.message}`);
                table.addRow(file, `❌ -> Error`);
            }
        }
    });
    
    console.log(table.toString());
}
