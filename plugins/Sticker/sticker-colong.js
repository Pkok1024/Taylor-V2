// Import required modules
import { MessageType } from '@whiskeysockets/baileys'
import { sticker } from '../../lib/sticker.js'

// Define the handler function
const handler = async (m, { conn, args, usedPrefix, command }) => {
  let isSticker = false
  try {
    // Get the quoted message or the message itself
    const message = m.quoted ? m.quoted : m
    // Get the message mimetype
    const mime = message.msg || message.mimetype || ''

    // Check if the message is an image or a video
    if (/image|video/.test(mime)) {
      // Split the text argument by '|'
      const urut = text.split('|')
      // Get the first and second parts of the split text
      const one = urut[0]
      const two = urut[1]
      // Download the quoted message or the attached file
      const img = await message.download()
      // Check if the downloaded file exists
      if (!img) throw `Reply stiker nya!\n ${usedPrefix + command} pack|auth`
      // Create a sticker using the downloaded file
      isSticker = await sticker(img, false, one, two)
    } else if (args[0]) {
      // Create a sticker using the provided text
      isSticker = await sticker(false, args[0], 'Nihh', 'Bang')
    }
  } catch (err) {
    // Log any errors
    console.error(err)
    // Throw an error message
    throw 'Conversion failed'
  } finally {
    // Send the created sticker
    if (isSticker) conn.sendFile(m.chat, isSticker, 'sticker.webp', '', m)
  }
}

// Add metadata to the handler function
handler.help = ['colong']
handler.tags = ['sticker']
handler.command = /^colong$/i
handler.owner = true

// Export the handler function
export default handler

