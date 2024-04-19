import genshindb from 'genshin-db' // Importing the genshin-db module

// Handler function for the command
const handler = async (m, {
    conn, // Connection object
    text, // User input
    args, // Arguments passed to the command
    usedPrefix, // The prefix used to call the command
    command // The command name
}) => {
    if (!text) throw `Example : *${usedPrefix + command} shiba*` // Throw an error if no input is provided
    try {
        // Fetching animal data using the genshindb module
        let anu = await genshindb.animals(text)
        let ini_txt = `*Found : ${anu.name}*\n\n` // Initializing the response message
        ini_txt += `"${anu.description}"\n\n` // Adding the animal's description to the message
        ini_txt += `*Category :* ${anu.category}\n` // Adding the animal's category to the message
        ini_txt += `*Count Type :* ${anu.counttype}\n` // Adding the animal's count type to the message
        ini_txt += `_sort order : ${anu.sortorder}_` // Adding the animal's sort order to the message
        m.reply(ini_txt) // Sending the message
    } catch (e) {
        console.log(e) // Logging the error
        try {
            // Fetching animal categories if the animal is not found
            let anu2 = await genshindb.animals(`${text}`, {
                matchCategories: true
            })
            m.reply(`*List ${text} categories :*\n\n- ` + anu2.toString().replaceAll(',', '\n- ')) // Sending the list of categories
        } catch (e) {
            console.log(e)
            let anu2 = await genshindb.animals(`names`, {
                matchCategories: true
            })
            m.reply(`*Not Found*\n\n*Available animals
