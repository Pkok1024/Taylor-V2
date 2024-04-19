import fetch from "node-fetch"
import cheerio from "cheerio"

let handler = async (m, {
    conn,
    isOwner,
    usedPrefix,
    command,
    args
}) => {
    let query = "input text\nEx. .comicvine hello world\n<command> <text>"
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else throw query

    if (typeof text !== 'string') throw `Comicvine query must be a string.`

    try {
        m.reply(wait)
        let res = await ComicvineSearch(text)
        if (!res.results.length) throw `No results found for query: ${text}`

        let list = res.results.slice(0, 10).map((item, index) => `*${htki} SEARCH ${htka}*

*ID:* ${item.id}
*Name:* ${item.name}
*Deck:* ${item.deck}

`).join("\n")

        let res1 = await ComicvineCharacters()
        if (!res1.results.length) throw `No characters found.`

        let list1 = res1.results.slice(0, 10).map((item, index) => `*${htki} CHARACTER ${htka}*

*ID:* ${item.id}
*Name:* ${item.name}
*Deck:* ${item.deck}
*Alias:* ${item.aliases.join(', ')}

`).join("\n")

        let res2 = await ComicvineVideos()
        if (!res2.results.length) throw `No videos found.`

        let list2 = res2.results.slice(0, 10).map((item, index) => `*${htki} VIDEOS ${htka}*

*ID:* ${item.id}
*GUID:* ${item.guid}
*Name:* ${item.name}
*Hurl:* ${item.high_url}
*Deck:* ${item.deck}

`).join("\n")

        conn.sendFile(m.chat, res.results[0].image.original_url, "result", "\n" + list + "\n" + list1 + "\n" + list2, m)
    } catch (e) {
        throw e.message
    }
}
handler.help = ["comicvine"]
handler.tags = ["search"]
handler.command = /^(comicvine)$/i
export default handler

async function ComicvineSearch(query) {
    const response = await fetch("https://www.comicvine.com/api/search?format=json&field_list=name,id,deck,image&api_key=d80
