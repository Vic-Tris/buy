document.addEventListener("DOMContentLoaded", ()=>{

let cart = JSON.parse(localStorage.getItem("BUYIT_CART")) || [];

const shippingTable = {
    Lagos:2000,
    Oyo:3000,
    Abuja:4000,
    Rivers:3500,
    Kano:3500,
    Enugu:3500,
    Others:5000
};

let discount = 0;

const checkoutItems = document.getElementById("checkout-items");
const subtotalLabel = document.getElementById("subtotal");
const shippingLabel = document.getElementById("shipping-fee");
const discountLabel = document.getElementById("discount-amount");
const totalLabel = document.getElementById("grand-total");

function money(amount){
    return "₦" + amount.toLocaleString();
}

function renderSummary(){

    checkoutItems.innerHTML="";

    let subtotal=0;

    cart.forEach(item=>{

        subtotal += item.price * item.quantity;

        checkoutItems.innerHTML += `
        <div class="checkout-item">

            <img src="${item.image}">

            <div>
                <h4>${item.name}</h4>
                <p>${item.quantity} × ${money(item.price)}</p>
            </div>

        </div>
        `;
    });

    const state =
    document.getElementById("customer-state").value;

    const shipping =
    shippingTable[state] || shippingTable.Others;

    const discountAmount = subtotal * discount;

    const grandTotal =
    subtotal + shipping - discountAmount;

    subtotalLabel.textContent = money(subtotal);

    shippingLabel.textContent = money(shipping);

    discountLabel.textContent =
    "-" + money(discountAmount);

    totalLabel.textContent = money(grandTotal);

}

renderSummary();


document
.getElementById("customer-state")
.addEventListener("change",renderSummary);



document
.getElementById("apply-coupon")
.addEventListener("click",()=>{

const code =
document.getElementById("coupon-code")
.value
.trim()
.toUpperCase();

if(code==="SAVE10"){
    discount=.10;
    alert("10% discount applied");
}
else if(code==="SUPERBUY"){
    discount=.20;
    alert("20% discount applied");
}
else{
    discount=0;
    alert("Invalid coupon");
}

renderSummary();

});



document
.getElementById("place-order-btn")
.addEventListener("click",()=>{

const name =
document.getElementById("customer-name").value;

const email =
document.getElementById("customer-email").value;

const phone =
document.getElementById("customer-phone").value;

const state =
document.getElementById("customer-state").value;

const city =
document.getElementById("customer-city").value;

const address =
document.getElementById("customer-address").value;

if(
!name ||
!email ||
!phone ||
!city ||
!address
){
    alert("Please complete all fields");
    return;
}


const orderId =
"BUYIT-" +
Math.floor(
100000 + Math.random()*900000
);

let subtotal=0;

cart.forEach(item=>{
subtotal += item.price * item.quantity;
});

const shipping =
shippingTable[state];

const total =
subtotal + shipping - subtotal*discount;

const paymentMethod =
document.querySelector(
'input[name="payment"]:checked'
).value;


const order = {

orderId,

customer:name,

email,

phone,

state,

city,

address,

paymentMethod,

items:cart,

subtotal,

shipping,

discount,

total

};


let orders =
JSON.parse(
localStorage.getItem("BUYIT_ORDERS")
) || [];

orders.push(order);

localStorage.setItem(
"BUYIT_ORDERS",
JSON.stringify(orders)
);


localStorage.setItem(
"BUYIT_LAST_ORDER",
JSON.stringify(order)
);


localStorage.removeItem(
"BUYIT_CART"
);


window.location.href =
"success.html";


});

});