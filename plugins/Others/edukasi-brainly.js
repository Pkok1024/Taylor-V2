import * as baileys from "@whiskeysockets/baileys" // Importing baileys library
import {
    Brainly
} from "brainly-scraper-v2" // Importing Brainly class from brainly-scraper-v2 library
import fetch from "node-fetch" // Importing fetch function from node-fetch library

// Initialize Brainly class with the user's ID
Brainly.initialize();
const brainly = new Brainly("id");

// Define the handler function for the brainly command
const handler = async (m, {
    conn,
    text
}) => {
    // Throw an error if the user doesn't input a query
    if (!text) throw "Input Query"

    // Reply to the user with a loading message
    await m.reply(wait)

    try {
        // Search for the user's query on Brainly
        let res = await brainly.search(text, "id")

        // Extract the question and answers from the search results
        let answer = res.map(({
            question,
            answers
        }, i) => `
*Pertanyaan*${question.grade ? ` (${question.grade})` : ''}\n${question.content.replace(/(<br \/>)/gi, '\n')}${answers.map((v, i) => `
*Jawaban Ke ${i + 1}*${v.verification ? ' (Verified)' : ''}${v.isBest ? ' (Best)' : ''}
${v.content.replace(/(<br \/>)/gi, '\n')
          .replace(/(<([^>]+)>)/gi, '')}${v.attachments.length > 0 ? `\n*Media Url*: ${v.attachments.join(', ')}` : ''}`).join``}`).join('\n' + '-'.repeat(45))

        // Reply to the user with the search results
        await m.reply(answer.trim())
    } catch (e) {
        // If there's an error,
