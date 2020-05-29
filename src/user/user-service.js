const xss = require('xss');

const UserService = {
  getUserById(db, user_id) {
    return db
      .from('user_info AS usr')
      .select(
        'usr.first_name',
        'usr.last_name',
        'usr.company_name',
        'usr.email'
      )
      .where('usr.id', user_id)
      .first();
  },
  updateUser(db, id, updateUser) {
    return db.from('user_info AS usr').where('usr.id', id).update(updateUser);
  },
};
module.exports = UserService;
