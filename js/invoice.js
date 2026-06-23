document.addEventListener("DOMContentLoaded",()=>{

let order =
JSON.parse(localStorage.getItem("BUYIT_LAST_ORDER"));

if(!order) return;

document.getElementById("invoice-body").innerHTML=`

<h2>${order.orderId}</h2>

<p>Date : ${order.date}</p>

<p>Customer : ${order.customer}</p>

<p>Payment : ${order.paymentMethod}</p>

<hr>

${order.products.map(product=>`

<div class="invoice-item">

<img src="${product.image}">

<div>

<h3>${product.name}</h3>

<p>

Qty : ${product.quantity}

</p>

</div>

</div>

`).join("")}

<hr>

<h2>

Total :

₦${Number(order.total).toLocaleString()}

</h2>

`;

});