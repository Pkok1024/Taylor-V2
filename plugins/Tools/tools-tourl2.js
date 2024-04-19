import fs from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'

const handler = async (m) => {
  let q = m.quoted ? m.quoted : m
  let mime = q.mediaType || ''

  if (!/image|video|audio|sticker|document/.test(mime)) {
    throw new Error('No media found or media type not supported')
  }

  let media = await q.downloadMedia()
  if (!media || !media.path) {
    throw new Error('Error downloading media')
  }

  let data = await uploadFile(media.path)
  m.reply(data.files[0].url)
}

handler.help = ['tourl2']
handler.tags = ['tools']
handler.command = /^(tourl2)$/i

export default handler

const uploadFile = async (path) => {
  if (!fs.existsSync(path)) {
    throw new Error('File not found')
  }

  let form = new FormData()
  form.append('files[]', fs.createReadStream(path))

  const options = {
    method: 'post',
    headers: {
      ...form.getHeaders()
    },
    body: form,
    timeout: 30000 // 30 seconds
  }

  try {
    let res = await fetch('https://uguu.se/upload.php', options)
    let json = await res.json()
    await fs.promises.unlink(path)
    return json
  } catch (err) {
    console.error(err)
    throw new Error('Error uploading file')
  }
}
