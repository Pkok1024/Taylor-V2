import fs from 'fs'
import fetch from 'node-fetch'
import { delay } from 'wreckingball-util'

let handler = async (m, { conn, args }) => {
  if (!conn.user.jid.endsWith('@s.whatsapp.net')) {
    await m.reply('This command can only be used by a WhatsApp Business account.')
    return
  }

  let groups = Object.entries(conn.chats).filter(([jid, chat]) =>
    jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce
  ).map(v => v[0])

  if (groups.length === 0) {
    await m.reply('No groups found.')
    return
  }

  let imgr = (await fetch('https://api.lolhuman.xyz/api/random/apikey')).buffer()
  let text
  if (args.length >= 1) {
    text = args.slice(0).join(" ")
  } else if (m.quoted && m.quoted.text) {
    text = m.quoted.text
  } else throw "Input Teks"

  for (let id of groups) {
    let member = (await conn.groupMetadata(id)).participants.map(v => v.jid)
    if (!member.includes(conn.user.jid)) continue
    if (!conn.isAdmin(id)) continue

    await conn.sendFile(m.chat, imgr, '', htki + ' *BROADCAST* ' + htka + '\n\n*Pesan:*\n
