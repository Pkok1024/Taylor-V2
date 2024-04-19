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

    // List of available features
    const lister = [
        "search",
        "app"
    ]

    // Split the input text into feature, inputs, and other arguments
    const [feature, inputs, inputs_, inputs__, inputs___] = text.split("|")

    // Check if the feature is valid
    if (!lister.includes(feature)) {
        // Return an error message if the feature is not valid
        return m.reply("*Example:*\n.apkpures search|vpn\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join("\n"))
    }

    // Handle the feature if it is valid
    if (lister.includes(feature)) {
        if (feature == "search") {
            // Handle the search feature
            if (!inputs) {
                // Return an error message if the input is empty
                return m.reply("Input query link\nExample: .apkpures search|vpn")
            }
            // Reply with a loading message
            await m.reply(wait)
            try {
                // Call the searchapkpures function to get the search results
                const res = await searchapkpures(inputs)
                // Format the search results into a string
                const teks = res.map((item, index) => {
                    return `🔍 *[ RESULT ${index + 1} ]*

🔗 *link:* ${item.link}
🔗 *linkdl:* https://d.apkpure.com/b/APK/${item.link.split("/")[5]}?version=latest
🖼️ *image:* ${item.image}
📰 *name:* ${item.name}
👩‍💻 *developer:* ${item.developer}
🏷️ *tags:* ${item.tags.join(", ")}
⬇️ *downloadLink:* ${item.downloadLink}
📦 *fileSize:* ${item.fileSize}
🔢 *version:* ${item.version}
🔢 *versionCode:* ${item.versionCode}`

                }).filter(v => v).join("\n\n________________________\n\n")
                // Reply with the search results
                await m.reply(teks)
            } catch (e) {
                // Reply with an error message if there is an error
                await m.reply(eror)
            }
        }

        if (feature == "app") {
            // Handle the app feature
            if (!inputs.startsWith('https://m.apkpure.com')) {
                // Return an error message if the input is not a valid app URL
                return m.reply("Input query link\nExample: .apkpures app|link")
            }
            try {
                // Call the getApkpure function to get the app details
                const resl = await getApkpure(inputs)
                // Send the app logo as a file
                const cap = "*Name:* " + resl.title + "\n" + "*Link:* " + resl.link + "\n\n" + wait
                await conn.sendFile(m.chat, logo, "", cap, m)
                // Send the app APK as a file
                await conn.sendFile(m.chat, resl.link, resl.title, null, m, true, {
                    quoted: m,
                    mimetype: "application/vnd.android.package-archive"
                })
            } catch (e) {
                // Reply with an error message if there is an error
                await m.reply(eror)
            }
        }
    }
}

// Add metadata for the handler function
handler.help = ["apkpures"]
handler.tags = ["internet"]
handler.command = /^(apkpures)$/i

// Export the handler function
export default handler

/* New Line */

// Function to search for apps on apkpure.com
const searchapkpures = async (q) => {
    const end = 'https://m.apkpure.com'
    const url = end + '/cn/search?q=' + q + '&t=app'; // Ganti dengan URL sumber data Anda
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract the search results from the HTML
    const searchData = [];
    $('ul.search-res li').each((index, element) => {
        const $element = $(element);

        const obj = {
            link: end + $element.find('a.dd').attr('href'),
            image: $element.find('img').attr('src'),
            name: $element.find('.p1').text().trim(),
            developer: $element.find('.p2').text().trim(),
            tags: $element.find('.tags .tag').map((i, el) => $(el).text().trim()).get(),
            downloadLink: end + $element.find('.right_button a.is-download').attr('href'),
            fileSize: $element.find('.right_button a.is-download').data('dt-filesize'),
            version: $element.find('.right_button a.is-download').data('dt-version'),
            versionCode: $element.find('.right_button a.is-download').data('dt-versioncode'),
        };
        searchData.push(obj);
    });

    return searchData;
}

// Function to get the app details from apkpure.com
const getApkpure = async (url) => {
    try {
        // Fetch the app page
        const response = await fetch(url);
       
