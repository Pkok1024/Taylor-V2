let handler = async (m, {
    conn,
    args
}) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let name = m.name
    let text =
        const textInput = args.length >= 1 ? args.join(" ") : (m.quoted && m.quoted.text) ? m.quoted.text : (() => {
            throw "Input Teks";
        })();
    await m.reply(wait)

    try {
        const avatar = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/a2ae6cbfa40f6eeea0cf1.jpg')
        let replies = Math.floor(Math.random() * 990000) + 10000;
        let retweets = Math.floor(Math.random() * 1485000) + 15000;
        const username = who.split("@")[0]
        const theme = "dark"
        const url = `https://some-random-api.com/canvas/misc/tweet?displayname=${encodeURIComponent(name)}&username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(avatar)}&comment=${encodeURIComponent(text)}&replies=${encodeURIComponent(replies)}&retweets=${encodeURIComponent(retweets)}&theme=${encodeURIComponent(theme)}`
        conn.sendFile(m.chat, url, "tweet.png", "*THANKS FOR TWEETING*", m)
    } catch (e) {
        await m.reply(eror)
    }
}

handler.help = ["tweetc"]
handler.tags = ["maker"]
handler.command = ["tweetc"]

export default handler