//reference of dbconnection.js
var db = require('../dbconnection');

var cart = {

    getCartByCustomerId: function (id, callback) {
        return db.query(`SELECT cart.*, coalesce(sum(cart_order.total_price), 0) AS total_cart_price
        FROM customer
        LEFT JOIN cart ON cart.customer_id = customer.customer_id
        LEFT JOIN cart_order ON cart_order.cart_id = cart.cart_id
        WHERE customer.customer_id=?
        GROUP BY cart.cart_id`, [id], callback);
    },

    getCartByCartId: function (id, callback) {
        return db.query(`SELECT cart.*, coalesce(sum(cart_order.total_price), 0) AS total_cart_price 
            FROM cart
            LEFT JOIN cart_order ON cart_order.cart_id = cart.cart_id
            WHERE cart.cart_id=?
            GROUP BY cart.cart_id`, [id], callback);
    },

    // for the creation of an empty cart
    setCartByCustomerId: function (id, callback) {
        return db.query(`INSERT INTO cart SET customer_id =?, lc_dt =NOW(), cr_dt =NOW()`, [id], callback);
    },

    // for the creation of entries in a cart
    setCartOrderByCartId: function (cart, callback) {
        // get unit_price from product table; needed to calculate total_price
        db.query(`SELECT unit_price FROM product WHERE product_id=?`, [cart.product_id], function (err, result) {
            let unit_price = 0;
            if (result.length > 0) {
                unit_price = result[0].unit_price;
            }
            return db.query(`INSERT INTO cart_order SET cart_id=?, product_id=?, amount=?,
                total_price = amount * ?, lc_dt = NOW(), cr_dt = NOW()`,
                [cart.cart_id, cart.product_id, cart.amount, unit_price], callback);
        });
    },
    // change amount if product already exists
    setAmountandTotalPriceIfProductExistsInCart: function (cart, callback) {
        // get unit_price from product table; needed to calculate total_price
        db.query(`SELECT unit_price FROM product WHERE product_id=?`, [cart.product_id], function (err, result) {
            let unit_price = result[0].unit_price;
            return db.query(`UPDATE cart_order SET amount=amount+?,
            total_price = amount * ?, lc_dt = NOW() WHERE cart_id = ? AND product_id = ?`,
                [cart.amount, unit_price, cart.cart_id, cart.product_id], callback);
        });
    },

    updateCartOrderByCartId: function (cart, callback) {
        // get unit_price from product table; needed to calculate total_price
        db.query(`SELECT unit_price FROM product WHERE product_id=?`, [cart.product_id], function (err, result) {
            let unit_price = result[0].unit_price;
            return db.query(`UPDATE cart_order SET amount=?,
            total_price = ? * ?, lc_dt = NOW() WHERE cart_id = ? AND product_id = ?`,
                [cart.amount, cart.amount, unit_price, cart.cart_id, cart.product_id], callback);
        });
    },

    deleteCartByCartId: function (id, callback) {
        return db.query(`DELETE FROM cart WHERE cart_id=?`, [id], callback);
    },

    deleteCartOrder: function (cart_id, product_id, callback) {
        return db.query(`DELETE FROM cart_order WHERE cart_id=? AND product_id=?`, [cart_id, product_id], callback);
    }
};

module.exports = cart;