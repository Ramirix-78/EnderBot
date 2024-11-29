// Dependencias 
require ('dotenv').config();
const Discord = require("discord.js");
const fs = require("fs");

// Cliente de discord
const Client = new Discord.Client({
    intents: 53608447,
})

// Cargar comandos
Client.commands = new Discord.Collection();

fs.readdirSync("./slash_commands").forEach((commandfile) => {
    const command = require(`./slash_commands/${commandfile}`);
    Client.commands.set(command.data.name, command);
});

// Registrar comandos
const REST = new Discord.REST().setToken(process.env.CLIENT_TOKEN);

(async () => {
    try {
        await REST.put(
            Discord.Routes.applicationGuildCommands(process.env.clientId, process.env.guildId),
            {
                body: Client.commands.map((cmd) => cmd.data.toJSON()),
            }
        );
        console.log(`Loaded ${Client.commands.size} slash commands {/}`);
    } catch (error) {
        console.log("Error loading commands", error);
    }
})();

// Evento ready: Se ejecuta cuando el bot está listo 
Client.on("ready", async (client) => {
    console.log("Bot Online!");
})

// Evento interactionCreate: Se ejecuta cuando un usuario de la comunidad utiliza una interacción
Client.on("interactionCreate", async (interaction) => {
    // Si la interacción es un slash commands
    if (interaction.isChatInputCommand()) {
        // Obtiene los datos del comando
        const command = Client.commands.get(interaction.commandName);
        //Ejecuta el comando
        command.execute(interaction).catch(console.error);
    }
    else {
        // Si la interacción no es un slash command (botones, menús, etc...)
    }
});

// Conexión
Client.login(process.env.CLIENT_TOKEN);