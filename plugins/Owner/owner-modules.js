// Import required modules
import child_process from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

// Promisify the exec method from child_process module
let exec = promisify(child_process.exec).bind(child_process);

/**
 * Handler function for the 'modules' command
 * @param {Object} m - The message object
 * @param {Object} options - Options object containing:
 *    - conn: The connection object
 *    - isOwner: Boolean indicating if the command was sent by the bot owner
 *    - command: The command string
 *    - text: The text after the command
 */
let handler = async (m, { conn, isOwner, command, text }) => {
    // Check if the bot is not the owner of the current session
    if (global.conn.user.jid != conn.user.jid) return;

    // Reply with 'Executing...'
    m.reply('Executing...');

    // Define the compressed file path
    const compressedFilePath = 'node_modules.tar.gz';

    // Check if the compressed file exists
    if (!fs.existsSync(compressedFilePath)) {
        try {
            // Try to compress the 'node_modules' folder
            await exec('tar -czf node_modules.tar.gz node_modules');
            // Reply with success message
            m.reply('Successfully created node_modules.tar.gz!');
        } catch (e) {
            // If compression fails, reply with an error message and stop execution
            m.reply('Failed to create node_modules.tar.gz');
            return;
        }
    } else {
        m.reply('node_modules.tar.gz already exists, skipping creation...');
    }

    // Check again if the file exists after compression attempt
    if (fs.existsSync(compressedFilePath)) {
        // Read the compressed file data
        const compressedData = fs.readFileSync(compressedFilePath);

        // Send the compressed file as a document
        await conn.sendMessage(
            m.chat, {
                document: compressedData,
                mimetype: 'application/gz',
                fileName: 'node_modules.tar.gz',
            }, {
                quoted: m,
            }
        );
    } else {
        m.reply('File not found. Compression may have failed.');
