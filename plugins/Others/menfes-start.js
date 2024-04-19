import fetch from 'node-fetch'

// Define the handler function for the command
const handler = async (m, {
    conn, // WhatsApp connection object
    text, // The text message sent by the user
    usedPrefix, // The prefix used to call the command
    command, // The name of the command
    args // The arguments passed to the command
}) => {
    // Check if the user provided a mention or a number as an argument
    if (!args[0]) throw 'Gunakan format .menfes 6282195322106 Haloo'
    if (args[0].startsWith('0')) throw 'Gunakan format .menfes 6282195322106 Haloo'
    let mention = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : args[0] ? (args[0].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : ''
    let txt = (args.length > 1 ? args.slice(1).join(' ') : '') || '' // Extract the message text from the arguments
    let q = m.quoted ? m.quoted : m // Get the quoted message object
    let mime = (q.msg || q).mimetype || '' // Get the mimetype of the quoted message
    let tujuan = `👋 Saya *${conn.user.name}*, Pesan Untuk Kamu
👥 Dari : *PENGIRIM RAHASIA*

${htki} 💌 Pesan ${htka}
${txt}
` // Create the message to be sent to the recipient
    let cap = `${htki} PESAN RAHASIA ${htka}
Anda Ingin Mengirimkan Pesan ke pacar/sahabat/teman/doi/
mantan?, tapi Tidak ingin tau siapa Pengirimnya?
Kamu bisa menggunakan Bot ini
Contoh Penggunaan: ${usedPrefix + command} ${nomorown} pesan untuknya

Contoh: ${usedPrefix + command} ${nomorown} hai` // Create the message to be sent as a command description
    // Check if the message is quoted or not
    if (!m.quoted) {
        await conn.reply(mention, tujuan + '\n' + cap, m) // If not quoted, send the message and the command description
    } else {
        await conn.reply(mention, tujuan + '\n' + cap, m) // If quoted, send the message and the command description
        let media = q ? await
