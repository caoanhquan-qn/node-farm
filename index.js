const fs = require("fs");
const http = require("http");
const url = require("url");
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// READ FILES
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataJSON = JSON.parse(data);

const card = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const overview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const product = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8");

const page_not_found = fs.readFileSync(
  `${__dirname}/templates/404.html`,
  "utf-8"
);

// replace all card data
const replaceAllData = function (tempHtml, itemObj) {
  return tempHtml
    .replace(/{%IMAGE%}/g, itemObj.image)
    .replace(/{%PRODUCTNAME%}/g, itemObj.productName)
    .replace(/{%NOT_ORGANIC%}/g, itemObj.organic ? "" : "not-organic")
    .replace(/{%FROM%}/g, itemObj.from)
    .replace(/{%NUTRIENTS%}/g, itemObj.nutrients)
    .replace(/{%QUANTITY%}/g, itemObj.quantity)
    .replace(/{%PRICE%}/g, itemObj.price)
    .replace(/{%ID%}/g, itemObj.id)
    .replace(/{%DESCRIPTION%}/g, itemObj.description);
};

// final data

const productList = dataJSON.map((item) => replaceAllData(card, item)).join("");
const finalOverview = overview.replace("{%PRODUCT_CARD%}", productList);

//SERVER
const server = http.createServer((req, res) => {
  const pathName = req.url;
  const { query, search } = url.parse(pathName, true);

  // overview/ root page
  if (pathName === "/overview" || pathName === "/") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(finalOverview);
  }
  // product page
  else if (pathName === `/product${search}`) {
    const { id } = query;
    const eachProduct = replaceAllData(product, dataJSON[id]);
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(eachProduct);
  }
  // api page
  else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  }
  // page not found
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end(page_not_found);
  }
});

const port = process.env.PORT || 8000;
server.listen(port, "127.0.0.1", () => {
  console.log("Server running on port 8000");
});
