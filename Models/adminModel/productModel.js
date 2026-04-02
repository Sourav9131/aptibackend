const promisePool = require("../../utils/pool");

class adminModel {
    insertProduct = async (product) => {
        let sql = `INSERT INTO products (brandId, productName, description, customerPrice, vendorPrice, marginPrice, discount, categoryId, specification, highlights, warnings, userManual, isSizeAvailable, slug, productQuantity,bestQuality,shippingTime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        const [result, fields] = await promisePool.query(sql, [
            product.brandId,
            product.productName,
            product.description,
            product.customerPrice,
            product.vendorPrice,
            product.marginPrice,
            product.discount,
            product.categoryId,
            product.specification,
            product.highlights,
            product.warnings,
            product.userManual,
            product.isSizeAvailable,
            product.slug,
            product.productQuantity,
            product.bestQuality,
            product.shippingTime 
        ]);
        return result;
    };
    

    getBrandName = async (brandId) => {
        let sql = `SELECT brandName FROM brands WHERE id = ?`;
        const [result] = await promisePool.query(sql, [brandId]);
        return result;
    };

    insertProductImage = async (image, productId) => {
        let sql = ` INSERT INTO productimage (image, productId) VALUES (?, ?)`;
        const [result, fields] = await promisePool.query(sql, [
            image, productId
        ]);
        return result;
    };

    insertColorProductId = async (productId) => {
        let sql = ` UPDATE products SET colorProductId = ${productId} WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [
            productId
        ]);
        return result;
    }

    insertProductSizesAndQuantity = async (qtySizeObj, productId) => {
        for (let i = 0; i < qtySizeObj.length; i++) {
            // if (qtySizeObj[i].quantity > 0) {
            let sql = ` INSERT INTO productsizes (sizeId, quantity, onSizePrice, productId) VALUES (?,?,?,?)`;
            await promisePool.query(sql, [
                qtySizeObj[i].sizeId,
                qtySizeObj[i].quantity,
                qtySizeObj[i].onSizePrice,
                productId
            ]);
            // }
        }
        return true;
    };

    //--------------------------|| UPDATE PRODUCT ||------------------------------

    updateProduct = async (product) => {
        let sql = ` UPDATE products SET brandId = ?, productName = ?, description = ?,  vendorPrice = ?, customerPrice = ?, marginPrice = ?, discount = ?, categoryId = ?, specification = ?, highlights = ?, warnings = ?, userManual = ?, isSizeAvailable = ?, slug = ?, productQuantity = ? , bestQuality=?,shippingTime=? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [
            product.brandId,
            product.productName,
            product.description,
            // product.color,
            product.vendorPrice,
            product.customerPrice,
            product.marginPrice,
            product.discount,
            product.categoryId,
            // product.subCategoryId,
            // product.innerCategoryId,
            // product.productTypeId,
            product.specification,
            product.highlights,
            product.warnings,
            product.userManual,
            product.isSizeAvailable,
            product.slug,
            product.productQuantity,
            // product.colorProductId,
            product.bestQuality,
            product.shippingTime,
            product.productId,

        ]);
        return result;
    };

    getProductImages = async (productId) => {
        let sql = `SELECT image FROM productimage WHERE productId = ?`;
        const [result] = await promisePool.query(sql, [productId]);
        return result;
    }

    deleteProductImages = async (productId) => {
        let sql = `DELETE FROM productimage WHERE productId = ?`;
        const [result] = await promisePool.query(sql, [productId]);
        return result;
    }

    checkIsSizeAvailable = async (productId) => {
        let sql = `SELECT productId FROM productsizes WHERE productId = ?`;
        const [result] = await promisePool.query(sql, [productId]);
        return result;
    }

    updateProductSizesAndQuantity = async (qtySizeObj, productId) => {
        for (let i = 0; i < qtySizeObj.length; i++) {
            if (qtySizeObj[i].quantity >= 0) {
                let sql = ` UPDATE productsizes SET sizeId = ?, quantity = ?, onSizePrice = ? WHERE productId = ? AND sizeId = ${qtySizeObj[i].sizeId}`;
                await promisePool.query(sql, [
                    qtySizeObj[i].sizeId,
                    qtySizeObj[i].quantity,
                    qtySizeObj[i].onSizePrice,
                    productId
                ]);
            }
        }
        return true;
    };

    deleteQuantityBasedOnSize = async (productId) => {
        let sql = `DELETE FROM productsizes WHERE productId = ?`;
        await promisePool.query(sql, [productId]);
        return true;
    };

    insertItemCombination = async (item, combinationImage) => {
        let sql = ` INSERT INTO itemcombination (combinationName, categoryId, productId, combinationImage) VALUES (?,?,?,?)`;
        const [result, fields] = await promisePool.query(sql, [
            item.combinationName,
            item.categoryId,
            item.productId,
            combinationImage,
        ]);
        return result;
    };

    updateItemCombination = async (item, combinationImage, id) => {
        let sql = `update itemcombination set combinationName = ?, categoryId = ?, productId = ?, combinationImage = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [
            item.combinationName,
            item.categoryId,
            item.productId,
            combinationImage,
            id

        ]);
        return result;
    };

    getCombinationImages = async (id) => {
        let sql = `SELECT combinationImage FROM itemcombination WHERE id = ?`;
        const [result] = await promisePool.query(sql, [id]);
        return result;
    }

    getProductList = async () => {
        // let sql = `SELECT p.*, b.brandName, getImageArray(p.id) as images, getProductSizes(p.id, p.categoryId) as sizes,  c.categoryName, 
        //   ps.sizeId, ps.quantity, ps.onSizePrice, p.dateTime FROM products As p 
        // LEFT JOIN brands AS b ON b.id = p.brandId
        // LEFT JOIN category AS c ON c.id = p.categoryId
        // LEFT JOIN productsizes AS ps ON ps.productId = p.id
        // LEFT JOIN productimage As pi ON pi.productId = p.id GROUP by p.id ORDER BY p.id DESC`;

//   let sql=`SELECT 
//     p.*, 
//     b.brandName, 
//     getImageArray(p.id) as images, 
//     c.categoryName, 
//     JSON_ARRAYAGG(
//         JSON_OBJECT(
//             'sizeId', ps.sizeId, 
//             'quantity', ps.quantity, 
//             'price', ps.onSizePrice,
//             'productId', ps.productId
//         )
//     ) AS sizes, -- Aggregate size details as a JSON array
//     p.dateTime 
// FROM products AS p 
// LEFT JOIN brands AS b ON b.id = p.brandId
// LEFT JOIN category AS c ON c.id = p.categoryId
// LEFT JOIN productsizes AS ps ON ps.productId = p.id
// LEFT JOIN productimage AS pi ON pi.productId = p.id
// GROUP BY p.id
// ORDER BY p.id DESC;

// `

let sql = `
 SELECT 
    p.*,
    b.brandName,
    (
        SELECT JSON_ARRAYAGG(pi.image)
        FROM productimage AS pi
        WHERE pi.productId = p.id
    ) AS images,
    c.categoryName,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'sizeId', ps.sizeId, 
                'sizeName', s.sizeName,
                'quantity', ps.quantity,
                'onSizePrice', ps.onSizePrice,
                'productId', ps.productId
            )
        )
        FROM productsizes AS ps
        LEFT JOIN sizes AS s ON s.id = ps.sizeId
        WHERE ps.productId = p.id
    ) AS sizes,
    p.dateTime
FROM products AS p
LEFT JOIN brands AS b ON b.id = p.brandId
LEFT JOIN category AS c ON c.id = p.categoryId
GROUP BY p.id
ORDER BY p.id DESC;
`;







    

        const [result] = await promisePool.query(sql, []);
    
        // Convert string representation of sizes to arrays
        // result.forEach(product => {
        //     if (product.sizes) {
        //         product.sizes = JSON.parse(product.sizes);
        //     }
        // });

        // result.forEach(product => {
        //     if (product.images) {
        //         product.images = JSON.parse(product.images);
        //     }
        // });
        return result;
    };
    
    

    getCombinationList = async () => {
        let sql = `SELECT ic.id, ic.categoryId, ic.combinationName, c.categoryName, ic.productId, ic.combinationImage, ic.status FROM itemcombination AS ic
        LEFT JOIN category AS c ON c.id = ic.categoryId ORDER BY ic.id DESC`;
        const [result] = await promisePool.query(sql, []);
        return result;
    }

    getCombinationListById = async (id) => {
        let sql = `SELECT id, categoryId, combinationName, combinationImage, productId from itemcombination
        WHERE id = ?`;
        const [result] = await promisePool.query(sql, [id]);
        return result;
    }

    getProductNameById = async (id) => {
        let sql = `SELECT p.id, p.productName, getImageArray(p.id) as image from products AS p
        WHERE p.id = ?`;
        const [result] = await promisePool.query(sql, [id]);
        return result;
    }


    getProductByName = async (data) => {
        let sql = `SELECT products.*, productimage.image
        FROM products
        LEFT JOIN productimage ON products.id = productimage.productId
        WHERE products.productName LIKE ?;`;
        const [result] = await promisePool.query(sql, [`%${data}%`]);
       
        return result;
    };


    combninationStatusUpdate = async (data) => {
        let sql = `update itemcombination set status = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [data.status, data.id]);
        return result;
    };

    productStatusUpdate = async (data) => {
        let sql = `update products set status = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [data.status, data.id]);
        return result;
    };

    productStatusUpdate = async (data) => {
        let sql = `update products set status = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [data.status, data.id]);
        return result;
    };

    productSPoularudate = async (data) => {
        let sql = `update products set popular = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [data.popular, data.id]);
        return result;
    };

    getProductByIdAndColorProductId = async () => {
        let sql = `SELECT id, productName, subCategoryId FROM products WHERE id = colorProductId AND status = 1`;
        const [result] = await promisePool.query(sql, []);
        return result;
    };

    updateProductQuantity = async (reqData, productId) => {
        const sql = `UPDATE products SET ? WHERE id = ?`;
        const [result] = await promisePool.query(sql, [reqData, productId]);
        return result;
    }

    updateProductQuantityOnSize = async (reqData, productId, sizeId) => {
        const sql = `UPDATE productsizes SET ? WHERE productId = ? AND sizeId = ?`;
        const [result] = await promisePool.query(sql, [reqData, productId, sizeId]);
        return result;
    }

    getProductSizeInfo = async (productId, sizeId) => {
        let sql = `SELECT * FROM productsizes WHERE productId = ? AND sizeId = ?`;
        const [result, fields] = await promisePool.query(sql, [productId, sizeId]);
        return result;
    }


}
module.exports = new adminModel();



