import axios from 'axios'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Usage: ${usedPrefix}${command} username/ngl_link | message`

  const [user, msg] = text.split`|`
  if (!user || !msg) throw `Usage: ${usedPrefix}${command} username/ngl_link | message`

  const link = /^(http|https):\/\/ngl.link/gi.test(user)
    ? user
    : `https://ngl.link/${user}`

  try {
    const data = await cekUser(link)
    if (!data) throw new Error('User not found or invalid URL')

    await sendNgl(link, msg)
    await m.reply(`Successfully sent ngl to "${user}"\nMessage: "${msg}"`)
  } catch (err) {
    m.reply(err.message)
  }
}

handler.help = ['ngl']
handler.tags = ['tools']
handler.command = /^ngl$/i

async function cekUser(url) {
  try {
    const res = await axios(url)
    return res.data
  } catch (err) {
    return null
  }
}

async function sendNgl(url, text) {
  try {
    const res = await axios({
      url,
      method: 'post',
      data: new URLSearchParams({
        question: text
      })
    })
    return res.data
  } catch (err) {
    console.log(err)
    return null
  }
}

export default handler
