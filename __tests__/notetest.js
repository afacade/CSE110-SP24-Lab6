describe('http://127.0.0.1:5500/index.html', () => {
  
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:5500/index.html');
  });


  it('Check add a new note', async () => {
    // Click the add note button
    const addNoteButton = await page.$('.add-note');
    await addNoteButton.click();

    await page.waitForSelector('.note');

    const localStorage = await page.evaluate(() =>  Object.assign({}, window.localStorage));
    console.log(localStorage);
    expect(localStorage['stickynotes-notes'].length).not.toBe(0);
}, 2500);

it('When new note, it should says new note as placeholder', async () => {
  // check content that is located in placeholder
  const noteContent = await page.$eval('.note', note => note.placeholder);
  expect(noteContent).toBe('New Note');

}, 2500);


it('Type into empty note', async () => {
  await page.click('.note');
  await page.waitForSelector('.note');

  await page.type('.note', 'test test 123');
  const noteContent = await page.$eval('.note', note => note.value);

  // note content should be no longer New Note but what we set it
  expect(noteContent).toBe('test test 123');

}, 2500);

it('Edit existing note', async () => {
  await page.click('.note');
  await page.waitForSelector('.note');

  const content = await page.$eval('.note', note => note.value);
  // delete current content
  for(let i = 0; i < content.length;  i++){
    await page.keyboard.press('Backspace');
  }
  
  await page.type('.note', 'note edited');
  // it should become the new text
  const newcontent = await page.$eval('.note', note => note.value);
  expect(newcontent).toBe('note edited');
});

it('Add another note', async () => {
  // Click and wait for note to appear
  await page.click('.add-note');
  await page.waitForSelector('.note');

  const notesNum = await page.$$eval('.note', notes => notes.length);
  expect(notesNum).toBe(2);
});


// it('should edit a new note', () => {
//     // Add a new note
//     addNote();

//     // Edit the note
//     const noteElement = notesContainer.querySelector('.note');
//     noteElement.value = 'Edited Note';
//     noteElement.dispatchEvent(new Event('change'));

//     // Check if the note is updated in localStorage
//     const notes = getNotes();
//     expect(notes[0].content).toBe('Edited Note');
// }, 2500);

// it('should edit an existing note', () => {
//     // Add an existing note
//     const existingNote = { id: 123, content: 'Existing Note' };
//     saveNotes([existingNote]);

//     // Edit the existing note
//     const noteElement = createNoteElement(existingNote.id, existingNote.content);
//     noteElement.value = 'Edited Existing Note';
//     noteElement.dispatchEvent(new Event('change'));

//     // Check if the note is updated in localStorage
//     const notes = getNotes();
//     expect(notes[0].content).toBe('Edited Existing Note');
// }, 2500);

// it('should save notes locally', () => {
//     // Add some notes
//     addNote();
//     addNote();
//     addNote();

//     // Reload the page
//     location.reload();

//     // Check if the notes are still in localStorage
//     const notes = getNotes();
//     expect(notes.length).toBe(3);
// }, 2500);

// it('should delete a note by double clicking', () => {
//     // Add a note
//     addNote();

//     // Double click on the note to delete
//     const noteElement = notesContainer.querySelector('.note');
//     noteElement.dispatchEvent(new Event('dblclick'));

//     // Check if the note is deleted from localStorage
//     const notes = getNotes();
//     expect(notes.length).toBe(0);

//     // Check if the note element is removed from the DOM
//     expect(notesContainer.innerHTML).toBe('');
// }, 2500);
  
});

