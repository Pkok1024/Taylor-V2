import axios from "axios";
import cheerio from "cheerio";
import moment from "moment-timezone";
import mimetype from "mime-types";
import qs from "qs";

async function shortener(url) {
  try {
    const response = await axios.post("https://caliphdev.net", qs.stringify({ url }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    const $ = cheerio.load(response.data);
    return $("#app-6 > input").attr("value");
  } catch (error) {
    console.error(error);
    return null;
  }
}

function igDown(urlMedia) {
  return new Promise(async (resolve, reject) => {
    const baseUrl = "https://instasupersave.com/";

    try {
      const response = await axios.get(baseUrl);
      const cookie = response.headers["set-cookie"][0].split(";")[0].replace("XSRF-TOKEN=", "").replace("%3D", "");

      const config = {
        method: "post",
        url: `${baseUrl}api/convert`,
        headers: {
          "origin": "https://instasupersave.com",
          "referer": "https://instasupersave.com/pt/",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.52",
          "x-xsrf-token": cookie,
          "Content-Type": "application/json",
          "Cookie": `XSRF-TOKEN=${cookie}; instasupersave_session=${cookie}`
        },
        data: {
          url: urlMedia
        }
      };

      const response2 = await axios(config);

      let ig = [];
      if (Array.isArray(response2.data)) {
        response2.data.forEach(post => {
          ig.push(post.sd === undefined ? post.thumb : post.sd.url)
        });
      } else {
        ig.push(response2.data.url[0].url)
      }

      resolve({
        results_number: ig.length,
        url_list: ig
      });
    } catch (error) {
      reject(error.message);
    }
  });
}

function pinterestvideodownloader(url) {
  return new Promise(async (resolve, reject) => {
    const baseUrl = "https://pinterestvideodownloader.com/";

    try {
      const response = await axios.post(baseUrl, qs.stringify({ url }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      const $ = cheerio.load(response.data);
      let results = [];

      $("table > tbody > tr").each((index, element) => {
        if ($(element).find("td").eq(0).text() !== "") {
          results.push({
            url: $(element).find("td").eq(0).find("a").attr("href")
          });
        }
      });

      if (results.length === 0) {
        reject({ status: false });
      } else {
        resolve({ status: true, data: results });
      }
    } catch (error) {
      reject(error.message);
    }
  });
}

async function mediafires(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const downloadButton = $("a#downloadButton");
    const link = downloadButton.attr("href");
    const fileName = link.split("/")[5];
    const fileExtension = fileName.split(".")[1];
    const fileMimeType = mimetype.lookup(fileExtension);
    const fileSize = downloadButton.text().replace("Download", "").replace("(", "").replace(")", "").replace("\n", "").replace("\n", "").trim();

    return {
      name: fileName,
      mime: fileMimeType,
      size: fileSize,
      link: link
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

function facebook(url) {
  return new Promise(async (resolve, reject) => {
    const baseUrl = "https://www.getfvid.com/downloader";

    try {
      const response = await axios.post(baseUrl, qs.stringify({ url }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: "https://www.getfvid.com/",
        }
      });

      const $ = cheerio.load(response.data);
      const title = $("body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-5.no-padd > div > h5 > a").text();
      const time = $("#time").text();
      const hd = $("body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-
