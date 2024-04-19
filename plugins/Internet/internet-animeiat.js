import fetch from "node-fetch" // Importing the 'node-fetch' module to make HTTP requests

const handler = async (m, {
    command,
    usedPrefix,
    conn,
    text,
    args
}) => {

    const lister = [ // List of available features
        "search",
        "video",
        "slugeps",
        "slugvid",
        "getvid"
    ]

    // Destructuring the 'text' argument into feature, inputs, inputs_, inputs__, inputs___
    const [feature, inputs, inputs_, inputs__, inputs___] = text.split("|")

    // Checking if the feature is valid
    if (!lister.includes(feature)) {
        return m.reply("*Example:*\n.animeiat search|naruto\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join('\n'))
    }

    // Handling the feature requests
    if (lister.includes(feature)) {

        // Handling the 'search' feature
        if (feature == "search") {
            if (!inputs) return m.reply("Input query anime")
            await m.reply(wait)
            try {
                const outs = await searchAnime(inputs) // Calling the 'searchAnime' function
                const teks = outs.map((anime, index) => {
                    return `*[ ${index + 1} ]*
*Judul:* ${anime.anime_name}
*ID:* ${anime.id}
*Slug:* ${anime.slug}
*Cerita:* ${anime.story}
*Nama lain:* ${anime.other_names}
*Total episode:* ${anime.total_episodes}
*Usia:* ${anime.age}
*Tipe:* ${anime.type}
*Status:* ${anime.status}
*Path poster:* ${anime.poster_path}
*Dipublikasikan oleh:* ${anime.published}
*Tanggal publikasi:* ${anime.published_at}
*Tahun:* ${anime.year_id}
*Dibuat pada:* ${anime.created_at}
*Diperbarui pada:* ${anime.updated_at}
   `.trim()
                }).filter(v => v).join("\n\n________________________\n\n")
                await m.reply(teks)
            } catch (e) {
                await m.reply(eror)
            }
        }

        // Handling the 'video' feature
        if (feature == "video") {
            if (!inputs) return m.reply("Input query anime")
            await m.reply(wait)
            try {
                const outs = await fetchAnime(inputs, inputs_) // Calling the 'fetchAnime' function
                const teks = outs.map((anime, index) => {
                    return `*[ ${index + 1} ]*
*Quality:* ${anime.quality}
*Label:* ${anime.label}
*Link:* ${anime.file}
   `.trim()
                }).filter(v => v).join("\n\n________________________\n\n")
                await m.reply(teks)
            } catch (e) {
                await m.reply(eror)
            }
        }

        // Handling the 'slugeps' feature
        if (feature == "slugeps") {
            if (!inputs) return m.reply("Input query anime")
            await m.reply(wait)
            try {
                const outs = await slugEpisode(inputs) // Calling the 'slugEpisode' function
                const teks = outs.map((anime, index) => {
                    return `*[ ${index + 1} ]*
*Judul:* ${anime.anime_name}
*Slug:* ${anime.slug}
   `.trim()
                }).filter(v => v).join("\n\n________________________\n\n")
                await m.reply(teks)
            } catch (e) {
                await m.reply(eror)
            }
        }

        // Handling the 'slugvid' feature
        if (feature == "slugvid") {
            if (!inputs) return m.reply("Input query episode slug")
            await m.reply(wait)
            try {
                const outs = await slugVideo(inputs, inputs_) // Calling the 'slugVideo' function
                const teks = `*Slug:* ${outs.slug}\n*Episode:* 1 sampai ${outs.total}`
                await m.reply(teks)
            } catch (e) {
                await m.reply(eror + "\nEpisode yang anda masukkan kebanyakan!")
            }
        }

        // Handling the 'getvid' feature
        if (feature == "getvid") {
            if (!inputs) return m.reply("Input query video slug")
            await m.reply(wait)
            try {
                const outs = await getVideo(inputs) // Calling the 'getVideo' function
                const teks = outs.map((anime, index) => {
                    return `*[ ${index + 1} ]*
*Quality:* ${anime.quality}
*Label:* ${anime.label}
*Link:* ${anime.file}
   `.trim()
                }).filter(v => v).join("\n\n________________________\n\n")
                await m.reply(teks)
            } catch (e) {
                await m.reply(eror)
            }
        }

    }
}

// Adding metadata for the handler
handler.help = ["animeiat type query"]
handler.tags = ["internet"]
handler.command = /^(animeiat)$/i

// Exporting the handler
export default handler

// Function to search anime
async function searchAnime(query) {
    try {
        const response = await fetch
