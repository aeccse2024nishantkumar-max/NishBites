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

    if (cartCount) {
        cartCount.innerText = totalQuantity;
    }

    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = "<p>Your cart is empty.</p>";
        } else {
            cartItems.innerHTML = "";
            cart.forEach((item, index) => {
                const div = document.createElement("div");
                div.className = "cart-item";
                div.innerHTML = `
                    <strong>${item.name}</strong><br>
                    ₹${item.price} × ${item.quantity}
                    <button onclick="removeFromCart(${index})">❌</button>
                `;
                cartItems.appendChild(div);
            });
        }
    }

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
// SHOW / CLOSE CART
// ===============================
function showCart() {
    const cartBox = document.getElementById("cartBox");
    if (cartBox) {
        cartBox.style.display = "flex";
    }
    updateCart();
}

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

    let customerName = "Customer";
    let phone = "9876543210";
    let address = "Main Street";

    const nameEl = document.getElementById("customerName") || document.getElementById("name");
    const phoneEl = document.getElementById("customerPhone") || document.getElementById("phone");
    const addrEl = document.getElementById("customerAddress") || document.getElementById("address");

    if (nameEl && nameEl.value.trim()) customerName = nameEl.value.trim();
    if (phoneEl && phoneEl.value.trim()) phone = phoneEl.value.trim();
    if (addrEl && addrEl.value.trim()) address = addrEl.value.trim();

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    const order = {
        id: "NB" + Date.now(),
        customer: customerName,
        phone: phone,
        address: address,
        items: [...cart],
        total: total,
        status: "Pending",
        date: new Date().toLocaleString()
    };

    let orders = JSON.parse(localStorage.getItem("nishbitesOrders")) || [];
    orders.push(order);
    localStorage.setItem("nishbitesOrders", JSON.stringify(orders));

    alert(
        "🎉 Order placed successfully!\n\n" +
        "Order ID: " + order.id + "\n" +
        "Total: ₹" + total
    );

    if (nameEl) nameEl.value = "";
    if (phoneEl) phoneEl.value = "";
    if (addrEl) addrEl.value = "";

    cart = [];
    updateCart();
    closeCart();
}

// ===============================
// LOAD ORDERS FOR ADMIN
// ===============================
function loadOrders() {
    const ordersTable = document.getElementById("ordersTable");
    const orders = JSON.parse(localStorage.getItem("nishbitesOrders")) || [];

    updateAdminStats();

    if (!ordersTable) {
        return;
    }

    if (orders.length === 0) {
        ordersTable.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding: 20px;">
                    No orders yet.
                </td>
            </tr>
        `;
        return;
    }

    ordersTable.innerHTML = "";

    orders.forEach((order, index) => {
        let itemsText = "";
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                itemsText += `${item.name} × ${item.quantity}<br>`;
            });
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.phone}</td>
            <td>${itemsText}</td>
            <td>₹${order.total}</td>
            <td>
                <select onchange="changeOrderStatus(${index}, this.value)">
                    <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="Preparing" ${order.status === "Preparing" ? "selected" : ""}>Preparing</option>
                    <option value="Out for Delivery" ${order.status === "Out for Delivery" ? "selected" : ""}>Out for Delivery</option>
                    <option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
                </select>
            </td>
            <td>
                <button onclick="deleteOrder(${index})">🗑️ Delete</button>
            </td>
        `;
        ordersTable.appendChild(row);
    });
}

// ===============================
// UPDATE ADMIN STATISTICS
// ===============================
function updateAdminStats() {
    const orders = JSON.parse(localStorage.getItem("nishbitesOrders")) || [];

    let totalSales = 0;
    orders.forEach(order => {
        totalSales += Number(order.total) || 0;
    });

    const totalOrders = document.getElementById("totalOrders");
    const totalSalesElement = document.getElementById("totalSales");
    const totalCustomers = document.getElementById("totalCustomers");

    if (totalOrders) {
        totalOrders.innerText = orders.length;
    }

    if (totalSalesElement) {
        totalSalesElement.innerText = "₹" + totalSales;
    }

    const customers = new Set(orders.map(order => order.phone));
    if (totalCustomers) {
        totalCustomers.innerText = customers.size;
    }
}

// ===============================
// CHANGE ORDER STATUS
// ===============================
function changeOrderStatus(index, status) {
    let orders = JSON.parse(localStorage.getItem("nishbitesOrders")) || [];
    if (!orders[index]) return;

    orders[index].status = status;
    localStorage.setItem("nishbitesOrders", JSON.stringify(orders));
    loadOrders();
}

// ===============================
// DELETE ORDER
// ===============================
function deleteOrder(index) {
    if (!confirm("Are you sure you want to delete this order?")) return;

    let orders = JSON.parse(localStorage.getItem("nishbitesOrders")) || [];
    orders.splice(index, 1);
    localStorage.setItem("nishbitesOrders", JSON.stringify(orders));
    loadOrders();
}

// ===============================
// CLEAR ALL ORDERS
// ===============================
function clearOrders() {
    if (!confirm("Delete ALL NishBites orders?")) return;
    localStorage.removeItem("nishbitesOrders");
    loadOrders();
}

// ===============================
// PAGE LOAD
// ===============================
document.addEventListener("DOMContentLoaded", function () {
    updateCart();
    loadOrders();
});