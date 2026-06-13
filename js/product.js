const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

fetch("./data/products.json")
  .then(response => response.json())
  .then(products => {

    const product = products.find(
      p => p.id === productId
    );

    if (!product) {
      document.querySelector(".product-page").innerHTML = `
        <h1>Product Not Found</h1>
      `;
      return;
    }

    document.getElementById("product-name").textContent =
      product.name;

    document.getElementById("product-price").textContent =
      product.price;

    document.getElementById("product-image").src =
      product.image;

    document.getElementById("product-description").textContent =
      product.description;
  })
  .catch(error => {
    console.error(error);
  });