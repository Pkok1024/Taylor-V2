import got from "got"
import cheerio from "cheerio"
import fetch from "node-fetch"

const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else return m.reply("Input Teks")

    if (!command.match(/^(alloschool|alloschoolget)$/i)) return m.reply("Invalid command")

    await m.reply(wait)

    try {
        const results = command === "alloschoolget" ? await getAlloschool(text) : await searchAlloschool(text)
        if (results.length === 0) return m.reply("No results found")

        if (command === "alloschoolget") {
            const { url, title } = results[0]
            await conn.sendFile(m.chat, url, title, "", m, false, { asDocument: true })
        } else {
            let teks = results.map((v, i) => {
                return `*[ ${i + 1} ]*
🔖 *Title* : ${v.title}
🔗 *Link* : ${v.url}
`.trim()
            }).filter(v => v).join("\n\n________________________\n\n")
            await m.reply(teks)
        }
    } catch (error) {
        console.log(error)
        return m.reply("Failed to fetch results")
    }
}

handler.help = ["alloschool"]
handler.tags = ["internet"]
handler.command = /^alloschool|alloschoolget$/i
export default handler


async function searchAlloschool(query) {
    try {
        const response = await got(`https://www.alloschool.com/search?q=${query}`)
        const $ = cheerio.load(response.body)
        const elements = $('ul.list-unstyled li')
        const result = elements.map((i, el) => {
            const title = $('a', el).text().trim()
            const url = $('a', el).attr('href')
            if (/^https?:\/\/www\.alloschool\.com\/element\/\d+$/.test(url)) {
                return {
                    index: i + 1,
                    title,
                    url
                }
            }
        }).get().filter(item => item)
        console.log(`Search results: ${result.length}`)
        return result
    } catch (error) {
        console.log(error)
    }
}

async function getAlloschool(url) {
    try {
        const pdfRegex = /\.pdf$/i
        const response = await got(url)
        const $ = cheerio.load(response.body)
        const results = []
        $('a').each((i, link) => {
            const href = $(link).attr('href')
            const title = $(link).text()
            if (pdfRegex.test(href)) {
                if (!results.some(r => r.url === href)) {
                    results.push({
                        index: i + 1,
                        title,
                        url: href
                    })
                }
            }
        })
        console.log(`PDF results: ${results.length}`)
        return results
    } catch (error) {
        console.log(error)
    }
}
