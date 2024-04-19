import {
    areJidsSameUser
} from '@whiskeysockets/baileys'

let handler = async (m, {
    conn,
    text,
    participants,
    groupMetadata,
    quoted
}) => {
    let user = '';
    if (text) {
        if (text.includes('@')) {
            user = text.split('@')[0] + '@s.whatsapp.net';
        } else {
            user = text;
        }
    } else if (quoted && quoted.sender) {
        user = quoted.sender;
    } else if (m.mentionedJid && m.mentionedJid[0]) {
        user = m.mentionedJid[0] + '@s.whatsapp.net';
    }

    if (!user) {
        return conn.reply(m.chat, `Berikan nomor, tag atau balas pesan target.`, m);
    }

    if (user.length > 15) {
        return conn.reply(m.chat, `Format salah!`, m);
    }

    try {
        let users = m.isGroup ? participants.find(v => areJidsSameUser(v.jid == user)) : {};
        if (!users) {
            return conn.reply(m.chat, `Target atau Nomor tidak ditemukan, mungkin sudah keluar atau bukan anggota grup ini.`, m);
        }
        if (user === m.sender) {
            return conn.reply(m.chat, `Tidak bisa berpacaran dengan diri sendiri!`, m);
        }
        if (user === conn.user.jid) {
            return conn.reply(m.chat, `Tidak bisa berpacaran dengan saya t_t`, m);
        }

        if (global.db.data.users[user].pasangan != m.sender) {
            return conn.reply(m.chat, `Maaf @${user.split('@')[0]} tidak sedang menembak anda`, m, {
                contextInfo: {
                    mentionedJid: [user]
                }
            });
        } else {
            global.db.data.users[m.sender].pasangan = user;
            return conn.reply(m.chat, `Selamat anda resmi berpacaran dengan @${user.split('@')[0]}\n\nSemoga langgeng dan bahagia selalu @${user.split('@')[0]} 💓 @${m.sender.split('@')[0]} 🥳🥳🥳`, m, {
                contextInfo: {
                    mentionedJid: [user, m.sender]
                }
            });
        }
    } catch (e) {
        console.error(e);
        return conn.reply(m.chat, `Maaf, terjadi kesalahan.`, m);
    }
}

handler.help = ['terima *@tag*']
handler.tags = ['jadian']
handler.command = /^(terima)$/i
handler.group = true
handler.limit = false
handler.fail = null

export default handler
