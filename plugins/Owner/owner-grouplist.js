const handler = async (m, { conn }) => {
  let txt = ''
  const groups = Object.entries(conn.chats)
    .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats)
    .map(([jid, chat]) => {
      const groupName = conn.getName(jid)
      const status = chat?.metadata?.read_only ? 'Left' : 'Joined'
      return `${groupName}\n🪪${jid} [${status}]\n`
    })
  txt = groups.join('')
  m.reply(`List Groups:\n${txt}`.trim())
}
handler.help = ['groups', 'grouplist']
handler.tags = ['owner']
handler.command = /^(group(s|list))$/i

module.exports = handler
