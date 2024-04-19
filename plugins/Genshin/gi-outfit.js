import genshindb from 'genshin-db'

const handler = async (m, { conn, text, usedPrefix, limit }) => {
  if (!text) throw `Example : ${usedPrefix}gioutfit outrider`

  const checkProperty = (obj, props) => props.every(prop => obj.hasOwnProperty(prop))

  try {
    const anu = await genshindb.outfits(text)
    if (!checkProperty(anu, ['name', 'description', 'character', 'url'])) throw new Error()

    const ini_txt = `*Found : ${anu.name}*\n\n_"${anu.description}"_\n\n*Character :* ${anu.character}`
    ini_txt += anu.url.modelviewer ? `\n_${anu.url.modelviewer}_` : ''
    m.reply(ini_txt)
  } catch (e) {
    console.log(e)
    try {
      const anu2 = await genshindb.outfits(text, { matchCategories: true })
      if (Array.isArray(anu2) && anu2.length > 0) {
        m.reply(`*List ${text} outfit :*\n\n- ${anu2.toString().replaceAll
