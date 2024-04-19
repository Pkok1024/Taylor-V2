const {
    List,
    SenderKeyDistributionMessage
} = require('whatsapp-web.js');

const {
    getRandom
} = require('../lib/utils');

const handlers = {
    kerang: {
        help: 'kerang <teks>',
        tags: ['kerang', 'fun'],
        command: /^(kulit)?kerang(ajaib)?$/i,
        handler: async (m, {
            text,
            command,
            usedPrefix
        }) => {
            if (!text) throw `Use example ${usedPrefix}${command} i'm alien?`;

            const answers = [
                'Mungkin suatu hari',
                'Tidak juga',
                'Tidak keduanya',
                'Kurasa tidak',
                'Ya',
                'Coba tanya lagi',
                'Tidak ada'
            ];

            m.reply(`"${getRandom(answers, true)}"`, {
                quoted: m
            });
        }
    }
};

module.exports = List.ofMap(handlers);


const getRandom = (arr, single) => {
    const randomIndex = Math.floor
