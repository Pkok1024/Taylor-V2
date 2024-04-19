import axios from 'axios'
import fetch from 'node-fetch'
import {
    readFileSync
} from 'fs'

const handler = async (m, {
    conn,
    args,
    text,
    usedPrefix,
    command
}) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let name = await conn.getName(who)
    let imgr = flaaa.getRandom()

    let urut = text.split`|`
    let one = urut[1]
    let two = urut[2]
    let three = urut[3]

    let template = (args[0] || '').toLowerCase()
    if (!args[0]) {
        let caption = `*Contoh Penggunaan*

${usedPrefix + command} advanceglow
${usedPrefix + command} ahegao
${usedPrefix + command} alquran
${usedPrefix + command} alquranaudio
...
${usedPrefix + command} yuri
${usedPrefix + command} ytmp3
${usedPrefix + command} ytmp4
${usedPrefix + command} ytplay
${usedPrefix + command} ytsearch
`
        await conn.reply(m.chat, caption, m)
    }

    try {
        if (command) {
            switch (template) {
                // Islami //
                case 'listsurah':
                    axios
                        .get(`https://api.lolhuman.xyz/api/quran?apikey=${global.lolkey}`)
                        .then(({
                            data
                        }) => {
                            var teks = 'List Surah:\n'
                            for (var x in data.result) {
                                teks += `${x}. ${data.result[x]}\n`
                            }
                            conn.reply(m.chat, teks, m)
                        })
                        .catch(console.error)
                    break
                // Add more cases here for other commands
            }
        }
    } catch (e) {
        console.error(e)
        await conn.reply(m.chat, 'An error occurred. Please try again later.', m)
    }
}

handler.help = ['lolmenu <command> <teks>']
handler.tags = ['tools']
handler.command = /^lol|lolmenu$/i
export default handler
