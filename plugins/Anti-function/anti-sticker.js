export async function before(m, {
    isAdmin,
    isBotAdmin,
    participants
}) {
    if (m.isBaileys || m.mtype !== "stickerMessage" || !global.db.data.chats[m.chat].antiSticker) return;

    const user = global.db.data.users[m.sender];
    user.warn = (user.warn || 0) + 1;
    user.banned = true;

    m.reply('⚠️ *Stiker Terdeteksi!* ⚠️\nKamu telah mengirimkan stiker yang tidak diizinkan.');

    if (isAdmin || isBotAdmin) {
        const deleteMessage = {
            delete: {
                remoteJid: m.key.remoteJid,
                fromMe: false,
                id: m.key.id,
                participant: [m.sender]
            }
        };

        const targetParticipant = participants.find(participant => participant.id === m.sender);
        if (targetParticipant) {
            m.reply(isAdmin ? '❌ *Kamu tidak diizinkan mengirim stiker.*' : '❌ *Stiker terdeteksi dan dihapus.*');
            await this.sendMessage(m.chat, deleteMessage);
        }
    }
}
