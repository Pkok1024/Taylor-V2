import axios from "axios"

const handler = async (m, { args }) => {
  if (!args[0]) throw "Please provide a place or location name."

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${args.join(
        "+"
      )}&units=metric&appid=YOUR_API_KEY`
    )

    const data = response.data
    const name = data.name
    const country = data.sys.country
    const weatherDescription = data.weather[0].description
    const temperature = `${data.main.temp}°C`
    const minTemperature = `${data.main.temp_min}°C`
    const maxTemperature = `${data.main.temp_max}°C`
    const humidity = `${data.main.humidity}%`
    const windSpeed = `${data.wind.speed} km/h`

    const weatherMessage = `「 📍 」 Place: ${name}
「 🗺️ 」 Country: ${country}
「 🌤️ 」 Weather: ${weatherDescription}
「 🌡️ 」 Temperature: ${temperature}
「 💠 」 Minimum Temperature: ${minTemperature}
「 📛 」 Maximum Temperature: ${maxTemperature}
「 💦 」 Humidity: ${humidity}
「 🌬️ 」 Wind: ${windSpeed}
`

    m.reply(weatherMessage)
  } catch (error) {
    if (error.response && error.response.status === 404) {
      m.reply("Error: Location not found.")
    } else {
      m.reply("Error: An unexpected error occurred.")
    }
  }
}

handler.help = ["weather"]
handler.tags = ["tools"]
handler.command = /^(weather)$/i

export default handler

