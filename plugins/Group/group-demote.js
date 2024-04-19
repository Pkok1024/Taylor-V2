import {
    areJidsSameUser
} from '@whiskeysockets/baileys'

let handler = async (m, {
    conn,
    participants,
    isAdmin,
    isBotAdmin
}) => {
    if (!isBotAdmin) return m.reply('I am not a admin, please promote me first')
    if (!isAdmin) return m.reply('You are not an admin')
    
    let users = m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id) && participants.includes(u))
    if (users.includes(conn.user.id)) return m.reply('I can\'t demote myself')
    if (users.length == 0) return m.reply('Mention someone to demote')
    
    try {
        await conn.groupParticipantsUpdate(m.chat, users, 'demote')
        m.reply('Success')
    } catch (e) {
        m.reply('Error: ' + e)
    }
}

handler.help = ['demote @tag']
handler.tags = ['group']
handler.command = /^(demote)$/i

export default handler
