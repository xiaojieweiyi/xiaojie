var mongoose=require('mongoose');
var userShcema =new mongoose.Schema({
  "userId":String,
  "userName":String,
  "userPwd":String,
  "orderList":Array,
  "cartList":[
    {
      "productId": String,
      "productName": String,
      "salePrice": String,
      "productImage": String,
     /* "productNum": String,
      "checked": String,*/
      "checked": {
        type:String,
        default:1
      },

      "productNum": {
        type:String,
        default:1
      }

    }
  ],
  "addressList":[
    {
      "addressId":String,
      "userName":String,
       "streetName":String,
        "postCode":Number,
        "tel":Number,
        "isDefault":Boolean
    }
  ]
})
module.exports=mongoose.model("User",userShcema);
