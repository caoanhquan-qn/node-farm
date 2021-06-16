const fs = require("fs");
const http = require("http");

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

// final data

const productList = dataJSON
  .map((item) => {
    const not_organic = item.organic ? "" : "not-organic";
    return card
      .replace("{%IMAGE%}", item.image)
      .replace("{%IMAGE%}", item.image)
      .replace("{%PRODUCTNAME%}", item.productName)
      .replace("{%NOT_ORGANIC%}", not_organic)
      .replace("{%QUANTITY%}", item.quantity)
      .replace("{%PRICE%}", item.price)
      .replace("{%ID%}", item.id);
  })
  .join("");
const finalOverview = overview.replace("{%PRODUCT_CARD%}", productList);
//SERVER
const server = http.createServer((req, res) => {
  const pathName = req.url;
  const id = pathName[pathName.length - 1];

  // overview/ root page
  if (pathName === "/overview" || pathName === "/") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(finalOverview);
  }
  // product page
  else if (pathName === `/product?id=${id}`) {
    const not_organic = dataJSON[id].organic ? "" : "not-organic";
    const finalProduct = product
      .replace("{%PRODUCTNAME%}", dataJSON[id].productName)
      .replace("{%IMAGE%}", dataJSON[id].image)
      .replace("{%NOT_ORGANIC%}", not_organic)
      .replace("{%IMAGE%}", dataJSON[id].image)
      .replace("{%IMAGE%}", dataJSON[id].image)
      .replace("{%IMAGE%}", dataJSON[id].image)
      .replace("{%IMAGE%}", dataJSON[id].image)
      .replace("{%IMAGE%}", dataJSON[id].image)
      .replace("{%IMAGE%}", dataJSON[id].image)
      .replace("{%IMAGE%}", dataJSON[id].image)
      .replace("{%IMAGE%}", dataJSON[id].image)
      .replace("{%IMAGE%}", dataJSON[id].image)
      .replace("{%PRODUCTNAME%}", dataJSON[id].productName)
      .replace("{%FROM%}", dataJSON[id].from)
      .replace("{%NUTRIENTS%}", dataJSON[id].nutrients)
      .replace("{%QUANTITY%}", dataJSON[id].quantity)
      .replace("{%PRICE%}", dataJSON[id].price)
      .replace("{%PRICE%}", dataJSON[id].price)
      .replace("{%DESCRIPTION%}", dataJSON[id].description);
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(finalProduct);
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
server.listen(8000, "127.0.0.1", () => {
  console.log("Server running on port 8000");
});
