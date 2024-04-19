// Importing the 'node-fetch' module to make HTTP requests
import fetch from 'node-fetch'

// Defining the timeout duration for the question in milliseconds
let timeout = 120000;

// Defining the number of points awarded for answering the question
let poin = 4999;

// Defining the handler function for the 'question' command
const handler = async (m, {
    conn, // The Bot's connection object
    text, // The user's input after the command
    command, // The actual command used by the user
    usedPrefix // The prefix used by the user to call the command
}) => {
    // Generating a random image URL for the question
    let imgr = flaaa.getRandom()

    // Checking if the 'conn.question' object exists and initializing it if it doesn't
    conn.question = conn.question ? conn.question : {}

    // Getting the ID of the current chat
    let id = m.chat

    // Checking if the user hasn't provided any input after the command
    if (!text)
        // Replying with the correct usage of the command
        return m.reply(
            `Please use this command like this: ${usedPrefix}question easy/medium/hard`
        );

    // Checking if the current chat already has an unanswered question
    if (id in conn.question) {
        // Replying with a message indicating that there's already an unanswered question in the chat
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.question[id][0])
        // Throwing an error to stop the execution of the function
        throw false
    }

    // Making a request to the Open Trivia Database API to get a random question based on the user's input
    let src = await (await fetch("https://opentdb.com/api.php?amount=1&difficulty=" + text + "&type=multiple")).json()
    let json = src

    // Creating the caption for the question message
    let caption = `            *『  Question Answers  』*\n\n🎀  *Category:* ${json.results[0].category}\n❄  *Difficulty:* ${json.results[0].difficulty}\n\n📒  *Question:* ${json.results[0].question}
  
Timeout *${(timeout / 1000).toFixed(2)} detik*
