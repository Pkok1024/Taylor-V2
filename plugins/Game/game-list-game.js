import {
    readFileSync
} from 'fs'

const htki = '⭔',
    htka = '⭔',
    htjava = '�� Java �� WhatsApp',
    emojis = '🎲';

const createRow = (title, rowId, desc) => ({
    title: `${emojis} ${title}`.toUpperCase(),
    rowId,
    description: desc
});

const handler = async (m, {
    conn,
    command,
    args,
    usedPrefix
}) => {
    const ktnya = ['\n\n\n' + htjava + ' Mungkin menu ini bermanfaat? ' + htjava,
        '\n\n\n' + htjava + ' Terimakasih sudah menggunakan bot ini ' + htjava,
        '\n\n\n' + htjava + ' Semoga gak erorr ' + htjava,
        '\n\n\n' + htjava + ' Jika lama kemungkiman erorr atau delay ' + htjava,
        '\n\n\n' + htjava + ' Menampilkan menu ' + htjava,
        '\n\n\n' + htjava + ' Wait... ' + htjava,
        '\n\n\n' + htjava + ' Dua tiga kucing berlari ' + htjava,
        '\n\n\n' + htjava + ' Bentar bang akan kutampilkan menunya ' + htjava,
        '\n\n\n' + htjava + ' Prosess... ' + htjava
    ];

    const rowsRPG = ['adventure', 'bansos', 'buy', 'berburu', 'berdagang', 'berkebon', 'bet', 'build', 'casino', 'cek', 'chop', 'collect', 'cook', 'cooldown', 'craft', 'daily', 'duel', 'dungeon', 'eat', 'feed', 'heal', 'hourly', 'hunt', 'inventory', 'kandang', 'kerja', 'koboy', 'kolam', 'leaderboard', 'mancing', 'mentransfer', 'merampok', 'mining', 'mission', 'monthly', 'nabung', 'nambang', 'nebang', 'ngocok', 'nguli', 'ojek', 'opencrate', 'open', 'pasar', 'petstore', 'pointxp', 'profile', 'ramuan', 'repair', 'rob', 'roket', 'sell', 'shopfish', 'shop', 'slect-skill', 'slot', 'tarik', 'taxy', 'toko', 'transfer', 'upgrade', 'use', 'weekly', 'work']
        .map(v => createRow(v, `${usedPrefix}${v}`, ktnya.getRandom()));

    const rowsNonRPG = ['asahotak', 'caklontong', 'family100', 'fight', 'gombal', 'math', 'siapakahaku', 'slot', 'suitpvp', 'susunkata', 'tebakan', 'tebakanime', 'tebakbendera', 'tebakchara', 'tebakgambar', 'tebakjenaka', 'tebakkabupaten', 'tebakkalimat', 'tebakkata', 'tebakkimia', 'tebaklagu', 'tebaklirik', 'tebaklogo', 'tebaksiapa', 'tebakumur', 'tekateki', 'tictactoe']
        .map(v => createRow(v, `${usedPrefix}${v}`, ktnya.getRandom()));

    const sections = [
        {
            title: `${htki} RPG GAME ${htka}`,
            rows: rowsRPG
        },
        {
            title: `${htki} Non-RPG GAME ${htka}`,
            rows: rowsNonRPG
        }
    ];

    if (!sections.length) return;

    const tek = `*Hai ${conn.getName(m.sender)}* 👋\nSilahkan Pilih Game Disini`;

    const listMessage = {
        text: tek,
        footer: '📮 *Note:* Jika menemukan bug, error atau kesulitan dalam penggunaan silahkan laporkan/tanyakan kepada Owner',
        mentions: await conn.parseMention(tek)?.map(m => m) || [],
        title: `${htki} *LIST MENU* ${htka}`,
        buttonText: `CLICK HERE ⎙`,
        sections
    }
    return conn.sendMessage(m.chat, listMessage, {
        quoted: m
    })
}

handler.help = ['game']
handler.tags = ['rpg']
handler.command = /^gam(es|ing|e)$/i

export default handler
