import axios from "axios";
import cheerio from "cheerio";

const listSurah = async (): Promise<{listsurah: string[]}> => {
  try {
    const { data } = await axios.get("https://litequran.net/");
    const $ = cheerio.load(data);
    const surahs = $("main > ol.list > li > a")
      .map((_, element) => $(element).text())
      .get();
    return { listsurah: surahs };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch surah list" };
  }
};

const surahByName = (surahName: string): string => {
  if (!surahName) {
    throw new Error("Invalid surah name");
  }
  return surahName.toLowerCase().replace(/\s/g, '-');
};

const surah = async (surahName: string): Promise<{surah: {arab: string, latin: string, translate: string}[]}> => {
  try {
    const sanitizedSurahName = surahByName(surahName);
    const { data } = await axios.get(`https://litequran.net/${sanitizedSurahName}`);
    const $ = cheerio.load(data);
    const verses = $("main > article > ol.surah > li")
      .map((_, element) => ({
        arab: $(element).find("p.arabic").text() || '',
        latin: $(element).find("p.translate").text() || '',
        translate: $(element).find("p.meaning").text() || '',
      }))
      .get();
    return { surah: verses };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch surah" };
  }
};

const tafsirSurah = async (surahName: string): Promise<{tafsirList: {surah: string, tafsir: string, type: string, source: string}[]}> => {
  try {
    const sanitizedSurahName = surahByName(surahName);
    const { data } = await axios.get(`https://tafsirq.com/topik/${sanitizedSurahName}`);
    const $ = cheerio.load(data);
    const tafsirs = $("div.panel.panel-default")
      .map((_, element) => {
        const heading = $(element).find("div.panel-heading.panel-choco > div.row > div.col-md-12");
        const body = $(element).find("div.panel-body.excerpt");
        return {
          surah: heading.find("a.title-header").text() || '',
          tafsir: body.text().trim() || '',
          type: heading.find("span.label").text() || '',
          source: heading.find("a.title-header").attr("href") || '',
        };
      })
      .get();
    return { t
