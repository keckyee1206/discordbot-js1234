const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
  {
    name: 'stock',
    description: '주식 정보를 조회합니다.',
    options: [
      {
        name: 'stockname',
        description: '조회할 주식의 이름',
        type: 3, // String 타입
        required: true,
      },
    ],
  },
  {
    name: '구매',
    description: '주식을 구매합니다.',
    options: [
      {
        name: 'stockname',
        description: '구매할 주식의 이름',
        type: 3, // String 타입
        required: true,
      },
      {
        name: 'quantity',
        description: '구매할 주식의 수량',
        type: 4, // Integer 타입
        required: true,
      },
    ],
  },
  {
    name: '판매',
    description: '주식을 판매합니다.',
    options: [
      {
        name: 'stockname',
        description: '판매할 주식의 이름',
        type: 3, // String 타입
        required: true,
      },
      {
        name: 'quantity',
        description: '판매할 주식의 수량',
        type: 4, // Integer 타입
        required: true,
      },
    ],
  },
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

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
  console.log(`봇이 로그인하였습니다: ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'stock') {
    const stockName = options.getString('stockname');

    if (!stockName || !stocks[stockName]) {
      await interaction.reply('유효한 주식 이름을 입력해주세요.');
      return;
    }

    const stock = stocks[stockName];
    await interaction.reply(`주식: ${stock.name}, 가격: $${stock.price}, 보유량: ${stock.quantity}`);
  }

  if (commandName === 'buy') {
    const stockName = options.getString('stockname');
    const quantity = options.getInteger('quantity');

    if (!stockName || !stocks[stockName] || !quantity || quantity <= 0) {
      await interaction.reply('유효한 주식 이름과 수량을 입력해주세요.');
      return;
    }

    const stock = stocks[stockName];

    if (quantity > stock.quantity) {
      await interaction.reply('주식 구매 실패: 보유량이 부족합니다.');
      return;
    }

    const totalPrice = stock.price * quantity;
    stock.quantity -= quantity;
    await interaction.reply(`주식 구매 완료: ${stock.name}, 수량: ${quantity}, 가격: $${totalPrice}`);
  }

  if (commandName === 'sell') {
    const stockName = options.getString('stockname');
    const quantity = options.getInteger('quantity');

    if (!stockName || !stocks[stockName] || !quantity || quantity <= 0) {
      await interaction.reply('유효한 주식 이름과 수량을 입력해주세요.');
      return;
    }

    const stock = stocks[stockName];

    if (quantity > stock.quantity) {
      await interaction.reply('주식 판매 실패: 보유량이 부족합니다.');
      return;
    }

    const totalPrice = stock.price * quantity;
    stock.quantity += quantity;
    await interaction.reply(`주식 판매 완료: ${stock.name}, 수량: ${quantity}, 가격: $${totalPrice}`);
  }
});

client.login(token);
