const cartModel = require("../../Models/userModel/cartModel");
const productModel = require("../../Models/userModel/productModel");
const registerModel = require("../../Models/userModel/registerModel");
const { response, message } = require("../../utils/response");


exports.getCartItems = async (req, res) => {
    try {

        let UserType= await registerModel.getUserDetails(req.userId)

          
        let result = await cartModel.getCartItems(req.userId);
        if (result) {
            let role = UserType[0].loginType;
        
            result= result.map(product => {
                let price = role === 'user' ? product.customerPrice : product.vendorPrice;

        
                // Check and update the similarProducts if they exist
                if (product.similarProducts && product.similarProducts.length > 0) {
                    product.similarProducts = product.similarProducts.map(similarProduct => {
                        let similarProductPrice = role === 'user' ? similarProduct.customerPrice : similarProduct.vendorPrice;
                        return {
                            ...similarProduct,
                            price: similarProductPrice
                        };
                    });
                }
        
                return {
                    ...product,
                    price: price
                };
            });
        
          return res.status(200).send(response(true, "Cart Items", result));
        } else {
          return res.status(200).send(response(true, "", []));
        }
      } catch (error) {
        console.log(error)
        return res.status(500).send(response(false, message.catchMessage, []));
      }
}

exports.AddToCart = async (req, res) => {
    try {
      
       let checkCartItem =[]
       
        let checkCartdeatils = await cartModel.checkCartItem(req.body, req.userId);
         

        let reqData = {
            productId: req.body.productId,
            userId: req.userId,
            quantity: req.body.quantity,
            selectedSizeId: req.body.selectedSizeId ? req.body.selectedSizeId : null
        }

        let product = await productModel.getProductDetailById(reqData.productId) 
        
       
        if(req.body.selectedSizeId){

            let checkQuantity

            for(let i=0; i<product[0]?.sizes?.length; i++){   
        
                
                   

                if(product[0].sizes[i].id == req.body?.selectedSizeId ){
                   
                    checkQuantity=product[0].sizes[i].quantity;

                }
            
        }
        

            if( reqData.quantity<= checkQuantity ){

                let a= await cartModel.updateWishListItemSize(reqData)
        
                if (checkCartdeatils.length == 0) {
                    let result = await cartModel.AddCart(reqData)
                    if (result) {
                        return res.status(200).send({success:true, msg:"Product added to cart!"});
                    } else {
                        return res.status(400).send(response(true, "Something! Went Wrong Please Try Again"));
                    }
                }

                else {
        
        
                    for(let i=0; i<checkCartdeatils.length; i++){
        
        
                        if(req.body?.selectedSizeId ){
                            
        
                        if(checkCartdeatils[i].selectedSizeId == req.body?.selectedSizeId ){
                           
                            checkCartItem.push(checkCartdeatils[i])
        
                        }
                    }
        
        
                        else{
        
        
                            if(checkCartdeatils[i]?.selectedSizeId !== req.body?.selectedSizeId ){
                          
                                
        
                                if(checkCartdeatils[i]?.selectedSizeId == null && req.body.selectedSizeId == null){
                            checkCartItem.push(checkCartdeatils[i])
                            }
                        }
                        else{
                            
                            if(checkCartdeatils[i]?.selectedSizeId == null || checkCartdeatils[i]?.selectedSizeId == 0){
                                checkCartItem.push(checkCartdeatils[i])
                                }
                            
                        }
        
                        }
        
                    }
        
        
                    let result = await cartModel.updateCartItem(reqData, checkCartItem[0]?.id)
        
        
        
                    if (result) {
                        return res.status(200).send({success:true, msg:"Cart item updated!"});
                    } else {
                        return res.status(400).send(response(true, "Something! Went Wrong Please Try Again"));
                    }
                }
            }

            else{   
                if(checkQuantity ==0){
                    return res.status(200).send(response(true, "Out Of Stock"));

                }
                else{
                    return res.status(200).send(response(true, "You Can purchase only this Quanity only"));

                }
                 }
        }



     else{

        if( reqData.quantity<= product[0]?.productQuantity ){

        let a= await cartModel.updateWishListItemSize(reqData)


          if (checkCartdeatils.length == 0) {
            let result = await cartModel.AddCart(reqData)
            if (result) {
                return res.status(200).send({success:true, msg:"Product added to cart!"});
            } else {
                return res.status(400).send(response(true, "Something! Went Wrong Please Try Again"));
            }
        }

        else {


            for(let i=0; i<checkCartdeatils.length; i++){


                if(req.body?.selectedSizeId ){
                    

                if(checkCartdeatils[i].selectedSizeId == req.body?.selectedSizeId ){
                   
                    checkCartItem.push(checkCartdeatils[i])

                }
            }


                else{


                    if(checkCartdeatils[i]?.selectedSizeId !== req.body?.selectedSizeId ){
                   
                   if(checkCartdeatils[i]?.selectedSizeId == null && req.body.selectedSizeId == null){
                    checkCartItem.push(checkCartdeatils[i])
                    }
                }
                else{
                    
                    if(checkCartdeatils[i]?.selectedSizeId == null || checkCartdeatils[i]?.selectedSizeId == 0){
                        checkCartItem.push(checkCartdeatils[i])
                        }
                    
                }

                }

            }


            let result = await cartModel.updateCartItem(reqData, checkCartItem[0]?.id)



            if (result) {
                return res.status(200).send({success:true, msg:"Cart item updated!"});
            } else {
                return res.status(400).send(response(true, "Something! Went Wrong Please Try Again"));
            }
        }
    }
    else{   
        if(product[0]?.productQuantity ==0){
            return res.status(200).send(response(true, "product Out Of Stock"));

        }else{
            return res.status(200).send(response(true, "You Can purchase only this Quanity only "));

        }
         }
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send(response(false, error.message));
    }
}

exports.removeFromCart = async (req, res) => {
    try {
        req.body.userId = req.userId;
        await cartModel.removeFromCart(req.body)
        return res.status(200).send(response(true, "Product removed from cart!"));
    } catch (error) {
        // return res.status(500).send(response(false, message.catchMessage));
        return res.status(500).send(response(false, error.message));
    }
}

exports.updateCartItem = async (req, res) => {
    try {
        req.body.userId = req.userId;

        let product = await productModel.getProductDetailById(req. body.productId)  

       if(req.body.quantity <= product[0]?.productQuantity){
      

        await cartModel.updateCartItem(req.body)

        return res.status(200).send(response(true, "Cart item updated!"));
    }
    else{
        return res.status(200).send(response(false, "you can only purchase this quantity"));  }

    } catch (error) {
        // return res.status(500).send(response(false, message.catchMessage));
        return res.status(500).send(response(false, error.message));
    }
}


// exports.updateCartStatus = async (req, res) => {
//     try {
//         await cartModel.updateCartStatus(req.body)
//         if (req.body.status == 1) {
//             return res.status(200).send(response(true, "Product Added To Cart Successfully"));
//         } else {
//             return res.status(200).send(response(true, "Product Removed From Cart Successfully"));
//         }
//     } catch (error) {
//         // return res.status(500).send(response(false, message.catchMessage));
//         return res.status(500).send(response(false, error.message));
//     }
// }



// exports.updateCartSizeAndQuantity = async (req, res) => {
//     try {
//         let updateSizeAndQuantity = await cartModel.updateCartSizeAndQuantity(req.body)
//         if (updateSizeAndQuantity) {
//             return res.status(200).send(response(true, "Product Updated Successfully"));
//         } else {
//             return res.status(200).send(response(true, "Unable to Update "));
//         }
//     } catch (error) {
//         // return res.status(500).send(response(false, message.catchMessage));
//         return res.status(500).send(response(false, error.message));
//     }
// }
