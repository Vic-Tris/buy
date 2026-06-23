const currentUser =
JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER"));

orders = orders.filter(
    order => order.userEmail === currentUser.email
);

if (!currentUser) {
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded",()=>{

const container =
document.getElementById("orders-container");

let orders =
JSON.parse(localStorage.getItem("BUYIT_ORDERS"))
|| [];


if(orders.length===0){

container.innerHTML=`

<div class="empty-orders">

<h2>No Orders Yet</h2>

<a href="index.html">
Start Shopping
</a>

</div>
`;

return;

}

container.innerHTML = orders.map(order=>`

<div class="order-card">

<div class="order-header">

<div>

<h3>${order.orderId}</h3>

<p>${order.date}</p>

<div class="status-wrapper">

<span class="status">
${order.status}
</span>

<div class="tracker">

<div class="step ${order.status==="Processing"||order.status==="Shipped"||order.status==="Delivered"?"active":""}">
1
</div>

<div class="line ${order.status==="Shipped"||order.status==="Delivered"?"active":""}">
</div>

<div class="step ${order.status==="Shipped"||order.status==="Delivered"?"active":""}">
2
</div>

<div class="line ${order.status==="Delivered"?"active":""}">
</div>

<div class="step ${order.status==="Delivered"?"active":""}">
3
</div>

</div>

<div class="tracker-labels">

<span>Processing</span>

<span>Shipped</span>

<span>Delivered</span>

</div>

</div>

<div class="products-list">

${order.products.map(product=>`

<div class="ordered-product">

<img src="${product.image}">

<div>

<h4>${product.name}</h4>

<p>

Qty : ${product.quantity}

</p>

</div>

</div>

`).join("")}

</div>


<div class="order-footer">

<div>

<strong>Payment:</strong>

${order.paymentMethod}

</div>

<div>

<strong>Total:</strong>

₦${Number(order.total).toLocaleString()}

</div>

<button
class="buy-again-btn"
onclick="buyAgain('${order.orderId}')">

Buy Again

</button>

</div>

</div>

`).join("");

});

window.buyAgain = function(orderId){

let orders =
JSON.parse(localStorage.getItem("BUYIT_ORDERS"))
|| [];

let order =
orders.find(
o=>o.orderId===orderId
);

if(!order) return;

localStorage.setItem(

"BUYIT_CART",

JSON.stringify(order.products)

);

alert("Products added to cart.");

window.location.href="cart.html";

}
