const fs = require("fs");
const path = require("path");

const htmlFiles = fs.readdirSync(".")
    .filter(file => file.endsWith(".html"))
    .filter(file =>
        ![
            "index.html",
            "about.html",
            "contact.html",
            "login.html",
            "cart.html",
            "product.html",
            "categories.html"
        ].includes(file)
    );

const products = [];

htmlFiles.forEach(file => {

    const html = fs.readFileSync(file, "utf8");

    const cardRegex =
        /<div class="animal">([\s\S]*?)<\/div>/g;

    let match;

    while ((match = cardRegex.exec(html)) !== null) {

        const card = match[1];

        const image =
            card.match(/<img[^>]*src="([^"]+)"/)?.[1] || "";

        const name =
            card.match(/<h1>(.*?)<\/h1>/)?.[1] || "";

        const price =
            card.match(/<p>(.*?)<\/p>/)?.[1] || "";

        const productId =
            card.match(/product\.html\?id=([^"]+)/)?.[1]
            || name.replace(/\s+/g, "-").toLowerCase();

        products.push({
            id: decodeURIComponent(productId),
            name,
            price,
            image,
            category: path.basename(file, ".html"),
            description: `${name} available on BuyIt`
        });
    }

});

fs.mkdirSync("./data", { recursive: true });

fs.writeFileSync(
    "./data/products.json",
    JSON.stringify(products, null, 2)
);

console.log(
    `Generated products.json with ${products.length} products`
);