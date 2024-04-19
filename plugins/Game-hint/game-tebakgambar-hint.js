const {
    delay
} = require('../util/delay')

const MAX_ATTEMPTS = 5

let handler = async (m, {
    conn
}) => {
    conn.tebakingambar = conn.tebakingambar || {}
    const id = m.chat
    if (!conn.tebakingambar[id]) {
        conn.tebakingambar[id] = [null, null]
    }
    const data = conn.tebakingambar[id]
    if (data[0] === null || data[0] === false) {
        return conn.reply(m.chat, 'Belum ada tebakan gambar yang diproses!', m)
    }
    if (data[1] === null) {
        return conn.reply(m.chat, 'Belum ada jawaban dari gambar yang dipilih!', m)
    }
    if (m.quoted && m.quoted.sender === botNumber) {
        const response = m.quoted.text || m.quoted.caption || ''
        if (response.toLowerCase() === 'skip') {
            data[0] = false
            delete conn.tebakingambar[id]
            return conn.reply(m.chat, 'Alright, tebakan gambar ini dibatalkan!', m)
        }
    }
    const attempts = data[2] || 0
    if (attempts >= MAX_ATTEMPTS) {
        return conn.reply(m.chat, `Maaf, kamu telah gagal ${MAX_ATTEMPTS} kali. Jawaban yang benar adalah: \n\n${data[1].jawaban}\n\nSilakan coba lagi dengan perintah ulangan!`, m)
    }
    if (m.text.toLowerCase() === data[1].jawaban.replace(/[AIUEOaiueo]/ig, '_')) {
        data[0] = true
        delete conn.te
