const puppeteer = require("puppeteer");

const BASE_URL = "https://www.instagram.com/";

const chrome = {
  browser: null,
  page: null,

  initialize: async () => {
    chrome.browser = await puppeteer.launch({
      headless: false,
    });
    chrome.page = await chrome.browser.newPage();
    await chrome.page.goto(BASE_URL, { waitUtil: "networkidle2" });
  },
};

chrome.initialize();
