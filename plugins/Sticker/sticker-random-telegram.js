import wibusoft from 'wibusoft' // Importing wibusoft module
import fetch from 'node-fetch' // Importing fetch module

// Defining the handler function which handles the command
let handler = async (m, {
    text, // The text input by the user
    command, // The command used by the user
    usedPrefix, // The prefix used by the user
    conn // The connection object
}) => {
    // Defining an array of valid input strings
    var list_input = [
        "awoawo",
        "chat",
        "dbfly",
        "dino-kuning",
        "doge",
        "gojosatoru",
        "hope-boy",
        "jisoo",
        "kawan-sponsbob",
        "kr-robot",
        "kucing",
        "lonte",
        "manusia-lidi",
        "menjamet",
        "meow",
        "nicholas",
        "patrick",
        "popoci",
        "sponsbob",
        "tyni"
    ]

    // Defining an error message to be thrown if the input is invalid
    var salah_input = "*Example:*\n" + usedPrefix + command + " tyni \n*[ Daftar Stiker ]*\n\n" + await ArrClean(list_input)

    // Checking if the input is not in the list of valid inputs
    if (!list_input.includes(text)) throw salah_input

    // Handling the command
    try {
        // Defining the URL of the API endpoint to be called
        let res = 'https://api.zeeoneofc.my.id/api/telegram-sticker/' + text + '?apikey=dhmDlD5x'

        // Sending a "wait" message to the user
        m.reply(wait)

        // Calling the makeSticker function from the wibusoft module
        let out = await wibusoft.tools.makeSticker(res, {
            author: author, // The author of the
