describe('http://127.0.0.1:5500/part1_source/index.html', () => {
  // First, visit the lab 8 website
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:5500/part1_source/index.html');
  });

  // Next, check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');
    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });
    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');
    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;
    // Query select all of the <product-item> elements
    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        // Grab all of the json data stored inside
        return data = item.data;
      });
    });
    console.log(`Checking product item 1/${prodItemsData.length}`);
    // Make sure the title, price, and image are populated in the JSON
    // firstValue = prodItemsData[0];
    for(let i = 0; i < prodItemsData.length; i++){
    if (prodItemsData[i].title.length == 0) { allArePopulated = false; }
    if (prodItemsData[i].price.length == 0) { allArePopulated = false; }
    if (prodItemsData[i].image.length == 0) { allArePopulated = false; }
    }
    // Expect allArePopulated to still be true
    expect(allArePopulated).toBe(true);

    // TODO - Step 1
    // Right now this function is only checking the first <product-item> it found, make it so that
    // it checks every <product-item> it found
    // DONE

  }, 10000);

  it('Make sure <product-item> elements are populated', async () => {
    const allArePopulated = await page.$$eval('product-item', prodItems => {
      return prodItems.every(item => {
        const data = item.data;
        return data && data.title && data.title.length > 0 && 
               data.price && data.price > 0 && 
               data.image && data.image.length > 0;
      });
    });
    expect(allArePopulated).toBe(true);
  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');
    // TODO - Step 2
    // Query a <product-item> element using puppeteer ( checkout page.$() and page.$$() in the docs )
    const productItem = await page.$('product-item');
    // const shadowRoot = await productItem.evaluateHandle((productItem) => productItem.shadowRoot);
    // const button = await shadowRoot.$('button');

    let buttonInnerTxt = await page.evaluate(async (productItem) => {
      let shadowRoot = await productItem.shadowRoot;
      let button = await shadowRoot.querySelector('button');
      button.click();
      return button.innerText;
    }, productItem);
 
    expect(buttonInnerTxt).toBe("Remove from Cart");

    await page.evaluate(async (productItem) => {
      let shadowRoot = await productItem.shadowRoot;
      let button = await shadowRoot.querySelector('button');
      button.click();
    }, productItem);
  }, 2500);

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');
    
    // TODO - Step 3
    // Query select all of the <product-item> elements, then for every single product element
    await page.$$eval('product-item', async (productItems) => {
      for (const productItem of productItems) {
        const addToCartButton = await productItem.shadowRoot.querySelector('button');
        await addToCartButton.click();
      }

    });
  

    // Check the cart count on the screen
    const cartCount = await page.$('#cart-count')
    let text = await cartCount.getProperty('innerText');
    let text2 = await text.jsonValue();
    expect(parseInt(text2)).toBe(20); // Assuming 20 items were added
    // get the shadowRoot and query select the button inside, and click on it.
    
    // Check to see if the innerText of #cart-count is 20
  }, 10000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
        // TODO - Step 4
      // Reload the page, then select all of the <product-item> elements, and check every
      // element to make sure that all of their buttons say "Remove from Cart".
      // Also check to make sure that #cart-count is still 20
    await page.reload();
    let allRemove = true;

    const productItems = await page.$$('product-item');

    for (const productItem of productItems) {
        const shadowRootHandle = await productItem.evaluateHandle(item => item.shadowRoot);
        const buttonHandle = await shadowRootHandle.$('button');
        const buttonText = await buttonHandle.evaluate(node => node.innerText);
        if (buttonText != "Remove from Cart") {
            allRemove = false;
            break;
        }
    }

    // Check if #cart-count is still 20
    const cartCount = await page.$('#cart-count')
    let text = await cartCount.getProperty('innerText');
    let text2 = await text.jsonValue();
    expect(parseInt(text2)).toBe(20);

    // Assert that all buttons say "Remove from Cart" 
    expect(allRemove).toBe(true);


  }, 10000);

  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {
    // TODO - Step 5
    // At this point he item 'cart' in localStorage should be 
    // '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]', check to make sure it is
    // const cart = await page.evaluate(() => {
    //   return JSON.parse(localStorage.getItem('products'));
    // });
    const localStorage = await page.evaluate(() =>  Object.assign({}, window.localStorage));
    expect(localStorage.cart).toEqual('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');
    // TODO - Step 6
    // Go through and click "Remove from Cart" on every single <product-item>, just like above.
    // Once you have, check to make sure that #cart-count is now 0
    await page.$$eval('product-item', async (productItems) => {
      for (const productItem of productItems) {
        const addToCartButton = await productItem.shadowRoot.querySelector('button');
        await addToCartButton.click();
      }

    });

    const cartCount = await page.$('#cart-count')
    let text = await cartCount.getProperty('innerText');
    let text2 = await text.jsonValue();
    expect(parseInt(text2)).toBe(0);

  }, 10000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    // TODO - Step 7
    // Reload the page once more, then go through each <product-item> to make sure that it has remembered nothing
    // is in the cart - do this by checking the text on the buttons so that they should say "Add to Cart".
    // Also check to make sure that #cart-count is still 0
    await page.reload();
    let allAdd = true;

    const productItems = await page.$$('product-item');

    for (const productItem of productItems) {
        const shadowRootHandle = await productItem.evaluateHandle(item => item.shadowRoot);
        const buttonHandle = await shadowRootHandle.$('button');
        const buttonText = await buttonHandle.evaluate(node => node.innerText);
        if (buttonText != "Add to Cart") {
          allAdd = false;
            break;
        }
    }

    // Check if #cart-count is still 20
    const cartCount = await page.$('#cart-count')
    let text = await cartCount.getProperty('innerText');
    let text2 = await text.jsonValue();
    expect(parseInt(text2)).toBe(0);

    // Assert that all buttons say "Add to Cart" 
    expect(allAdd).toBe(true);


  }, 10000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');
    // TODO - Step 8
    // At this point he item 'cart' in localStorage should be '[]', check to make sure it is
    const localStorage = await page.evaluate(() =>  Object.assign({}, window.localStorage));
    expect(localStorage.cart).toEqual('[]');
  });
});
