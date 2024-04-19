// Define the bomb handler function
const handler = async (m, {
    conn
}) => {
    // Initialize the bomb object for the current chat if it doesn't exist
    conn.bomb = conn.bomb || {};
    const id = m.chat, // Get the chat ID
        timeout = 180000; // Set the timeout duration in milliseconds

    // Return if the chat ID is already in the bomb object
    if (id in conn.bomb) return conn.reply(m.chat, '*^ sesi ini belum selesai!*', conn.bomb[id][0]);

    // Initialize the bomb array with emojis and numbers
    const bom = ['💥', '✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅'].sort(() => Math.random() - 0.5);
    const number = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

    // Map the bomb array to an array of objects containing emot, number, position, state, and player properties
    const array = bom.map((v, i) => ({
        emot: v,
        number: number[i],
        position: i + 1,
        state: false,
        player: m.sender
    }));

    // Prepare the initial message to be sent to the user
    let teks = `乂  *B O M B*\n\nKirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`;
    for (let i = 0; i < array.length; i += 3) teks += array.slice(i, i + 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
    teks += `\nTimeout : [ *${((timeout / 1000) / 60)} menit* ]\nApabila mendapat kotak yang berisi bom maka point akan di kurangi.`;

    // Send the initial message and store the message object
    let msg = await conn.reply(m.chat, teks, m
