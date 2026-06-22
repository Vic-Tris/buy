document.addEventListener("DOMContentLoaded",()=>{

const order =
JSON.parse(
localStorage.getItem("BUYIT_LAST_ORDER")
);

if(!order){

    window.location.href="index.html";
    return;

}

function money(amount){

    return "₦" + amount.toLocaleString();

}

document.getElementById("order-id")
.textContent =
order.orderId;

document.getElementById("customer-name")
.textContent =
order.customer;

document.getElementById("payment-method")
.textContent =
order.paymentMethod;

document.getElementById("order-total")
.textContent =
money(order.total);

});