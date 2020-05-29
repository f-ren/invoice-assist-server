const xss = require('xss');

const ItemsService = {
  getAllItems(db, user_id) {
    return db
      .from('items')
      .select('*')
      .where('items.user_id', user_id)
      .leftJoin('products AS prd', 'prd.id', 'items.product_id');
  },

  insertItem(db, newItem) {
    return db.insert(newItem).into('items').returning('*');
  },
};

module.exports = ItemsService;
