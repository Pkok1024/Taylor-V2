// This function handles the story feature of the bot
const handler = async (m, {
    conn
}) => {
    // Initialize storyData object if it doesn't exist
    conn.storyData = conn.storyData ? conn.storyData : {};

    // Get the list of stories
    const list = conn.story || [];
    // Check if there are any stories available
    if (list.length === 0) {
        // If not, send a message to the user
        return await conn.reply(m.chat, `Tidak ada cerita yang tersedia saat ini. Silakan tambahkan cerita dengan mengirim gambar, video, atau pesan suara.`, m, {
            mentions: [m.sender]
        });
    }

    // Function to format each story object
    const formatMessage = (obj, index) => {
        // Extract relevant properties from the object
        const {
            type,
            sender,
            caption
        } = obj;
        // Convert message type to a more readable format
        const messageType = convertMessageType(type);
        // Extract the username from the sender's JID
        const senderUsername = sender.split('@')[0];
        // Construct the message string
        let text = `*${index + 1}.* ${messageType.toUpperCase()} - @${senderUsername}`;
        // Add the caption if it exists
        if (caption) text += `\n${caption}`;
        // Return the formatted message
        return text + `\n`;
    };

    // Format all the stories and join them into a single string
    const formattedMessages = list.map(formatMessage).join('\n');

    // Send the list of stories to the user
    let {
        key
    } = await conn.reply(
        m.chat,
        `🔧 Daftar Story:\n\n${formattedMessages}\n\nBalas pesan ini dengan nomor cerita yang ingin ditampilkan.`,
        m, {
            mentions: [m.sender]
        }
    );

    // Store the list of stories, the key of the reply message, and a timeout function
    // to delete the message after 60 seconds
    conn.storyData[m.chat] = {
        list,
        key,
        timeout: setTimeout(() => {
            conn.sendMessage(m.chat, {
                delete: key
            });
            delete conn.storyData[m.chat];
        }, 60 * 1000)
    };
};

// This function is called before the handler function
handler.before = async (m, {
    conn

