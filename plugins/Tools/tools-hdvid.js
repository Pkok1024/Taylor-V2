// Import the 'converter.js' module from '../../lib/'
const {
    videoConvert
} = await (await import('../../lib/converter.js'))

// Define the handler function that handles the 'hdvid' command
let handler = async (m, {
    conn,
    usedPrefix,
    args,
    command
}) => {
    // Switch statement to handle different cases based on the 'command' value
    switch (command) {
        case "hdvid": {
            // Set the 'conn.hdvid' property to an empty object if it doesn't exist,
            // or use the existing object
            conn.hdvid = conn.hdvid ? conn.hdvid : {};

            // Get the quoted message or the current message
            let q = m.quoted ? m.quoted : m

            // Get the message type ('mtype') or an empty string if it doesn't exist
            let mime = q.mtype || ""

            // Check if the message has a video mime type
            if (!mime)
                throw `Fotonya Mana...?`;

            // Check if the message mime type is a supported video format
            if (!/videoMessage/g.test(mime))
                throw `Mime ${mime} tidak support`;

            // Set the 'conn.hdvid' property for the current user to true
            conn.hdvid[m.sender] = true;

            // Reply to the user with the 'wait' message
            m.reply(wait);

            // Initialize the 'error' variable to false
            let error = false;

            try {
                // Define the additional FFmpeg options as an array of strings
                const additionalFFmpegOptions = [
                    '-c:v', 'libx264',
                    '-crf', args[2] || '20',
                    '-b:v', args[1] || '8M',
                    '-s', args[0] || '720x1280',
                    '-x264opts', 'keyint=30:min-keyint=30',
                ];

                // Download the video message as a buffer
                const videoBuffer = await q.download?.();

                // Define the additional arguments for the FFmpeg command as an array
                // of strings, including the additional FFmpeg options
                const additionalArgs = [
                    ...additionalFFmpegOptions,
                    '-q:v', args[3] || '30'
                ];

                // Convert the video message buffer using the FFmpeg command
                const buff = await video
