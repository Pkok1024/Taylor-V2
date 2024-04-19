import fetch from 'node-fetch'

let handler = async (m, { conn, command }) => {
  try {
    let res = await fetch('https://raw.githubusercontent.com/BadXyz/txt/main/citacita/citacita.json')
    if (!res.ok) throw new Error(res.statusText)
    let json = await res.json()
    let audioUrl = json.getRandom()
    if (!audioUrl) throw new Error('Audio URL not found in JSON data')

    // Simulate a random audio duration between 10 to 30 seconds
    let duration = Math.floor(Math.random() * 20) + 10

    await conn.sendMessage(m.chat, {
      audio: {
        url: audioUrl
      },
      seconds: duration,
      ptt: true,
      mimetype: "audio/mpeg",
      fileName: "vn.mp3",
      waveform: [100, 0, 100, 0, 100, 0, 100]
    }, {
      quoted: m
    })
  } catch (err) {
    console.error(err)
    await conn.sendMessage(m.chat, { text: 'An error occurred while fetching the audio file. Please try again later.' }, { quoted: m })
  }
}
handler.help = ['citacita']
handler.tags = ['random']
handler.command = /^(citacita)$/i

export default handler
