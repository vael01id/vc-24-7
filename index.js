// Membaca file /.env yang di-mount ama Choreo secara paksa
const fs = require('fs');
if (fs.existsSync('/.env')) {
    require('dotenv').config({ path: '/.env' });
} else if (fs.existsSync('.env')) {
    require('dotenv').config();
}

// 🛑 TAMBAHKAN LINE INI BUAT NGE-CEK TOKEN LU KEBACA APA KAGAK
console.log("=== ISI CONFIG YANG KEBACA ===");
console.log("BOT_TOKEN_ADA:", process.env.BOT_TOKEN ? "YA (Ada Isinya)" : "KAGAK ADA (KOSONG)");
console.log("GUILD_ID:", process.env.GUILD_ID || "KOSONG");
console.log("CHANNEL_ID:", process.env.CHANNEL_ID || "KOSONG");
console.log("=============================");

const http = require('http');
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

// 1. DUMMY SERVER WITH BYPASS FOR PINGER
const port = process.env.PORT || 7860; 
http.createServer((req, res) => {
    // Trik Sakti: Kalau ada yang nembak, langsung kasih respon 200 OK tanpa pandang bulu
    res.writeHead(200, { 
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
    });
    res.write('Satpam VC Stay Alive, Cok!');
    res.end();
}).listen(port, () => {
    console.log(`Health check server running on port ${port}`);
});

// 2. DISCORD BOT CLIENT
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildVoiceStates
    ]
});

const TOKEN = process.env.BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

function konekVC() {
    try {
        const guild = client.guilds.cache.get(GUILD_ID);
        if (!guild) return;
        joinVoiceChannel({
            channelId: CHANNEL_ID,
            guildId: GUILD_ID,
            adapterCreator: guild.voiceAdapterCreator,
        });
        console.log("Bot sukses merapat ke VC!");
    } catch (error) {
        console.error("Gagal join VC:", error.message);
    }
}

client.once('ready', () => {
    console.log(`[READY] ${client.user.tag} melek di Choreo!`);
    konekVC();
});

process.on('unhandledRejection', (reason) => {});
process.on('uncaughtException', (err) => {});

client.login(TOKEN).catch(() => {});