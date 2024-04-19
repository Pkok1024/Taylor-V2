// This is a function that handles setting a handler for a specific plugin parameter
const handler = async (m, {
    conn, // the connection object
    args // the arguments passed to the function
}) => {
    try {
        // Destructure the arguments into index, paramName, and paramValue
        const [index, paramName, paramValue] = args;

        // Get the list of all available plugins
        const keys = Object.keys(global.plugins);

        // Check if all required arguments are present
        if (!index || !paramName || !paramValue) {
            // If not, display the usage instructions and return
            const usage = "Example usage: handler 1 owner true\n\nAvailable plugins:\n" +
                keys.map((key, index) => `*${index + 1}.* ${key.split('/').pop().slice(0, -3)}`).join('\n');
            await conn.reply(m.chat, usage, m);
            return;
        }

        // Get the specific plugin based on the index
        const key = keys[parseInt(index) - 1];

        // Check if the plugin exists
        if (!key) {
            await conn.reply(m.chat, `Invalid index`, m);
            return;
        }

        // Get the plugin object
        const plugin = global.plugins[key];

        // Check if the plugin exists
        if (!plugin) {
            await conn.reply(m.chat, `Plugin not found`, m);
            return;
        }

        // Check if the specified parameter exists in the plugin
        if (plugin[paramName] !== undefined) {
            // If it does, update its value
            await conn.reply(m.chat, `Changing existing parameter ${paramName} in ${key.split('/').pop().slice(0, -3)}`, m);
        }

        // Parse the parameter value
        let parsedValue;
        if (/^(true|false|null|undefined)$/i.test(paramValue)) {
            parsedValue = eval(paramValue);
        } else {
            try {
                parsedValue = JSON.parse(paramValue);
            } catch (error) {
                parsedValue = paramValue;
            }
        }

        // Set the new parameter value
        plugin[paramName] = parsedValue;

        // Update the global plugins object
        global.plugins[key] = plugin;

        // Confirm that the parameter has been added
        await conn.reply(m.chat, `Added parameter ${paramName}: ${parsedValue} to ${key.split('/').pop().slice(0, -3)}`, m);
    } catch (error) {
        // Log any errors
        console.error(error.message);

        // Display an error message
        await conn.reply(m.chat, 'Error while adding parameter', m);
    }
};

// Set the help, tags, command, owner, and private properties of the handler function
handler.help = ["handler"];
handler.tags = ["owner"];
handler.command = /^set?handler$/i
