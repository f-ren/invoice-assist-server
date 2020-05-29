const xss = require('xss');

const InvoiceService = {
  getAllInvoices(db, user_id) {
    return db
      .from('invoices AS inv')
      .select(
        'inv.id',
        'usr.id AS user_id',
        'inv.date_created',
        'inv.client',
        'inv.total_sale',
        'usr.company_name'
      )
      .where('usr.id', user_id)
      .leftJoin('user_info AS usr', 'usr.id', 'inv.user_id');
  },

  getByInvoiceId(db, user_id, id) {
    return InvoiceService.getAllInvoices(db, user_id)
      .where('inv.id', id)
      .first();
  },

  insertInvoice(db, newInvoice) {
    return db
      .insert(newInvoice)
      .into('invoices')
      .returning('*')
      .then((rows) => rows[0]);
  },
  updateInvoice(db, id, updateInvoice) {
    return db.from('invoices').where({ id }).update(updateInvoice);
  },
  deleteInvoice(db, id) {
    return db.from('invoices').select('*').where({ id }).delete();
  },
};

module.exports = InvoiceService;
