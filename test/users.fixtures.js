function makeFoldersArray() {
  return [
    {
      id: 1,
      name: 'Folder 11',
      content: 'null'
    },
    {
      id: 2,
      name: 'Folder 12',
      content: 'null'
    },
    {
      id: 3,
      name: 'Folder 13',
      content: 'null'
    },
    {
      id: 4,
      name: 'Folder 14',
      content: 'null'
    },
    {
      id: 5,
      name: 'Folder 15',
      content: 'null'
    },
  ]
}

function makeNotesArray() {
  return [
    {
      id: 1,
      name: 'Note 11',
      content: 'Some content here',
      folder_id: '1'
    },
    {
      id: 2,
      name: 'Note 12',
      content: 'Some content here',
      folder_id: '2'
    },
    {
      id: 3,
      name: 'Note 13',
      content: 'Some content here',
      folder_id: '3'
    },
    {
      id: 4,
      name: 'Note 14',
      content: 'Some content here',
      folder_id: '4'
    },
    {
      id: 5,
      name: 'Note 15',
      content: 'Some content here',
      folder_id: '4'
    },
  ]
}

module.exports = {
  makeFoldersArray,
  makeNotesArray
}