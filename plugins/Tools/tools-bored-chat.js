import axios from 'axios';
import {
    FormData
} from 'formdata-node';

// An array of celebrity options to choose from
const celebrityOptions = [
    'Homer Simpson from The Simpsons',
    'The Rock (Dwayne Johnson)',
    'Joe Rogan from The Joe Rogan Experience',
    'Darth Vader from Star Wars',
    'The rapper Snoop Dogg',
    'radio host Howard Stern',
    'Tony Stark (Iron Man)',
    'Peter Griffin from Family Guy',
    'Elon Musk ',
    'Spongebob Squarepants',
    'Sherlock Holmes',
    'Batman',
    'Jimmy Fallon',
    'Socrates',
    'Santa Claus'
];

// An async function to post data to the API endpoint
const postData = async (index, input) => {
    try {
        // Select the celebrity based on the provided index
        const selectedCelebrity = celebrityOptions[index];

        // Create a new FormData instance
        const formData = new FormData();

        // Append the necessary fields to the FormData instance
        formData.append('message', input);
        formData.append('intro', selectedCelebrity);
        formData.append('name', selectedCelebrity);

        // Post the FormData instance to the API endpoint
        const response2 = await axios.post('https://boredhumans.com/api_celeb_chat.php', formData);

        // Return the response data
        return response2.data;
    } catch (error) {
        // Log any errors and throw them to be handled by the calling function
        console.error('Error:', error);
        throw error;
    }
};

// The main function that handles the command
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    try {
        let text;

        // Check if the user provided any arguments
        if (args.length >= 1) {
            text = args.slice(0).join(" ");
        } else if (m.quoted && m.quoted.text) {
            text = m.quoted.text;
        } else {
            // If no arguments are provided, display a list of available celebrities
            console.log('Select a celebrity by entering the corresponding number:');
            const celebrityList = celebrityOptions.map((celebrity, index) => `${index + 1}. ${celebrity}`);
            const listMessage = `Select a celebrity:\n${celebrityList.join('\n')}`;
            await m.reply(listMessage);
            return;
        }

        // Reply with a "waiting" message while processing the request
        await m.reply(wait);

        // Split the user input into an array of two parts: the celebrity index and the user message
        const inputArray = text.split('|');

        // Check if the input format is valid
        if (inputArray.length !== 2) {
            const errorMessage = 'Invalid input format. Please use "index|input".';
            await m.reply(errorMessage);
            const helpMessage = 'Please use the format: index|input. For example: 3|Hello';
            await m.reply(helpMessage);
        } else {
            const selectedIndex = parseInt(inputArray[0]);
            const userInput = inputArray[1];

            // Check if the provided index is valid
            if (!isNaN(selectedIndex) && selectedIndex >= 1 && selectedIndex <= celebrityOptions.length) {
                // Call the postData function with the provided index and user message
                const result = await postData(selectedIndex - 1, userInput);

                // Reply with the API response
                await m.reply(result.output);
            } else {
                // If the provided index is invalid, display an error message
                const errorMessage = 'Invalid selection. Please enter a valid number.';
                await m.reply(errorMessage);
                const helpMessage = 'Please use the format: index|input. For example: 3|Hello';
                await m.reply(helpMessage);
            }
        }
    } catch (error) {
        // Log any errors and reply with the error message
        console.error('Error in main code:', error);
        await m.reply(`Error: ${error}`);
    }
};

// Add command-specific metadata
handler.help = ["boredchat"];
handler.tags = ["tools"];
handler.command = /^(boredchat)$/i;

// Export the handler function
export default handler;
