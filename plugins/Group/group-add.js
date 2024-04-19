import fetch from 'node-fetch'
import {
    getBinaryNodeChild,
    getBinaryNodeChildren
} from '@whiskeysockets/baileys'

const handler = async (m, {
    conn,
    text,
    participants,
    usedPrefix,
    command
}) => {
    try {
        console.log('Adding participants...')
        const _participants = participants.map(user => user.jid)
        const users = (await Promise.all(
            text.split(',')
            .map(v => v.replace(/[^0-9]/g, ''))
            .filter(v => v.length > 4 && v.length < 20 && !_participants.includes(v + '@s.whatsapp.net'))
            .map(async v => [
                v,
                await conn.onWhatsApp(v + '@s.whatsapp.net')
                    .catch(err => console.log(`Error adding participant ${v}:`, err))
            ])
        )).filter(v => v[1])
        console.log(`Added ${users.length} participants.`)

        const response = await conn.query({
            tag: 'iq',
            attrs: {
                type: 'set',
                xmlns: 'w:g2',
                to: m.chat,
            },
            content: users.map(jid => ({
                tag: 'add',
                attrs: {},
                content: [{
                    tag: 'participant',
                    attrs: {
                        jid
                    }
                }]
            }))
        })

        console.log('Fetching profile picture...')
        const pp = await conn.profilePictureUrl(m.chat)
            .catch(err => console.log('Error fetching profile picture:', err))
        console.log('Profile picture fetched.')

        const jpegThumbnail = pp ? await (await fetch(pp))
            .arrayBuffer() : Buffer.alloc(0)

        const add = getBinaryNodeChild(response, 'add')
        const participant = getBinaryNodeChildren(add, 'participant')

        console.log('Checking for errors...')
        for (const user of participant.filter(item => item.attrs.error == 403)) {
            const content = getBinaryNodeChild(user, 'add_request')
            const invite_code = content.attrs.code
            const invite_code_exp = content.attrs.expiration
            let teks = `Gak bisa cok!`
            m.reply(teks, null, {
                mentions: await conn.parseMention(teks)
            })
        }
        console.log('Errors checked.')
    } catch (e) {
        console.log('Error:', e)
        throw m.reply('Gak bisa cok!')
    }
}

handler.help = ['add', '+'].map(v => v + ' nomor')
handler.tags = ['group']
handler.command = /^(add|menambahkan|\+)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.fail = null

export default handler
