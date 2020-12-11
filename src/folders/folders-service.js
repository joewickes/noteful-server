const FoldersService = {
  getAllFolders(knex) {
    return knex
      .select('*').from('noteful_folders')
    ;
  },
  insertFolder(knex, newFolder) {
    return knex
      .insert(newFolder)
      .into('noteful_folders')
      .returning('*')
      .then(rows => {
        return rows[0];
      })
    ;
  },
  getById(knex, id) {
    return knex('noteful_folders')
      .where('id', id).first()
    ;

  },
  updateFolder(knex, id, newFolderFields) {
    return knex('noteful_folders')
      .where({ id })
      .update(newFolderFields)
    ;
  },
  deleteFolder(knex, id) {
    return knex('noteful_folders')
      .where('id', id)
      .delete()
    ;
  }
}

module.exports = FoldersService;