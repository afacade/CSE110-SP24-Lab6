describe('http://127.0.0.1:5500/index.html', () => {
  
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:5500/index.html');
  });


  it('Check add a new note', async () => {
    // Click the add note button
    const addNoteButton = await page.$('.add-note');
    await addNoteButton.click();
    const note = await page.$('.note');
    note.content = 'hello';
    const localStorage = await page.evaluate(() =>  Object.assign({}, window.localStorage));
    // const notesContainer = await page.$('.notes-app')
    console.log(localStorage);
    expect(localStorage['stickynotes-notes'].length).not.toBe(0);
}, 2500);

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

