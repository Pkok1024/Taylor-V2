import fetch from 'node-fetch'  // Importing the 'node-fetch' module to make HTTP requests

let handler = async (m, {  // Defining the async handler function with 'm' as the Message object and 'conn' as the connection object
    conn,
    usedPrefix,

