const handler = async (m, { conn, usedPrefix, isAdmin, isOwner }) => {
  if (m.isGroup) {
    if (!(isAdmin && isOwner)) return conn.reply(m.chat, 'You must be an admin and owner to use this command!', m)
  }

  const id = m.chat
  const { vote } = conn

  if (!vote || !vote[id]) return conn.reply(m.chat, 'There is no voting in this chat!', m)

  delete vote[id]
  m.reply('Successfully deleted the vote!')
}

handler.help = ['deletevote']
handler.tags = ['vote']
handler.command = /^(delete|hapus|-)vote$/i

module.exports = handler
