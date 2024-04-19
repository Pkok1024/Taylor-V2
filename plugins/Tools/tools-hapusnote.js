// Import the 'handler' function as the default export from the given module
export default handler => {
  // Define the async function 'handler' with the following parameters:
  // m: the WhatsApp message object
  // {conn, command, usedPrefix, text}: an object containing the WhatsApp connection instance, command name, prefix, and message text
  let handler = async (m, { conn, command, usedPrefix, text }) => {
    // Access the 'users' object in the 'db' data store and retrieve the user data for the sender of the message
    global.db.data.users[m.sender].catatan = global.db.data.users[m.sender].catatan || [];

    // Check if the message text is 'all'
    if (text == "all") {
      // Clear the 'catatan' property of the user data
      global.db.data.users[m.sender].catatan = [];
      // Throw an error message to indicate successful deletion of all notes
      throw "Berhasil menghapus *semua* catatan!";
    }

    // Retrieve the 'catatan' property of the user data
    let catatan = global.db.data.users[m.sender].catatan;

    // Initialize counters for deleted and opened notes
    let numd = 0;
    let numo = 0;

    // Initialize an empty array to store note sections
    let listSections = [];

    // Iterate over the values in the 'catatan' array
    Object.values(catatan).map((v, index) => {
      // Add a new section to the 'listSections' array for each note
      listSections.push(["Num. " + ++index, [
        // The first element of each sub-array is the title of the note
        ["Delete " + v.title, usedPrefix + "hapusnote " + ++numd, v.isi],
        // The second element of each sub-array is the command to open the note
        ["Open " + v.title, usedPrefix + "lihatnote " + ++numo, v.isi]
      ]])
    });

    // Check if the message text is empty
    if (text.length == 0) {
      // Send a list of notes to the chat
      return conn.sendList(m.chat, htki + " 🗒️ List Notes " + htka, "⚡ Silakan pilih Notes yang anda mau.", author, "[ 🔍 Lihat ]", listSections, m)
    }

    // Split the message text into an array of strings using the '|' character as the delimiter
    let split = text.split("|");

    // Check if the 'catatan' array is empty
    if (catatan.length == 
