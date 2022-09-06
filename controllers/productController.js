const Product = require('../models/product');
const Category = require('../models/category');

module.exports.add = async (params) => {
    //check if product exists

    if(await this.productExists(params)) {
        return {success: false, message: "Product Already Exists"};
    }

    let product = new Product ({
        name: params.name,
        price: params.price,
        description: params.description,
        category: params.category,
    });

    await Category.findById(params.category).then(category => {
        category.products.push(product);
        category.save();
    });

    return product.save().then((product, err) => {
        return(err) ? {success: false, message: err} : {success: true, message: product};
    });
};

module.exports.productExists = async (params) => {
    const result = await Product.find({ name: new RegExp('^' + params.name.trim() + '$', 'i') });
    return result.length > 0 ? true : false;
};

module.exports.getAll = async () => {
    const products = await Product.find({ status: 'active' }).populate('category');
    return products;
};

module.exports.getAllInactive = async () => {
    const products = await Product.find({ status: 'inactive' });
    return products;
};

module.exports.get = async (params) => {
    const product = await Product.findById(params.productId);
    return product;
};

module.exports.edit = async (id, data) => {
    //check if product exists
    if(data.name && await this.productExists(data)) {
        return {success: false, message: "Product Already Exists"};
    }

    //edit product
    return await Product.findByIdAndUpdate({_id: id}, data, {useFindAndModify: false}).then((product, err) => {
        return(err) ? {success: false, message: err} : {success: true, message: product};
    });
};

module.exports.delete = async (id, data) => {
    return await Product.findByIdAndDelete({_id: id}, data).then((product, err) => {
        return(err) ? {success: false, message: err} : {success: true, message: product};
    });
};

module.exports.isActive = async (id, status) => {
    //not working
    //set status to active, params is the product id
    return await Product.findByIdAndUpdate({_id: id}, {status: status}, {useFindAndModify: false}).then((product, err) => {
        return(err) ? {success: false, message: err} : {success: true, message: product};
    });
};
