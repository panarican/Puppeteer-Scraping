const puppeteer = require('puppeteer');
const fs = require('fs');
const csv = fs.createWriteStream('report.csv', {
    flags: 'a'
});

/**
 * Scrape with Puppeteer
 */
(async () => {
    // Browser Setup
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to login page
    await page.goto('https://www.example.com/sign-in');

    // Fill in form
    await page.type('#email', 'example@example.com');
    await page.type('#password', '123456');

    // Submit form
    await Promise.all([
        page.waitForSelector('.reports-count'), // page.waitForNavigation() works if you just want to wait for page load
        page.$eval('#signinForm', form => form.submit())
    ]);

    // CSV values
    const formattedDate = getFormattedDate(new Date());
    const reportsCount = await page.$eval('.reports-count', el => +el.innerText.split(',').join(''));

    // Write CSV
    csv.write(`${formattedDate},${reportsCount}\n`);

    // Close Browser
    await browser.close();

    // Close CSV
    await csv.end();
})();

/**
 * Get the formatted date for the csv
 * @param {Date} date
 * @returns {string}
 */
function getFormattedDate(date) {
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = (date.getMonth()+1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
