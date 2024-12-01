const Discord = require("discord.js");
const { exec } = require("child_process");
const axios = require("axios");

const channelId = process.env.channelId;

// Configuración del canal autorizado
const canalAutorizadoId = channelId;

// Verificamos si la interacción proviene del canal autorizado
function isCanalAutorizado (interaction) {
    return interaction.channel.id === canalAutorizadoId;
}

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("startserver")
        .setDescription("Inicia el servidor de Minecraft"),

    execute: async (interaction) => {
        // Verificar si el comando se esta ejecutando en el canal autorizado
        if (!isCanalAutorizado(interaction)) {
            return interaction.reply({
                content: "Este comando solo puede ejecutarse en el canal autorizado",
                ephemeral: true // Respuesta privada solo para el usuario
            });
        }

        // Enviar una respuesta temporal que indica al usuario que el servidor se está iniciando
        await interaction.reply({
            content: 'Iniciando el servidor de Minecraft... Esto puede tomar un momento.',
        });

        // URL del servidor intermedio (base URL y endpoint separados)
        const baseURL = 'https://8707-2800-98-110e-3c3-64bc-fa15-a426-d5be.ngrok-free.app';
        const endpoint = '/startserver';

        // Concatenar la URL completa cuando sea necesario
        const servidorIntermedioURL = baseURL + endpoint;

        try {
            // Realizar la solicitud HTTP POST al servidor intermedio
            const response = await axios.post(servidorIntermedioURL);

            if (response.data.status === 'online') {
                // Si el servidor ya está en línea, enviar la información
                console.log(JSON.stringify(response.data));
                await interaction.editReply({
                    content : `El servidor de Minecraft ya está en línea.\nJugadores conectados: ${response.data.players}\nNúmero máximo de jugadores: ${response.data.max_players}`
                });
            }
            else if (response.data.status === 'starting') {
                await interaction.editReply({
                    content: 'El servidor de Minecraft se está iniciando. Esto puede tomar algunos minutos.'
                });
            }
            else {
                // Si el servidor fue iniciado correctamente
                await interaction.editReply({
                    content : `El servidor de Minecraft ya está en línea.\nJugadores conectados: ${response.data.players}\nNúmero máximo de jugadores: ${response.data.max_players}`
                });
            }
        } catch (error) {
            console.error('Error al comunicar con el servidor intermedio: ', error);
            await interaction.editReply({
                content: 'Hubo un error al intentar iniciar el servidor',
            });
        }
    },
};