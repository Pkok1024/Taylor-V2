const { getUser } = require('../helper/db');

let handler = async (m, { conn }) => {
  try {
    // Get user data from the database
    const user = await getUser(m.sender);
    if (!user) throw new Error('User not found');

    // Check if the user has enough money to play the game
    if (user.money < 100) throw new Error('Not enough money to play the game');

    // Roll the dice
    const diceValue = Math.floor(Math.random() * 6) + 1;
    const diceImage = rollDice(diceValue);
    const isHighRoll = diceValue >= 4;

    // Calculate the rewards
    let additionalCoins = 0;
    if (diceValue === 3) additionalCoins = 300;
    else additionalCoins = diceValue * 100;

    let baseCoins = 0;
    if (isHighRoll) baseCoins = Math.min(Math.floor(Math.random() * 15001), 15000);

    let baseExp = 0;
    if (isHighRoll) baseExp = Math.min(Math.floor(Math.random() * 10001), 10000);

    let multiplier = 1;
    if (isHighRoll) multiplier = Math.floor(Math.random() * 2) + 1;

    // Calculate the final rewards
    const coins = Math.min(baseCoins * multiplier + additionalCoins, 15000);
    const exp = Math.min(baseExp * multiplier, 10000);

    // Update the user data in the database
    await updateUser(m.sender, { money: user.money - 100, exp: user.exp + exp, money: user.money + coins });

    // Prepare the response message
    const coinMessage = coins ? `💰 *${coins.toLocaleString()}* coins earned!` : 'No coins earned.';
    const expMessage = exp ? `🌟 *${exp.toLocaleString()}* exp gained!` : 'No exp gained.';
    const additionalCoinsMessage = additionalCoins ? `💰 Additional *${additionalCoins.toLocaleString()}* coins for rolling a ${diceValue}!` : '';
    const multiplierMessage = multiplier > 1 ? `Multiplier: *${multiplier}*` : '';

    const msg = `${coinMessage}\n${expMessage}\n${additionalCoinsMessage}\n${multiplierMessage}`;

    // Send the response message
    await conn.reply(m.chat, msg, m, {
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: "🎲 Roll the dice!",
          thumbnail: await (await conn.getFile(diceImage)).data,
        },
      },
   
