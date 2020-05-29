const xss = require('xss');

const ProductsService = {
  getAllProducts(db, user_id) {
    return db.from('products AS prd').select('*').where('prd.user_id', user_id);
  },
  updateProduct(db, id, updateProducts) {
    return db
      .from('products AS prd')
      .where({ id })
      .update(updateProducts)
      .returning('*');
  },
  insertProduct(db, newProduct) {
    return db.insert(newProduct).into('products').returning('*');
  },
  deleteProduct(db, id) {
    return db.from('products').select('*').where({ id }).delete();
  },
};

module.exports = ProductsService;
