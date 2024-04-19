import axios from "axios"

// The API key for Flickr API
const api_Key = "636e1481b4f3c446d26b8eb6ebfe7127";

// The base URL for Flickr API
const URL = "https://farm66.staticflickr.com";

// The function to handle the command
const handler = async (m, {
    conn,
    isOwner,
    usedPrefix,
    command,
    args
}) => {
    // The query to search for on Flickr
    let query = "input text\nEx. .flickr hello world\n<command> <tex>";
    
    // The text to search for
    let text;
    if (args.length >= 1) {
        // If there are arguments, join them together to form the text
        text = args.slice(0).join(" ");
    } else if (m.quoted && m.quoted.text) {
        // If there is a quoted message, use its text as the search text
        text = m.quoted.text;
    } else {
        // If there is no text, throw an error with the query syntax
        throw query;
    }

    try {
        // Reply to the message with a "wait" message
        m.reply(wait);
        
        // Search for the topic and get a random image
        var imge = await searchTopic(text);
        var rand = imge.getRandom();
        
        // Construct the URL for the random image
        var resul = "https://farm66.staticflickr.com/" + rand.server + "/" + rand.id + "_" + rand.secret + ".jpg";
        
        // Send the image as a file with a caption
        conn.sendFile(m.chat, resul, "result", "Result Flickr: *" + text.toUpperCase() + "*", m);
    } catch (e) {
        // If there is an error, throw an error message
        throw eror;
