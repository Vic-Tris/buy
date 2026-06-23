document.addEventListener("DOMContentLoaded", ()=>{

    const placeOrderBtn =
        document.getElementById("place-order-btn");

    if(!placeOrderBtn) return;

    placeOrderBtn.addEventListener("click", ()=>{

        const customerName =
            document.getElementById("customer-name").value;

        const customerEmail =
            document.getElementById("customer-email").value;

        const customerPhone =
            document.getElementById("customer-phone").value;

        const customerAddress =
            document.getElementById("customer-address").value;

        const paymentMethod =
            document.querySelector(
                'input[name="payment"]:checked'
            ).value;

        if(
            !customerName ||
            !customerEmail ||
            !customerPhone ||
            !customerAddress
        ){
            alert("Please complete all fields.");
            return;
        }

        let total =
            Number(
                localStorage.getItem("BUYIT_FINAL_TOTAL")
            ) || 0;

        if(paymentMethod === "Cash On Delivery"){

            saveOrder(
                customerName,
                paymentMethod,
                total
            );

            window.location.href = "success.html";
            return;
        }

        if(paymentMethod === "Bank Transfer"){

            alert(
`Transfer ₦${total.toLocaleString()}

Bank : Opay
Account Name : Victoria Olayemi Alao
Account Number : 8060275647`
            );

            saveOrder(
                customerName,
                paymentMethod,
                total
            );

            window.location.href="success.html";

            return;
        }

        if(paymentMethod === "Paystack"){

            let handler = PaystackPop.setup({

               key:"pk_test_abcdef123456789"

                email: customerEmail,

                amount: total * 100,

                currency: "NGN",

                channels: [
                    "bank_transfer",
                    "ussd"
                ],

                metadata:{
                    custom_fields:[
                        {
                            display_name:"Customer Name",
                            variable_name:"customer_name",
                            value:customerName
                        }
                    ]
                },

                callback:function(response){

                    saveOrder(
                        customerName,
                        "Paystack",
                        total
                    );

                    window.location.href =
                        "success.html";

                },

                onClose:function(){

                    alert(
                        "Payment cancelled."
                    );

                }

            });

            handler.openIframe();

        }

    });

});

function saveOrder(customer,payment,total){

    let cart =
        JSON.parse(localStorage.getItem("BUYIT_CART")) || [];

    let orderId = "BUYIT-" + Date.now();

    const order = {

        orderId,

        customer,

        paymentMethod: payment,

        total,

        date: new Date().toLocaleString(),

        status: "Processing",

        products: cart

    };

    let orders =
        JSON.parse(localStorage.getItem("BUYIT_ORDERS"))
        || [];

    orders.unshift(order);

    localStorage.setItem(
        "BUYIT_ORDERS",
        JSON.stringify(orders)
    );

    localStorage.setItem(
        "BUYIT_LAST_ORDER",
        JSON.stringify(order)
    );

    localStorage.removeItem("BUYIT_CART");

}
    localStorage.setItem(
        "BUYIT_LAST_ORDER",
        JSON.stringify(order)
    );

    let orders =
        JSON.parse(
            localStorage.getItem("BUYIT_ORDERS")
        ) || [];

    orders.unshift(order);

    localStorage.setItem(
        "BUYIT_ORDERS",
        JSON.stringify(orders)
    );

    localStorage.removeItem(
        "BUYIT_CART"
    );

}