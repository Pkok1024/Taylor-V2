const {
    MessageType
} = require('@adiwajshing/baileys')

let handler = async (m, {
    conn,
    text,
    usedPrefix
}) => {
    if (!text) return conn.reply(m.chat, 'Contoh penggunaan:\n' + usedPrefix + 'assalamualaikum\n' + usedPrefix + 'salam', m)

    let caption = `*Waalaikummussalam warahmatullahi wabarokatuh*\n\n_📚 Baca yang dibawah ya!_ "Orang yang mengucapkan salam seperti ini maka ia mendapatkan 30 pahala, kemudian, orang yang dihadapan atau mendengarnya membalas dengan kalimat yang sama yaitu “Wa'alaikum salam warahmatullahi wabarakatuh” atau ditambah dengan yang lain (waridhwaana). Artinya selain daripada do'a selamat juga meminta pada Allah SWT."`

    conn.reply(m.chat, caption, m, MessageType.text)
}

handler.customPrefix = /^(assalam(ualaikum)?|(salamualaiku|(sa(lamu|m)liku|sala))m)$/i
handler.command = new RegExp

module.exports = handler
