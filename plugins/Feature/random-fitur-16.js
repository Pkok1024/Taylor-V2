import fetch from 'node-fetch'
import { getRandom } from 'flaaa'

const baseURL = 'https://cataas.com'
const baseURLMuseum = 'https://collectionapi.metmuseum.org/public/collection/v1'

const handler = async (m, { conn, usedPrefix, text, args, command }) => {
  if (command === 'cts') {
    const imgr = getRandom()
    const list =
      'cat\ntag\ngif\nsay\tsay\tsay\tsay\ntype\nwidth\ngif\n'
    const caption = `*MASUKKAN TEKS:*\nContoh:\n${usedPrefix + command} ${list}\n\n*List:*\n${htjava} cat\n${htjava} tag\n${htjava} gif\n${htjava} say\n${htjava} tsay\n${htjava} csay\n${htjava} gsay\n${htjava} width\n${htjava} type\n`

    if (!args[0]) return conn.sendFile(m.chat, imgr + command, '', caption, m)

    const methods = {
      cat: () => `${baseURL}/cat`,
      tag: (tag) => `${baseURL}/cat/${tag}`,
      gif: () => `${baseURL}/cat/gif`,
      say: (text) => `${baseURL}/cat/says/${text}`,
      tsay: (text, color, size) => `${baseURL}/cat/${color}/says/${text}?size=${size}`,
      csay: (text, size, color) => `${baseURL}/cat/says/${text}?size=${size}&color=${color}`,
      type: (type) => `${baseURL}/cat?type=${type}`,
      width: (width) => `${baseURL}/cat?width=${width}`,
      gsay: (text) => `${baseURL}/cat/gif/says/${text}?filter=sepia&color=orange&size=40&type=or`,
    }

    const method = methods[args[0]]
    if (!method) return m.reply(`Example: ${usedPrefix + command} ${Object.keys(methods).join('|')}`)

    try {
      const res = await fetch(method(...args.slice(1)))
      const data = await res.buffer()
      await conn.sendFile(m.chat, data, '', `*Result:*`, m)
    } catch (err) {
      m.reply(`Error: ${err.message}`)
    }
  }

  if (command === 'museum') {
    if (!args[0]) {
      const caption = `*MASUKKAN TEKS:*\nContoh:\n${usedPrefix + command} q |Contoh\n\n*List:*\n${htjava} high\n${htjava} id\n${htjava} q\n${htjava} onview\n${htjava} aoc\n${htjava} med\n${htjava} img\n${htjava} loc\n${htjava} time\n`
      return conn.sendFile(m.chat, imgr + command, '', caption, m)
    }

    const museumMethods = {
      high: (query) => `${baseURLMuseum}/search?isHighlight=true&q=${query}`,
      id: (id) => `${baseURLMuseum}/objects/${id}`,
      q: (query) => `${baseURLMuseum}/search?q=${query}`,
      onview: (query) => `${baseURLMuseum}/search?isOnView=true&q=${query}`,
      aoc: (query) => `${baseURLMuseum}/search?artistOrCulture=true&q=${query}`,
      med: (medium, query) => `${baseURLMuseum}/search?medium=${medium}&q=${query}`,
      img: (query) => `${baseURLMuseum}/search?hasImages=true&q=${query}`,
      loc: (location, query) => `${baseURLMuseum}/search?geoLocation=${location}&q=${query}`,
      time: (start, end, query) => `${baseURLMuseum}/search?dateBegin=${start}&dateEnd=${end}&q=${query}`,
    }

    const museumMethod = museumMethods[args[0]]
    if (!museumMethod) return m.reply(`Example: ${usedPrefix + command} ${Object.keys(museumMethods).join('|')}`)

    try {
      const res = await fetch(museumMethod(...args.slice(1)))
      const data = await res.json()
      const ids = Array.from(data.objectIDs)
      const caption = `*Result:*\n*Total:* ${data.total}\n*ID:* ${ids.join(', ')}`
      await conn.sendFile(m.chat, imgr + command, '', caption, m)
    } catch (err) {
      m.reply(`Error: ${err.message}`)
    }
  }
}

handler.command = handler.help = ['cts', 'museum']
handler.tags = ['internet']

export default handler
