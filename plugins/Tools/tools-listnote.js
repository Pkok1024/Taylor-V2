// Importing the necessary modules and dependencies
const conn = require('...'); // The connection object for the database
const {
    command,
    usedPrefix,
    text
} = require('../lib/whatsapp'); // The command, prefix, and text from the WhatsApp message

// Defining the handler function for the "listnote" command
let handler = async (m, {
    conn,
    command,
    usedPrefix,
    text
}) => {
    // Initializing the user's notes array if it doesn't exist
    global.db.data.users[m.sender].catatan = global.db.data.users[m.sender].catatan || [];

    // Checking if the user has any notes
    if (global.db.data.users[m.sender].catatan.length == 0) {
        return m.reply("Kamu belum punya catatan!");
    }

    // Assigning the user's notes to the "catatan" variable
    let catatan = global.db.data.users[m.sender].catatan;

    // Checking if the user has any notes
    if (catatan.length == 0) {
        return m.reply("Kamu belum memiliki catatan!");
    }

    // Initializing the "numd" and "numo" variables to keep track of the number of notes
    let numd = 0;
    let numo = 0;

    // Initializing the "listSections" array to store the list of notes
    let listSections = [];

    // Looping through each note in the "catatan" array
    Object.values(catatan).map((v, index) => {
        // Adding a new section to the "listSections" array for each note
        listSections.push(["Num. " + ++index, [
            // Adding a new option to the section for deleting the note
            ["Delete " + v.title, usedPrefix + "hapusnote " + ++numd, v.isi],
            // Adding a new option to the section for
