const { Client } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json'); // config.json 파일에 봇의 토큰, 클라이언트 ID, 서버 ID를 저장합니다.

const commands = [
  {
    name: 'hello',
    description: '인사합니다.',
  },
  // 추가적인 슬래시 커맨드를 여기에 작성하세요
];

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client();

client.on('ready', () => {
  console.log(`봇이 로그인하였습니다: ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'hello') {
    await interaction.reply('안녕하세요!');
  }
  // 추가적인 슬래시 커맨드를 여기에 작성하세요
});

client.login(token);
