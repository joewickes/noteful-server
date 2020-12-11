const express = require('express');
const xss = require('xss');

const NotesService = require('./notes-service');

const notesRouter = express.Router();
const jsonParser = express.json();

notesRouter
  .route('/api/notes')
  .get((req, res, next) => {
    NotesService.getAllNotes(
      req.app.get('db')
    )
      .then(notes => {
        res.json(notes);
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { id, name, content, folder_id } = req.body;

    const newNote = {
      name,
      content,
      folder_id
    }
    
    for (const [key, value] of Object.entries(newNote)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` }
        })
      } 
    }

    if (id) {
      newNote.id = id
    }

    NotesService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        res
          .status(201)
          .location(`/api/notes/${note.id}`)
          .json(note)
      })
      .catch(next)

  })

notesRouter
  .route('/api/notes/:note_id')
  .all((req, res, next) => {
    NotesService.getById(
      req.app.get('db'),
      req.params.note_id
    )
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: 'No updates given' }
          })
        }
        res.note = note
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json({
      id: res.note.id,
      name: xss(res.note.name)
    })
  })
  .delete((req, res, next) => {
    NotesService.deleteNote(
      req.app.get('db'),
      req.params.note_id
    )
      .then(() => {
        return res.status(204).end();
      })
      .catch(next)
  })

module.exports = notesRouter;