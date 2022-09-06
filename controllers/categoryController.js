const Category = require('../models/category');

module.exports.add = async (params) => {
    //check if category exists

    if(await this.categoryExists(params)) {
        return {success: false, message: "Category Already Exists"};
    }

    let category = new Category ({
        name: params.name,
        description: params.description,
    });

    return category.save().then((category, err) => {
        return(err) ? {success: false, message: err} : {success: true, message: category};
    });
};

module.exports.categoryExists = async (params) => {
    const result = await Category.find({ name: new RegExp('^' + params.name.trim() + '$', 'i') });
    return result.length > 0 ? true : false;
};

module.exports.getAll = async () => {
    const result = await Category.find({}).populate('products');
    return result;
};

module.exports.get = async (params) => {
    const category = await Category.findById(params.categoryId).populate('products');
    return category;
};

module.exports.edit = (id, data) => {
    if(this.categoryExists(data)) {
        return {success: false, message: "Category Already Exists"};
    }

    return Category.findByIdAndUpdate(
        {_id: id}, data, {useFindAndModify: false}).then((category, err) => {
            return(err) ? {success: false, message: err} : {success: true, message: category};
        });
};

module.exports.delete = async (id, data) => {
    const category = await Category.findByIdAndDelete({ _id: id }, data);
    return (err) ? { success: false, message: err } : { success: true, message: category };
};