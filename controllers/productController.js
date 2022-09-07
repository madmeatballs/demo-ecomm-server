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

module.exports.getAll = async (params) => {
    //get products and sortby price or name or date or category
    const products = await Product.find({}).populate('category').sort(params.sortBy);
    
    //sortby price descending
    if(params.sortBy === 'price') {
        return products.sort((a, b) => {
            return b.price - a.price;
        });
    }

    //sortby price ascending
    if(params.sortBy === '-price') {
        return products.sort((a, b) => {
            return a.price - b.price;
        });
    }

    //sortby name descending
    if(params.sortBy === 'name') {
        return products.sort((a, b) => {
            return b.name.localeCompare(a.name);
        });
    }

    //sortby name ascending
    if(params.sortBy === '-name') {
        return products.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    }

    //sortby date descending
    if(params.sortBy === 'date') {
        return products.sort((a, b) => {
            return b.date - a.date;
        });
    }

    //sortby date ascending
    if(params.sortBy === '-date') {
        return products.sort((a, b) => {
            return a.date - b.date;
        });
    }

    //sortby category descending
    if(params.sortBy === 'category') {
        return products.sort((a, b) => {
            return b.category.name.localeCompare(a.category.name);
        });
    }

    //sortby category ascending
    if(params.sortBy === '-category') {
        return products.sort((a, b) => {
            return a.category.name.localeCompare(b.category.name);
        });
    }

    return products;

    // const products = await Product.find({ status: 'active' }).populate('category');
    // return products;
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
