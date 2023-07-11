const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const prefix="/";
const sleep = (ms) => {
  return new Promise((r) => setTimeout(r, ms));
}

client.on('ready', () => {
  console.log(`${client.user.tag}에 로그인하였습니다!`);
});

client.on('messageCreate', (message) => {
  if (message.content.startsWith('!ping')) {
    message.reply('Pong!');
  }

  if (message.content.startsWith('!hello')) {
    message.reply('안녕하세요!');
  }

  if (message.content.startsWith('/roll')) {
    const sides = message.content.split(' ')[1];
    const result = Math.floor(Math.random() * sides) + 1;
    message.reply(`주사위를 굴려 ${sides}면 주사위의 결과는 ${result}입니다!`);
  }

  // 추가적인 명령어를 여기에 작성하세요
});

client.login('MTExOTY1OTUwODA4NDUxODkxMg.G3kuXG.0tyrf9qlclNtrf6KpYOzo77v_ajVwKcdL3epkM');
