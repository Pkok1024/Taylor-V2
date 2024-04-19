import cp from 'child_process'    // Importing child_process module to run external commands
import {
    promisify
} from 'util'                   // Importing promisify utility to convert callback-style functions to promises

let exec = promisify(cp.exec).bind(cp) // Creating a promisified version of the exec function from child_process

// Defining the handler function for the osintmail command
let handler = async (m, {
    text,
    usedPrefix,
    command
}) => {
    // Check if the text argument is not empty
    if (!text) throw `Contoh :\n${usedPrefix + command} abc@example.com`

    // Check if the text argument is a valid email address
    if (!isMail(text)) throw `INVALID EMAIL`

    // Reply with a "wait" message to indicate that the command is being processed
    await conn.reply(m.chat, wait, m)

    // Extract the email address from the text argument
    let email = text

    let o
    try {
        // Run the Infoga tool with the "info" and "breach" options to get information about the email address
        o = await exec(`python py/Infoga/infoga.py --info ${email} --breach -v 3`)
    } catch (e) {
        // If there is an error, store it in the o variable
        o = e
    } finally {
        // Extract the stdout and stderr streams from the command output
        let {
            stdout,
            stderr
        } = o

        // If the stdout stream is not empty, reply with the output
        if (stdout.trim()) m.reply(stdout)

        // If the stderr stream is not empty, reply with the error message
        if (stderr.trim()) m.reply(stderr)
    }
}

// Adding command metadata
handler.help = ['osintmail']
handler.tags = ['python', 'sptools']
handler.command = /^(osintmail)$/i

// Exporting the handler function
