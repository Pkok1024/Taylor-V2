const { Primbon } = await (await import('../../lib/scraped-primbon.js'))
// Importing the 'Primbon' class from the 'scraped-primbon.js' library

const primbon = new Primbon()
// Creating a new instance of the 'Primbon' class

let handler = async (m, { conn, args, usedPrefix, command }) => {
  // Declaring the async handler function with the following parameters:
  // - m: The WhatsApp message object
  // - {conn, args, usedPrefix, command}: The bot's connection, user arguments, prefix, and command

  let text
  // Declaring the 'text' variable to store the user input

  if (args.length >= 1) {
    // If there is at least one argument provided
    text = args.slice(0).join(" ")
    // Combine all the arguments into a single string
  } else if (m.quoted && m.quoted.text) {
    // If the message is a reply to another message
    text = m.quoted.text
    // Use the replied message as the input
  } else return m.reply("Masukkan pesan!")
  // If no input is provided, reply with "Masukkan pesan!"

  await m.reply(wait)
  // Reply with the 'wait' message while processing the request

  try {
    // Begin the try-catch block to handle any errors

    const zodiakInfo = await primbon.zodiak(text);
    // Call the 'zodiak' method from the 'primbon' instance with the user input
    // Store the returned zodiac information in the 'zodiakInfo' variable

    const caption = `
=== Informasi Zodiak ===
Zodiak: ${zodiakInfo.message.zodiak}
Tanggal Lahir: ${zodiakInfo.message.tanggal_lahir}
Sifat: ${zodi
