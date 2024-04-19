const {
    clockString,
    pickRandom
} = require('./helpers')

let handler = async (m, {
    conn,
    text,
    args,
    command
}) => {
    let duel = conn.duel || []
    let opponent

    if (args.length > 0) {
        opponent = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : text.match(/\@(\d{0,16})/g)[0] ? text.match(/\@(\d{0,16})/g)[0].replace(/@/g, '') : ''
        if (!opponent) return m.reply('Tag salah satu musuh yang ingin duel!')
        if (duel.includes(opponent)) return m.reply('Musuh sudah ada dalam daftar duel!')
        duel.push(opponent)
    } else {
        opponent = duel[0]
    }

    let user = global.db.data.users[m.sender]
    let enemy = global.db.data.users[opponent]

    if (!opponent) return m.reply('Belum ada musuh yang ditag!')
    if (!enemy) return m.reply('Musuh tidak ditemukan!')

    let count = parseInt(args[1]) || 1
    count = Math.min(100, Math.max(count, 1))

    let nama = await conn.getName(m.sender)

    let randomAku = Math.floor(Math.random() * 101)
    let randomKamu = Math.floor(Math.random() * 81)
    let Aku = randomAku
    let Kamu = randomKamu

    let lastDuel = new Date - user.lastduel
    let timer = 300000 - lastDuel
    timer = clockString(timer)

    try {
        if (/duel/.test(command)) {
            if (!opponent) return m.reply('Tag salah satu musuh yang ingin duel!')
            let teks = `@${m.sender.replace(/@.+/, '')} Mengajak duel ${opponent}\n\nPilih Y Atau No`
            let mentionedJid = [m.sender]
            if (lastDuel < 300000) {
                return conn.reply(m.chat, `Kamu Sudah Berduel Tunggu hingga ${timer}`, m)
            } else {
                conn.reply(m.chat, teks, m, {
                    mentions: conn.parseMention(mentionedJid)
                })
            }
        }

        if (/dya|yes/.test(command)) {
            if (!duel.includes(opponent)) return m.reply('Belum ada musuh yang ditag!')
            user.lastduel = new Date * 1
            if (Aku > Kamu) {
                user.money -= 900
                enemy.money += 900
                delete conn.duel[opponent]
                conn.reply(m.chat, `@${opponent} Menang Gelud🤼\n*Hadiah:*\n900 Money buat beli gorengan`.trim(), m)
            } else if (Aku < Kamu) {
                user.money += 450
                enemy.money -= 450
                delete conn.duel[opponent]
                conn.reply(m.chat, `@${opponent} Kalah Gelud🤼\n*Hadiah:*\n 450 money Mayan buat beli Limit`.trim(), m)
            } else {
                user.money += 250
                enemy.money += 250
                delete conn.duel[opponent]
                conn.reply(m.chat, `@${opponent}\n *Seri*\n masing masing 250 Money`.trim(), m)
            }
        }
        if (/dno|no/.test(command)) {
            let kenal = !duel.includes(m.sender)
            if (kenal) return conn.reply(m.chat, `Lu siapa?\nkok ikut kut mau duel`, m)
            conn.reply(m.chat, `@${opponent} Membatalkan Ajakan Duel`, m)
            delete conn.duel[opponent]
        }
    } catch (e) {
        return m.reply(`${e}`)
    }
}

handler.help = ['duel @tag']
handler.tags = ['rpg']
handler.command = /^(duel|yes|no|y|n)$/i
handler.group = true

module.exports = handler
