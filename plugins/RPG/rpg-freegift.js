const {
    List,
    Sender,
    Replier,
    Utils: {
        shuffleArray,
        getRandomInt,
        formatTimeDifference
    }
} = require('whatsapp-web.js');

const {
    getUser,
    updateUser,
    getFreegiftCodes,
    useFreegiftCode,
    getCooldownDuration
} = require('../database');

const {
    getRandomRewards
} = require('../helpers');

module.exports = async (client, message) => {
    const user = await getUser(Sender.getId(message));
    const lastGiftTime = user.last_gift || 0;
    const currentTime = new Date().getTime();
    const cooldownDuration = getCooldownDuration();

    if (currentTime - lastGiftTime < cooldownDuration) {
        const remainingCooldown = cooldownDuration - (currentTime - lastGiftTime);
        return Replier.reply(message, `⏰ Maaf, kamu harus menunggu ${formatTimeDifference(remainingCooldown)} lagi sebelum menggunakan FreeGift lagi!`);
    }

    const today = new Date().toLocaleDateString();
    const freegiftCodes = await getFreegiftCodes(Sender.getId(message));

    const args = message.body.slice(client.prefix.length).trim().split(/ +/);
    const code = args[0];

    if (!code) return Replier.reply(message, `❓ Kamu belum memasukkan Kode FreeGiftmu!\n\nContoh: *${client.prefix}freegift code*`);

    const validGiftcode = freegiftCodes.filter(freegiftCode => freegiftCode.code === code && freegiftCode.used === false && freegiftCode.date === today);

    if (!validGiftcode.length) {
        const remainingTime = formatTimeDifference(cooldownDuration);
        return Replier.reply(message, `Maaf, kode FreeGift tidak valid atau sudah digunakan. Silahkan coba lagi setelah ${remainingTime}!`);
    }

    const maxExp = 10000,
        maxMoney = 10000;
    const rewards = shuffleArray([{
        text: '💠 XP',
        value: getRandomInt(maxExp)
    }, {
        text: '🎫 Limit',
        value: getRandomInt(5) + 1
    }, {
        text: '💹 Money',
        value: getRandomInt(maxMoney)
    }, {
        text: '🥤 Potion',
        value: getRandomInt(5) + 1
    }]);

    const listMessage = new List('🎉 SELAMAT!', `Kamu telah mendapatkan:\n${rewards.map(r => `${r.text}: ${r.value}`).join('\n')}`, rewards.map(r => `${r.text}: ${r.value}`));
    await Replier.reply(message, listMessage, {
        quotedMessage: message.quotedMessage
    });

    user.exp += rewards.find(r => r.text === '💠 XP').value;
    user.limit += rewards.find(r => r.text === '🎫 Limit').value;
    user.money += rewards.find(r => r.text === '💹 Money').value;
    user.potion += rewards.find(r => r.text === '🥤 Potion').value;

    await useFreegiftCode(Sender.getId(message), code);
    await updateUser(user);

    user.last_gift = currentTime;
    setTimeout(async () => {
        const cooldownMessage = '⏰ Waktunya menggunakan FreeGift lagi!\nKetik ' + client.prefix + 'freegift untuk mendapatkan hadiah spesial.';
        await Replier.reply(message.chat, cooldownMessage, {
            quotedMessage: message
        });
    }, cooldownDuration);
};

module.exports.help = ['freegift <kode>'];
module.exports.tags = ['rpg'];
module.exports.command = /^freegift$/i;
