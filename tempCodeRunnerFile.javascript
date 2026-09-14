// ===============================
// NISHBITES APP.JS
// ===============================


// CART
let cart = [];


// ===============================
// ADD ITEM TO CART
// ===============================

function addToCart(name, price) {

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCart();

    alert(name + " added to cart! 🛒");
}


// ===============================
// UPDATE CART
// ===============================

function updateCart() {

    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    let totalQuantity = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;
    });


    // Cart number
    if (cartCount) {
        cartCount.innerText = totalQuantity;
    }


    // Cart items
    if (cartItems) {

        if (cart.length === 0) {

            cartItems.innerHTML =
                "<p>Your cart is empty.</p>";

        } else {

            cartItems.innerHTML = "";

            cart.forEach((item, index) => {

                const div = document.createElement("div");

                div.className = "cart-item";

                div.innerHTML = `
                    <strong>${item.name}</strong>
                    <br>
                    ₹${item.price} × ${item.quantity}

                    <button onclick="removeFromCart(${index})">
                        ❌
                    </button>
                `;

                cartItems.appendChild(div);

            });
        }
    }


    // Total price
    if (cartTotal) {
        cartTotal.innerText = totalPrice;
    }
}


// ===============================
// REMOVE FROM CART
// ===============================

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();
}


// ===============================
// SHOW CART
// ===============================

function showCart() {

    const cartBox = document.getElementById("cartBox");

    if (cartBox) {
        cartBox.style.display = "flex";
    }

    updateCart();
}


// ===============================
// CLOSE CART
// ===============================

function closeCart() {

    const cartBox = document.getElementById("cartBox");

    if (cartBox) {
        cartBox.style.display = "none";
    }
}


// ===============================
// PLACE ORDER
// ===============================

function placeOrder() {

    if (cart.length === 0) {

        alert("Your cart is empty! Please add some food first. 🍔");

        return;
    }


    let customerName =
        prompt("Enter your name:");

    if (!customerName) {
        return;
    }


    let phone =
        prompt("Enter your phone number:");

    if (!phone) {
        return;
    }


    let address =
        prompt("Enter your delivery address:");

    if (!address) {
        return;
    }


    let total = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;

    });


    // Create order
    const order = {

        id: "NB" + Date.now(),

        customer: customerName,

        phone: phone,

        address: address,

        items: cart,

        total: total,

        status: "Pending",

        date: new Date().toLocaleString()

    };


    // Get old orders
    let orders =
        JSON.parse(localStorage.getItem("nishbitesOrders")) || [];


    // Add new order
    orders.push(order);


    // Save order
    localStorage.setItem(
        "nishbitesOrders",
        JSON.stringify(orders)
    );


    alert(
        "🎉 Order placed successfully!\n\n" +
        "Order ID: " + order.id +
        "\nTotal: ₹" + total
    );


    // Empty cart
    cart = [];

    updateCart();

    closeCart();
}


// ===============================
// SCROLL TO MENU
// ===============================

function scrollToMenu() {

    const menu =
        document.getElementById("menu");

    if (menu) {

        menu.scrollIntoView({
            behavior: "smooth"
        });

    }
}


// ===============================
// FILTER FOOD
// ===============================

function filterFood(category) {

    const foods =
        document.querySelectorAll(".food-card");


    foods.forEach(food => {

        if (
            category === "all" ||
            food.classList.contains(category)
        ) {

            food.style.display = "block";

        } else {

            food.style.display = "none";

        }

    });
}


// ===============================
// LOGIN
// ===============================

function loginUser(event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value;

    const phone =
        document.getElementById("phone").value;

    const password =
        document.getElementById("password").value;


    if (!name || !phone || !password) {

        alert("Please fill all fields.");

        return;
    }


    if (phone.length !== 10) {

        alert("Please enter a valid 10-digit phone number.");

        return;
    }


    // Save customer information
    const customer = {

        name: name,

        phone: phone

    };


    localStorage.setItem(
        "nishbitesCustomer",
        JSON.stringify(customer)
    );


    const message =
        document.getElementById("loginMessage");


    if (message) {

        message.innerText =
            "Login successful! 🎉";

    }


    alert(
        "Welcome to NishBites, " +
        name +
        "! 🍔"
    );


    // Go to home page
    setTimeout(function () {

        window.location.href = "index.html";

    }, 1000);
}


// ===============================
// LOAD ORDERS FOR ADMIN
// ===============================

function loadOrders() {

    const ordersTable =
        document.getElementById("ordersTable");


    if (!ordersTable) {
        return;
    }


    const orders =
        JSON.parse(
            localStorage.getItem("nishbitesOrders")
        ) || [];


    if (orders.length === 0) {

        ordersTable.innerHTML = `
            <tr>
                <td colspan="7">
                    No orders yet.
                </td>
            </tr>
        `;

        updateAdminStats();

        return;
    }


    ordersTable.innerHTML = "";


    orders.forEach((order, index) => {

        let itemsText = "";

        order.items.forEach(item => {

            itemsText +=
                item.name +
                " × " +
                item.quantity +
                "<br>";

        });


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${order.id}</td>

            <td>${order.customer}</td>

            <td>${order.phone}</td>

            <td>${itemsText}</td>

            <td>₹${order.total}</td>

            <td>

                <select
                    onchange="changeOrderStatus(${index}, this.value)"
                >

                    <option
                        value="Pending"
                        ${order.status === "Pending" ? "selected" : ""}
                    >
                        Pending
                    </option>

                    <option
                        value="Preparing"
                        ${order.status === "Preparing" ? "selected" : ""}
                    >
                        Preparing
                    </option>

                    <option
                        value="Out for Delivery"
                        ${order.status === "Out for Delivery" ? "selected" : ""}
                    >
                        Out for Delivery
                    </option>

                    <option
                        value="Delivered"
                        ${order.status === "Delivered" ? "selected" : ""}
                    >
                        Delivered
                    </option>

                </select>

            </td>

            <td>

                <button
                    onclick="deleteOrder(${index})"
                >
                    🗑️ Delete
                </button>

            </td>

        `;


        ordersTable.appendChild(row);

    });


    updateAdminStats();
}


// ===============================
// UPDATE ADMIN STATISTICS
// ===============================

function updateAdminStats() {

    const orders =
        JSON.parse(
            localStorage.getItem("nishbitesOrders")
        ) || [];


    let totalSales = 0;


    orders.forEach(order => {

        totalSales += Number(order.total);

    });


    const totalOrders =
        document.getElementById("totalOrders");

    const totalSalesElement =
        document.getElementById("totalSales");

    const totalCustomers =
        document.getElementById("totalCustomers");


    if (totalOrders) {

        totalOrders.innerText =
            orders.length;

    }


    if (totalSalesElement) {

        totalSalesElement.innerText =
            totalSales;

    }


    const customers =
        new Set(
            orders.map(order => order.phone)
        );


    if (totalCustomers) {

        totalCustomers.innerText =
            customers.size;

    }
}


// ===============================
// CHANGE ORDER STATUS
// ===============================

function changeOrderStatus(index, status) {

    let orders =
        JSON.parse(
            localStorage.getItem("nishbitesOrders")
        ) || [];


    if (!orders[index]) {
        return;
    }


    orders[index].status = status;


    localStorage.setItem(
        "nishbitesOrders",
        JSON.stringify(orders)
    );


    alert(
        "Order status changed to: " +
        status
    );


    loadOrders();
}


// ===============================
// DELETE ORDER
// ===============================

function deleteOrder(index) {

    if (
        !confirm(
            "Are you sure you want to delete this order?"
        )
    ) {

        return;
    }


    let orders =
        JSON.parse(
            localStorage.getItem("nishbitesOrders")
        ) || [];


    orders.splice(index, 1);


    localStorage.setItem(
        "nishbitesOrders",
        JSON.stringify(orders)
    );


    loadOrders();
}


// ===============================
// CLEAR ALL ORDERS
// ===============================

function clearOrders() {

    if (
        !confirm(
            "Delete ALL NishBites orders?"
        )
    ) {

        return;
    }


    localStorage.removeItem(
        "nishbitesOrders"
    );


    loadOrders();

    alert("All orders have been deleted.");
}


// ===============================
// ADMIN LOGOUT
// ===============================

function logoutAdmin() {

    alert("Admin logged out.");

    window.location.href =
        "index.html";
}


// ===============================
// ADD MENU ITEM
// ===============================

function addMenuItem(event) {

    event.preventDefault();


    const name =
        document.getElementById("foodName").value;

    const price =
        document.getElementById("foodPrice").value;

    const category =
        document.getElementById("foodCategory").value;


    if (!name || !price || !category) {

        alert("Please fill all fields.");

        return;
    }


    let menu =
        JSON.parse(
            localStorage.getItem("nishbitesMenu")
        ) || [];


    menu.push({

        name: name,

        price: Number(price),

        category: category

    });


    localStorage.setItem(
        "nishbitesMenu",
        JSON.stringify(menu)
    );


    alert(
        name +
        " added to menu successfully! 🍔"
    );


    document.getElementById("foodName").value = "";

    document.getElementById("foodPrice").value = "";

    document.getElementById("foodCategory").value = "";
}


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCart();

        loadOrders();

    }
);