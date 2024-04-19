import cheerio from 'cheerio'
import fetch from 'node-fetch'

// The main function that handles the .doodstream command
const handler = async (m, {
    conn,
    usedPrefix,
    text,
    args,
    command
}) => {

    // List of available features
    const lister = [
        "search",
        "info",
        "folders",
        "files"
    ]

    // Split the input text into feature, inputs, and other arguments
    const [feature, inputs, inputs_, inputs__, inputs___] = text.split("|")

    // Check if the feature is valid
    if (!lister.includes(feature)) {
        // Return an error message if the feature is not valid
        return m.reply("*Example:*\n.doodstream search|vpn\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join("\n"))
    }

    // Handle the available features
    if (lister.includes(feature)) {
        if (feature == "search") {
            // Handle the search feature
            if (!inputs) {
                // Return an error message if no input is provided
                return m.reply("Input query link\nExample: .doodstream search|query")
            }

            try {
                // Call the doodstreamSearch function with the input query
                const data = await doodstreamSearch(inputs)

                // Extract the result list from the data
                const resultList = data.result.map((file, index) => {
                    return `${index + 1}. ${file.title} - File Code: ${file.file_code}`;
                }).join("\n");

                // Reply with the result list
                await m.reply(resultList);
            } catch (e) {
                // Reply with an error message if there is an error
                await m.reply(eror)
            }
        }

        if (feature == "info") {
            // Handle the info feature
            if (!inputs) {
                // Return an error message if no input is provided
                return m.reply("Input query link\nExample: .doodstream info|code")
            }

            try {
                // Call the doodstreamInfo function with the input file code
                const data = await doodstreamInfo(inputs)

                // Extract the result text from the data
                const teks = data.result.map((item, index) => {
                    return `🔍 *[ RESULT ${index + 1} ]*
📰 *Title:* ${item.title}
🔗 *File Code:* ${item.filecode}
⏱️ *Length:* ${item.length}
🔗 *Protected Download:* ${item.protected_dl}
🖼️ *Single Image:* ${item.single_img}
▶️ *Can Play:* ${item.canplay}
👀 *Views:* ${item.views}
🌊 *Splash Image:* ${item.splash_img}
💾 *Size:* ${item.size}
🔗 *Protected Embed:* ${item.protected_embed}
📅 *Last View:* ${item.last_view}
⏳ *Uploaded:* ${item.uploaded}`;
                }).join("\n\n________________________\n\n");

                // Reply with the result text
                await m.reply(teks);
            } catch (e) {
                // Reply with an error message if there is an error
                await m.reply(eror)
            }
        }

        if (feature == "folders") {
            // Handle the folders feature
            if (!inputs) {
                // Return an error message if no input is provided
                return m.reply("Input query link\nExample: .doodstream search|query")
            }

            try {
                // Call the doodstreamFolders function with the input code
                const data = await doodstreamFolders(inputs)

                // Extract the folders list from the data
                const foldersList = data.result.folders.map((folder, index) => {
                    return `${index + 1}. ${folder.name} (ID: ${folder.fld_id})`;
                }).join("\n");

                // Reply with the folders list
                await m.reply(foldersList);
            } catch (e) {
                // Reply with an error message if there is an error
                await m.reply(eror)
            }
        }

        if (feature == "files") {
            // Handle the files feature
            if (!inputs) {
                // Return an error message if no input is provided
                return m.reply("Input query link\nExample: .doodstream search|query")
            }

            try {
                // Call the doodstreamFiles function with the input folder ID
                const data = await doodstreamFiles(inputs)

                // Extract the files list from the data
                const filesList = data.result.files.map((file, index) => {
                    return `${index + 1}. ${file.title} - Download URL: ${file.download_url}`;
                }).join("\n");

                // Reply with the files list
                await m.reply(filesList);
            } catch (e) {
                // Reply with an error message if there is an error
                await m.reply(eror)
            }
        }
    }
}
handler.help = ['doodstream']
handler.tags = ['downloader']
handler.command = /^(doodstream)$/i

// Export the handler function
export default handler

// Function to search for videos on Doodstream
async function doodstreamSearch(query) {
    // Fetch the search results from the Doodstream API
    const res = await fetch(`https://doodapi.com/api/search/videos?key=13527p
