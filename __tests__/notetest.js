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

it('Testing delete feature by double clicking', async () => {
  const note = await page.$('.note');

  await note.click({ clickCount: 2 });

  const notesNum = await page.$$eval('.note', elements => elements.length);
  expect(notesNum).toBe(1);
});



it('App should save notes locally even after reload', async () => {
    // Add 2 more notes for total of 3 so far since we deleted the first one
    const addNoteButton = await page.$('.add-note');
    await addNoteButton.click();
    await addNoteButton.click();

    // Reload the page
    await page.reload();

    // Check if the 3 notes are still in localStorage
    const notesNum = await page.$$eval('.note', notes => notes.length);
    expect(notesNum).toBe(3);
}, 2500);

});

