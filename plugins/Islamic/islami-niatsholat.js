import fetch from 'node-fetch'

const handler = async (m, { usedPrefix, command }) => {
  try {
    const res = await fetch('https://raw.githubusercontent.com/hamidamaulana/bacaan-sholat-main/main/assets/data/niatshalat.json')
    const json = await res.json()
    let niat = 'Niat Shalat:\n\n'
    json.forEach((v, i) => {
      niat += `${i + 1}. ${v.name}\n↳ ${v.arabic}\n↳ ${v.latin}\n↳ ${v.terjemahan}\n\n`
    })
    m.reply(niat)
  } catch (e) {
    m.reply(`_*Error!*_ ${e.message}`)
  }
}

handler.help = ['niatshalat']
handler.tags = ['islam']
handler.command = /^(niatsh?(a|o)lat)$/i

export default handler
