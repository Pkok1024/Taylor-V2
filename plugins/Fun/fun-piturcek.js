import fetch from 'node-fetch'
import fs from "fs"

// Handler function for the 'cek' command
const handler = async (m, {
    conn, // Connection object for the WhatsApp bot
    args, // Command arguments
    text, // Command text
    usedPrefix, // Prefix used to call the command
    command // Command name
}) => {

    // Determine the template based on the first command argument
    const template = (args[0] || '').toLowerCase()

    // If no template is provided, send a usage example and list of commands
    if (!args[0]) {
        const caption = `*Contoh Penggunaan*

${usedPrefix + command} tai @user

*List Command*
• anjing
• asu
• babi
• bajingan
• banci
• bangsat
• bego
• bejad
• bencong
• bolot
• brengsek
• budek
• buta
• geblek
• gembel
• gila
• goblok
• iblis
• idiot
• jablay
• jelek
• kampret
• kampungan
• kamseupay
• keparat
• kontol
• kunyuk
• maho
• memek
• monyet
• ngentot
• pecun
• perek
• sarap
• setan
• sinting
• sompret
• tai
• tolol
• udik
`
        await conn.reply(m.chat, caption, m, {
            mentions: await conn.parseMention(caption)
        })
    }

    // If a command is provided, check if it matches any of the supported templates
    if (command) {
        switch (template) {

            // Case-insensitive matching for supported templates
            case 'anjing':
            case 'asu':
            case 'babi':
            case 'bajingan':
            case 'banci':
            case 'bangsat':
            case 'bego':
            case 'bejad':
            case 'bencong':
            case 'bolot':
            case 'brengsek':
            case 'budek':
            case 'buta':
            case 'geblek':
            case 'gembel':
            case 'gila':
            case 'goblok':
            case 'iblis':
            case 'idiot':
            case 'jablay':
            case 'jelek':
            case 'kampret':
            case 'kampungan':
            case 'kamseupay':
            case 'keparat':
            case 'kontol':
            case 'kunyuk':
            case 'maho':
            case 'memek':
            case 'monyet':
            case 'ngentot':
            case 'pecun':
            case 'perek':
            case 'sarap':
            case 'setan':
            case 'sinting':
            case 'sompret':
            case 'tai':
            case 'tolol':
            case 'udik':

                // Get the user ID to be checked
                const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender

                // Fetch the user's profile picture
                const pp = await conn.profilePictureUrl(who).catch(_ => hwaifu.getRandom())

                // Fetch the user's name
                const name = await conn.getName(who)

                // Generate a random number for the similarity percentage
                const sim = Math.floor(Math.random() * 101)

                // Construct the response message
                const caption = `Tingkat ke *${args[0]}an* \nAtas nama ${name ? args[1] : '*Semua Member*'} ${'@' + who.split("@")[0] ? args[1] : '*Semua Member*'} \nAdalah Sebesar *${sim}%*`

                // Send the response message
                await conn.reply(m.chat, caption, m, {
                    mentions: await conn.parseMention(caption)
                })
                break
        }
    }
}

// Set the command's help, tags, and name
handler
