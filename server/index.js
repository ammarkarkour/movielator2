// server/index.js
const express = require("express");
const puppeteer = require('puppeteer');

// scrap the web to get movie details
async function main(movie) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    

    // Open IMDB and serch for the movie
    await page.goto('https://www.imdb.com/', {waitUntil: 'load'}).catch(console.error);
    await page.evaluate((movie) => {
        (document.querySelector('[id="suggestion-search"]').value = movie);
        (document.querySelector('[id="suggestion-search-button"]').click());
    }, movie)

    // If results are found, then click on the first movie
    await page.waitForNavigation({waitUntil: 'load'}).catch(console.error);
    await page.evaluate(() => {
        const foundMovie = document.querySelector('[href="#tt"]');
        if (foundMovie){
            (document.querySelector('[class="result_text"]')).querySelector('[href]').click();
        } 
    })

    // get the movie information using structured data
    await page.waitForNavigation({waitUntil: 'load'}).catch(console.error);
    const result = await page.evaluate(() => {
        movieInfo = document.querySelector('[type="application/ld+json"]')
        if (movieInfo){ 
            return (JSON.parse(movieInfo.innerHTML));
        } 
        return {};
    })

    browser.close()
    return result
}

// set up server
const app = express();
const PORT = process.env.PORT || 3001;

// Server's API
app.get("/api/:movie", async (req, res) => {
    let result = await main(req.params["movie"]);
    res.send(result);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});