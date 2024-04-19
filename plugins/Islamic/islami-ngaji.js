import cheerio from 'cheerio';
import fetch from 'node-fetch';

// The main function that handles the command
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {
    try {
        // List of available features
        const lister = [
            "ayat",
            "surah"
        ]

        // Split the input text into feature, inputs, inputs_, inputs__, inputs___
        const [feature, inputs, inputs_, inputs__, inputs___] = text.split("|")

        // Check if the feature is valid
        if (!lister.includes(feature)) {
            // Return an error message if the feature is not valid
            return m.reply("*Contoh:*\n.ngaji ayat|edisi\n\n*Pilih type yang ada:*\n\n" + lister.map(v => "  ○ " + v).join("\n"))
        }

        if (lister.includes(feature)) {
            if (feature == "ayat") {
                // Check if inputs are provided
                if (!inputs) {
                    // Return an error message if inputs are not provided
                    return m.reply("Masukkan query link\nContoh: .ngaji 1|3")
                }
                // Wait for the response to be sent
                await m.reply(wait)
                // Check if inputs are numbers
                if (isNaN(inputs) || isNaN(inputs_)) {
                    // Return an error message if inputs are not numbers
                    return m.reply("Input harus berupa angka")
                }

                // Fetch the edition data
                const data = await getEditionData()
                // Format the edition data as a string
                const edisi = data.data.map((item, index) => {
                    return `🔍 *[ EDISI ${index + 1} ]*

🌐 *English:* ${item.englishName}
📛 *Name:* ${item.name}
`
                }).filter(v => v).join("\n\n________________________\n\n")

                // Check if inputs_ are provided
                if (!inputs_) {
                    // Return an error message if inputs_ are not provided
                    return m.reply("Pilih edisi yang Anda inginkan\nContoh: .ngaji ayat|edisi\n\n" + edisi)
                }

                // Check if inputs_ are within the valid range
                if (inputs_ >= 1 && inputs_ <= data.data.length) {
                    // Get the bagian data based on inputs_
                    const index = inputs_ - 1;
                    const bagian = data.data[index];
                    // Fetch the ayah data
                    const res = await getAyahData(inputs, bagian.identifier)
                    // Check if the response code is 200
                    if (res.code !== 200) {
                        // Return an error message if the response code is not 200
                        return m.reply(res.data)
                    }
                    // Fetch the image URL
                    const imagers = await getImageUrl(res.data.number, res.data.surah.number)
                    // Construct the caption
                    const cap = `🔍 *[ EDISI ${res.data.edition.englishName} ]*

🌐 *Name:* ${res.data.surah.name}
📢 *Surah Number:* ${res.data.surah.number}
📖 *English:* ${res.data.surah.englishName}
📝 *Text:* ${res.data.text}

${wait}
`
                    // Send the image and the caption
                    await conn.sendFile(m.chat, imagers || logo, "", cap, m)
                    // Send the audio
                    await conn.sendMessage(m.chat, {
                        audio: {
                            url: res.data.audio
                        },
                        seconds: fsizedoc,
                        ptt: true,
                        mimetype: "audio/mpeg",
                        fileName: "vn.mp3",
                        waveform: [100, 0, 100, 0, 100, 0, 100]
                    }, {
                        quoted: m
                    })
                } else {
                    // Return an error message if inputs_ are not within the valid range
                    return m.reply('Nomor yang diminta lebih besar dari jumlah objek yang ada.');
                }
            }

            if (feature == "surah") {
                // Check if inputs are provided
                if (!inputs) {
                    // Return an error message if inputs are not provided
                    return m.reply("Masukkan query link\nContoh: .ngaji 1|3")
                }
                // Check if inputs are numbers
                if (inputs > 114) {
                    // Return an error message if inputs are greater than 114
                    return m.reply("Input lebih dari 114")
                }
                // Wait for the response to be sent
                await m.reply(wait)
                if (isNaN(inputs) || isNaN(inputs_)) {
                    // Return an error message if inputs are not numbers
                    return m.reply("Input harus berupa angka")
                }
                // Fetch the edition data
                const data = await getEditionDataSurah()
                // Format the edition data as a string
                const edisi = data.map((item, index) => {
                    return `🔍 *[ EDISI ${index + 1} ]*

🌐 *English:* ${item.englishName}
📛 *Name:* ${item.name}
`
                }).filter(v
