import fetch from 'node-fetch'

// This function is called before a message is processed
export async function before(m) {
    let id = m.chat // The ID of the chat where the message was sent
    let imgr = flaaa.getRandom() // Get a random image from the flaaa module

    // Initialize the skata object if it doesn't exist
    this.skata = this.skata ? this.skata : {}

    // Check if the message contains the word "nyerah" and if the chat ID is in the skata object
    if (/nyerah/i.test(m.text) && (id in this.skata)) {
        // If so, delete the chat ID from the skata object and reply with "Mulai lagi?"
        delete conn.skata[id]
        return this.reply(m.chat, `Mulai lagi?`, m)
    }

    // Check if the message is a reply to a previous message and if the previous message was sent by the bot
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/(Mulai|Lanjut) :/i.test(m.quoted.text)) return !0

    // Check if the chat ID is in the skata object
    if (!(id in this.skata)) return this.reply(m.chat, `Mulai lagi?`, m)

    // Check if the ID of the quoted message matches the first message in the skata array for this chat ID
    if (m.quoted.id == this.skata[id][0].id) {
        let answerF = (m.text.toLowerCase().split` ` [0]).trim() // Extract the first word of the message and convert it to lowercase

        // Make a request to the sambungkata API and parse the response as JSON
        let res = await fetch('https://api.lolhuman.xyz/api/sambungkata?apikey=' + global.lolkey + '&text=' + m.text.toLowerCase())
        let json = await res.json()

        // Check if the first word of the message does not start with the last character of the previous answer
        if (!answerF.startsWith(this.skata[id][1].slice(-1))) {
            return this.reply(m.chat, `👎🏻 *Salah!*\nJawaban harus dimulai dari kata *${(this.skata[id][1].slice(-1)).toUpperCase()}*`, m)
        }
        // Check if the response from the API indicates that the word is not valid
        else if (!json.status) {
            return this.reply(m.chat, `👎🏻 *Salah!*\nKata *${m.text.toUpperCase()}* tidak valid!`, m)
        }
        // Check if the first word of the message is the same as the previous answer
        else if (this.skata[id][1] == answerF) {
            return this.reply(m.chat, `👎🏻
