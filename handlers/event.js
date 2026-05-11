const { readdirSync } = require("fs");

module.exports = (client) => {
    const commands = readdirSync(`./events/`).filter(file => file.endsWith(".js"));
    for (let file of commands) {
        try {
            let pull = require(`../events/${file}`);
            if (pull.name) {
                client.events.set(pull.name, pull);
            }
        } catch (e) {
            console.log(`Error en evento ${file}: ${e.message}`);
        }
    }
    console.log("Eventos cargados correctamente.");
}
