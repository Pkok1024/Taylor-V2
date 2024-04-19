// I am here to help you, kindly refrain from bullying
import fetch from 'node-fetch'
import fs from 'fs'
import { Mime } from 'type-fest'

const handler = async (m: any, { conn, command, usedPrefix, args }) => {
  try {
    const response = await fetch('https://api.zacros.my.id/other/meme')
    const data = await response.json()

    const imageUrl = data.image
    const imageName = imageUrl.split('/').pop()
    const imageType = imageUrl.split('.').pop() as Mime

    const imageResponse = await fetch(imageUrl)
    const imageBuffer = await imageResponse.buffer()

    await fs.promises.writeFile(imageName, imageBuffer, 'binary')
    await conn.sendMessage(m.chat, {
      image: { url: `./${imageName}` },
      caption: `*Result:* ${data.title}
Url: ${data.url}
Ups: ${data.ups}
Comment: ${data.comments}
`,
    })

    await fs.promises.unlink(imageName)
  } catch (error) {
    console.error(error)
    await conn.sendMessage(m.chat, { text: 'An error occurred while fetching the meme. Please try again later.' })
  }
}

handler.help = ['jokes (reply)']
handler.tags = ['sticker']
handler.command = /^jokes$/i

export default handler
