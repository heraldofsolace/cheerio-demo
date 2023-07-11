const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { stringify } = require("csv-stringify");

const filename = "scraped_data.csv";
const writableStream = fs.createWriteStream(filename);

const columns = [
  "title",
  "rating",
  "price",
  "availability"
];
const stringifier = stringify({ header: true, columns: columns });

axios.get("https://books.toscrape.com/").then((response) => {
    const $ = cheerio.load(response.data);

    $("article.product_pod").each( (i, element) => {
        const titleH3 = $(element).find("h3");
        const title = titleH3.find("a").text();
    
        const priceDiv = titleH3.next();
        const price = priceDiv.children().eq(0).text().trim();
        const availability = priceDiv.children().eq(1).text().trim();
        const ratingP = $(element).find("p.star-rating");
        const starRating = ratingP.attr('class');
        const rating = { One: 1, Two: 2, Three: 3, Four: 4, Five: 5 }[starRating.split(" ")[1]];

        console.log(title, price, availability, rating);

        const data = { title, rating, price, availability };
        stringifier.write(data);

    });

    stringifier.pipe(writableStream);

})