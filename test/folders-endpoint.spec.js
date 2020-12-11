const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { makeFoldersArray } = require('./users.fixtures');

describe('Folders Endpoints', function() {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });

    app.set('db', db);
  });

  const testFolders = makeFoldersArray();

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE noteful_folders RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE noteful_folders RESTART IDENTITY CASCADE'));

  describe('GET /api/folders', () => {
    
    context('Given no folders', () => {

      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/folders')
          .expect(200, [])
        ;
      });
    })

    context('Given folders', () => {
      
      beforeEach('insert folders', () => {
        return db
          .into('noteful_folders')
          .insert(testFolders)
      });

      it('GET /api/folders responds with 200 and all of the articles', () => {
        return supertest(app)
          .get('/api/folders')
          .expect(200, testFolders)
      });

    })

  });

  describe('POST /api/folders', () => {

    context('Given folder', () => {
      
      it(`creates an folder, responding with 201 and the new folder`, function() {
        this.retries(3);
  
        const newFolder = {
          name: 'Test new folder',
          content: "null"
        }
  
        return supertest(app)
          .post('/api/folders')
          .send(newFolder)
          .expect(res => {
            expect(res.body.name).to.eql(newFolder.name)
            expect(res.body.content).to.eql(newFolder.content)
            expect(res.body).to.have.property('id')
            expect(res.headers.location).to.eql(`/api/folders/${res.body.id}`)
          })
          .then(postRes =>
            supertest(app)
              .get(`/api/folders/${postRes.body.id}`)
              .expect(postRes.body)
          )
        ;
      });
    })

  })

  describe('GET /api/folders/:folder_id', () => {

    context('Given no folder', () => {
      
      it(`responds with 404`, () => {
        const folderId = 1500
        return supertest(app)
          .get(`/api/folders/${folderId}`)
          .expect(404, { error: { message: `Folder doesn't exist` } })
        ;
      });

    })

    context('Given folder', () => {
      
      beforeEach('insert articles', () => {
        return db
          .into('noteful_folders')
          .insert(testFolders)
        ;
      });

      it('GET /api/folders/:folder_id responds with 200 and the specified folder', () => {
        const folderId = 3
        const expectedFolder = testFolders[folderId - 1]
        return supertest(app)
          .get(`/api/folders/${folderId}`)
          .expect(200, expectedFolder)
        ;
      });

    })

  });

  describe('DELETE /api/folders/:folder_id', () => {
    context('Given there are folders in the database', () => {
      const testFolders = makeFoldersArray()

      beforeEach('insert folders', () => {
        return db
          .into('noteful_folders')
          .insert(testFolders)
      })

      it('responds with 204 and removes the folder', () => {
        const idToRemove = 3;
        const expectedFolders = testFolders.filter(folder => folder.id !== idToRemove);
        return supertest(app)
          .delete(`/api/folders/${idToRemove}`)
          .expect(204)
          .then(res => {
            supertest(app)
              .get(`/api/folders`)
              .expect(expectedFolders)
          })
      })

      context(`Given no folder`, () => {
        it(`responds with 404`, () => {
          const folderId = 89180
          return supertest(app)
            .delete(`/api/folders/${folderId}`)
            .expect(404, { error: { message: `Folder doesn't exist` } })
        });
      });
    })
  })
})