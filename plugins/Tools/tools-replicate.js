// Import required modules
import uploadFile from '../../lib/uploadFile.js'
import uploadImage from '../../lib/uploadImage.js'
import fetch from 'node-fetch'

// Define the handler function for the replicate command
const handler = async (m, {
    conn,
    usedPrefix,
    args,
    text,
    command
}) => {
    // Get the quoted message or the current message
    let q = m.quoted ? m.quoted : m
    // Get the mimetype of the media attached to the message
    let mime = (q.msg || q).mimetype || ''
    // If no media is found, throw an error
    if (!mime) throw 'No media found'
    // Download the media and store it in the variable media
    let media = await q.download()
    // Check if the media is a telegram media (image or video)
    let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
    // Upload the media to the specified service and get the link
    let link = await (isTele ? uploadImage : uploadFile)(media)
    // If link and text are present, continue to the next step
    if (link && text) {
        // Reply to the message with the 'wait' message
        m.reply(wait)
        // Call the Replicate function with the required parameters
        let hasil = await Replicate(link, text, "3a4886dd3230e523600d3b555f651dc82aba3a4e");
        // Send the generated result to the chat
        await conn.sendFile(m.chat, hasil.generated, "result", "ID:\n" + hasil.id, m)
    } else throw eror
}

// Specify the help, tags, and command for the handler function
handler.help = ['replicate']
handler.tags = ['internet', 'tools']
handler.command = /^replicate$/i

// Export the handler function as the default export
export default handler


// Define the Replicate function
const Replicate = async (imageUrl, prompt, ApiKey) => {
    try {
        // POST request to start the image restoration generation process
        let startResponse = await fetch(
            "https://api.replicate.com/v1/predictions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Token " + ApiKey,
                },
                body: JSON.stringify({
                    version: "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
                    input: {
                        image: imageUrl,
                        prompt: prompt
                    },
                }),
            }
        );
        // Parse the response as JSON
        let jsonStartResponse = await startResponse.json();
        // Get the endpoint URL for the image restoration process
        let endpointUrl = jsonStartResponse.urls.get;
        // Get the original image URL and the room ID from the response
        const originalImage = jsonStartResponse.input.image;
        const roomId = jsonStartResponse.id;
        // GET request to get the status of the image restoration process
        // and return the result when it's ready
        let generatedImage;
        while (!generatedImage) {
            // Loop in 1s intervals until the alt text is ready
            let finalResponse = await fetch(endpointUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Token " + ApiKey,
                },
            });
            let jsonFinalResponse = await finalResponse.json();
            // Check if the status is "succeeded"
            if (jsonFinalResponse.status === "succeeded") {
                // Get the generated image URL
                generatedImage = jsonFinalResponse.output[1];
            } else if (jsonFinalResponse.status === "failed") {
                // If the status is "failed", break the loop
                break;
            } else {
                // Wait for 1s before checking again
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
        // Return the result if the image restoration was successful
        if (generatedImage) {
            return {
                original: originalImage,
                generated: generatedImage,
                id: roomId
            }
        } else {
            // Log an error if the image restoration failed
            console.log("Failed to restore image");
        }
    } catch (error) {
        // Log an error if something went wrong
        console.log("Failed to restore image");
    }
}
