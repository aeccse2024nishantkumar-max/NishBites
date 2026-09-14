from flask import Flask, render_template, request, redirect, url_for
import sqlite3
import os

app = Flask(__name__, template_folder='.', static_folder='.')

# Database setup
def init_db():
    conn = sqlite3.connect('nishbites.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            address TEXT NOT NULL,
            item_name TEXT NOT NULL,
            order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Main Website Route
@app.route('/')
def home():
    return render_template('index.html')

# Order Receive Karne Ka Route
@app.route('/order', methods=['POST'])
def place_order():
    name = request.form.get('name')
    phone = request.form.get('phone')
    address = request.form.get('address')
    item = request.form.get('item')

    if name and phone and address and item:
        conn = sqlite3.connect('nishbites.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO orders (customer_name, phone, address, item_name)
            VALUES (?, ?, ?, ?)
        ''', (name, phone, address, item))
        conn.commit()
        conn.close()
        return '''
            <div style="font-family: Arial; text-align: center; margin-top: 50px;">
                <h2 style="color: #27ae60;">🎉 Order Successful!</h2>
                <p>Aapka order NishBites ko receive ho gaya hai.</p>
                <br>
                <a href="/" style="display: inline-block; padding: 10px 20px; background: #e67e22; color: white; text-decoration: none; border-radius: 5px;">Back to Home</a>
            </div>
        '''
    return "Details missing hain! Kripya saare box bharein.", 400

# Admin Panel Route (Orders dekhne ke liye)
@app.route('/admin')
def admin():
    conn = sqlite3.connect('nishbites.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, customer_name, phone, address, item_name, order_time FROM orders ORDER BY id DESC')
    orders = cursor.fetchall()
    conn.close()
    return render_template('admin.html', orders=orders)

if __name__ == '__main__':
    app.run(port=5000, debug=True)