import { tebakgambar } from '@bochilteam/scraper' // Importing the tebakgambar function from the scraper module
import { webp2png } from '../../lib/webp2mp4.js' // Importing the webp2png function from the webp2mp4 module

let timeout = 120000 // Timeout duration in milliseconds
let poin = 4999 // Bonus XP points

// Handler function for the tebakgambar command
const handler = async (m, { conn, command, usedPrefix }) => {
    // Check if the chat ID is already in the tebakingambar object
    conn.tebakingambar = conn.tebakingambar ? conn.tebakingambar : {}
    let id = m.chat
    if (id in conn.tebakingambar) {
        // If there is an ongoing game in the chat, send a message and throw an error to stop the current command execution
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakingambar[id][0])
        throw false
    }

    // Fetch a new question using the tebakgambar function
    const json = await tebakgambar()

    // Generate the caption for the question with the command, timeout, and bonus XP points
    const caption = `*${command.toUpperCase()}*
Rangkailah Gambar Ini
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hgam untuk bantuan
Bonus: ${poin} XP
    `.trim()

    // Fetch the image URL and convert it to a png format using the webp2png function
    const imgurl = await imageUrl(json.img)

    // Store the question details, message object, and timeout in the tebakingambar object
    conn.tebakingambar[id] = [
        await conn.sendFile(m.chat, imgurl, '', caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebakingambar[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakingambar[id][0])
            delete conn.tebakingambar[id]
        }, timeout)
    ]
}

// Command information for the handler function
handler.help = ['tebakg
