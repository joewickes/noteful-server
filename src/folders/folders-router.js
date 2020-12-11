const express = require('express');
const xss = require('xss');

const FoldersService = require('./folders-service');

const foldersRouter = express.Router();
const jsonParser = express.json();

foldersRouter
  .route('/api/folders')
  .get((req, res, next) => {
    FoldersService.getAllFolders(
      req.app.get('db')
    )
      .then(folders => {
        return res.json(folders);
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { id, name } = req.body;

    const newFolder = {}
    
    if (name == null) {
      return res.status(400).json({
        error: { message: 'Missing name in request body' }
      })
    } else {
      newFolder.name = name;
    }

    if (id) {
      newFolder.id = id;
    }

    FoldersService.insertFolder(
      req.app.get('db'),
      newFolder
    )
      .then(folder => {
        res
          .status(201)
          .location(`/api/folders/${folder.id}`)
          .json(folder)
      })
      .catch(next)

  })

foldersRouter
  .route('/api/folders/:folder_id')
  .all((req, res, next) => {
    FoldersService.getById(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(folder => {
        if (!folder) {
          return res.status(404).json({
            error: { message: 'Folder doesn\'t exist' }
          })
        }

        res.folder = folder
        next();
      })
      .catch(next)
  })
  .get((req, res, next) => {
    return res.json({
      id: res.folder.id,
      name: xss(res.folder.name),
      content: xss(res.folder.content)
    })
  })
  .delete((req, res, next) => {
    FoldersService.deleteFolder(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(() => {
        return res.status(204).end();
      })
      .catch(next)
  })

module.exports = foldersRouter;