var express = require('express');
var router = express.Router();
var cart = require('../models/cart');

//getCartOrderByCustomerId:function(id, callback) {
router.get('/customer/:id?',function(req,res,next) {
  if(req.params.id) {
    cart.getCartOrderByCustomerId(req.params.id, function(err,rows) {
      if(err) {
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  }
});

//getCartByCartId:function(id, callback) {
router.get('/:id?',function(req,res,next) {
  if(req.params.id) {
    cart.getCartByCartId(req.params.id, function(err,rows) {
      if(err) {
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  }
});

// all methods with POST request
router.post('/:id?',function(req,res,next) {
  if(req.params.id) {
    
    //setCartByCustomerId:function(id, callback) {
    cart.setCartByCustomerId(req.params.id, function(err,rows) {
      if(err) {
        res.json(err);
      } else {
        return res.status(200).send({
            message: 'Cart has been succesfully created.'
        });
      }
    });
    
  } else if(req.body.id) {

    //setCart_orderByCart_orderId:function(cart_id, product_id, amount, callback) {
    cart.setCart_orderByCart_orderId(req.body, function(err,rows) {
      if(err) {
        res.json(err);
      } else {
        return res.status(200).send({
            message: 'Cart has been succesfully created.'
        });
      }
    });

  } else {
    
    // no valid option specified
    return res.status(404).send({
      message: 'Invalid request: no data given.'
    });
  }

});

//updateCart_orderByCart_orderId:function(cart_id, product_id, amount, callback) {
router.put('/:id?',function(req,res,next) {
  cart.updateCart_orderByCart_orderId(req.body, function(err,rows) {
    if(err) {
      res.json(err);
    } else {
      if(rows.affectedRows == 0) {
        return res.status(404).send({
          message: 'This cart does not exist.'
        });
      } else {
        return res.status(200).send({
            message: 'Cart has been succesfully updated.'
        });
      }
    }
  });
});

//deleteCart_orderByCartProductId:function(id, callback) {
router.delete('/:id?',function(req,res,next) {
  cart.deleteCart_orderByCartProductId(req.params.id, function(err,rows) {
    if(err) {
      res.json(err);
    } else {
      if(rows.affectedRows == 0) {
        return res.status(404).send({
          message: 'This cart does not exist.'
        });
      } else {
        return res.status(200).send({
            message: 'Cart has been succesfully deleted.'
        });
      }
    }     
  });
});

module.exports=router;