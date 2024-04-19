let {
    downloadContentFromMessage
} = (await import('@whiskeysockets/baileys'));

let handler = async (m, {
    conn
}) => {
    if (!m.quoted) throw 'Where\'s the message?'
    let msg = m.quoted.message
    let type = Object.keys(msg)[0]

    // Validate message type
    if (!['imageMessage', 'videoMessage'].includes(type)) {
        throw `Unsupported message type: ${type}`
    }

    try {
        let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : 'video')
        let buffer = Buffer.from([])
        for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk])
        }

        // Log media type
        console.log(`Processing media type: ${type}`)

        // Check for file extension
        let ext = type == 'imageMessage' ? '.jpg' : '.mp4'
        if (/video/.test(type) && ext != '.mp4') {
            return conn.sendFile(m.chat, buffer, 'media.mp4', msg[type].caption || '', m)
        } else if (/image/.test(type) && ext != '.jpg') {
            return conn.sendFile(m.chat, buffer, 'media.jpg', msg[type].caption || '', m)
        }

        // Check for caption presence
        if (msg[type].caption) {
            return conn.sendFile(m.chat, buffer, `media${ext}`, msg[type].caption, m)
        } else {
            return conn.sendFile(m.chat, buffer, `media${ext}`, '', m)
        }

