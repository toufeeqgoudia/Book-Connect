import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

/**
 * CONSTANTS
 * Constants using the `querySelector()` method to select elements from
 * the Document Object Model (DOM) using data attributes
 */
const dataHeaderSearch = document.querySelector('[data-header-search]')
const dataHeaderSettings = document.querySelector('[data-header-settings]')
const dataListItems = document.querySelector('[data-list-items]')
const dataListMessage = document.querySelector('[data-list-message]')
const dataListButton = document.querySelector('[data-list-button]')
const dataListActive = document.querySelector('[data-list-active]')
const dataListBlur = document.querySelector('[data-list-blur]')
const dataListImage = document.querySelector('[data-list-image]')
const dataListTitle = document.querySelector('[data-list-title]')
const dataListSubtitle = document.querySelector('[data-list-subtitle]')
const dataListDescription = document.querySelector('[data-list-description]')
const dataListClose = document.querySelector('[data-list-close]')
const dataSearchOverlay = document.querySelector('[data-search-overlay]')
const dataSearchForm = document.querySelector('[data-search-form]')
const dataSearchTitle = document.querySelector('[data-search-title]')
const dataSearchGenres = document.querySelector('[data-search-genres]')
const dataSearchAuthors = document.querySelector('[data-search-authors]')
const dataSearchCancel = document.querySelector('[data-search-cancel]')
const dataSettingsOverlay = document.querySelector('[data-settings-overlay]')
const dataSettingsForm = document.querySelector('[data-settings-form]')
const dataSettingsTheme = document.querySelector('[data-settings-theme]')
const dataSettingsCancel = document.querySelector('[data-settings-cancel]')


/**
 * PREVIEW BOOKS
 * This code is implementing a "Show More" feature for a list of books.
 * It initially displays 36 book previews on a page, and then when the 
 * user clicks "Show More" button, it displays the next 36 books
 */

let matches = books
let page = 1;     //used to keep track of current page of book reviews being displayed
const range = [0, BOOKS_PER_PAGE]  

if (!books && !Array.isArray(books)) {
    throw new Error('Source required')
}

if (!range && range.length === 2) {
    throw new Error('Range must be an array with two numbers')
}

/**
 * The createPreview() function takes a book preview object and returns 
 * a button element containing the book preview information in HTML form
 */
function createPreview(preview) {
    const { author: authorId, id, image, title } = preview

    const showPreview = document.createElement('button')
    showPreview.classList = 'preview'
    showPreview.setAttribute('data-preview', id)

    showPreview.innerHTML = /* html */ `
        <img
            class="preview__image"
            src="${image}"
        />

        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[authorId]}</div>
        </div>
    `

    return showPreview
}

const bookFragment = document.createDocumentFragment()

const startIndex = (page - 1) * BOOKS_PER_PAGE
const endIndex = startIndex + BOOKS_PER_PAGE

const bookExtracted = books.slice(startIndex, endIndex)

/**
 * This loop iterates over the book previews to display on the current page, 
 * creates a book preview button using the createPreview function, and 
 * appends the button to the bookFragment container
 */
for (const preview of bookExtracted) {
    const showPreview = createPreview(preview)
    bookFragment.appendChild(showPreview)
}

dataListItems.appendChild(bookFragment)

/**
 * This sets up a click event listener for the "Show More" button. When clicked, 
 * the code executes the logic to display the next set of book previews.
 */
dataListButton.addEventListener('click', () => {
    page++;

    const newStartIndex = (page - 1) * BOOKS_PER_PAGE
    const newEndIndex = newStartIndex + BOOKS_PER_PAGE

    const newBookExtracted = books.slice(newStartIndex, newEndIndex)

    const newBookFragment = document.createDocumentFragment()

    for (const preview of newBookExtracted) {
        const showPreview = createPreview(preview)
        newBookFragment.appendChild(showPreview)
    }

    dataListItems.appendChild(newBookFragment);

    const remaining = matches.length - page * BOOKS_PER_PAGE;
    dataListButton.innerHTML = /* HTML */ `
      <span>Show more</span>
      <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
    `;

    dataListButton.disabled = remaining <= 0;
})


dataListButton.innerHTML = /* HTML */
    `<span>Show more</span>
    <span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>
    `;


/**
 * BOOK SUMMARY
 */


// When dataListItems is clicked, it shows a modal by invoking showModal() on dataListActive.
dataListItems.addEventListener('click', (event) => {
    dataListActive.showModal()
    let pathArray = Array.from(event.path || event.composedPath())
    let active;
  
    for (const node of pathArray) {
      if (active) break;
      const id = node?.dataset?.preview
      
      for (const singleBook of books) {
        if (singleBook.id === id) {
          active = singleBook
          break;
        }
      }
    }
  
    if (!active) return;
    dataListImage.src = active.image;
    dataListBlur.src = active.image;
    dataListTitle.textContent = active.title; 
    dataListSubtitle.textContent = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
    dataListDescription.textContent = active.description;
})


//When dataListClose is clicked, it closes the modal by invoking close() on dataListActive.
dataListClose.addEventListener('click', () => {
    dataListActive.close()
})


/**
 * GENRES AND AUTHORS
 * This code creates a document fragment for each 'genres' and 'authors'.
 * It sets the value of the option to "any" and the inner text to "All Genres" and "All Authors" 
 * respectively. It then loops through an object and creates an option element for each entry, 
 * setting the value to the entry's key and the inner text to its value. 
 * These option elements are added to the fragment, and the fragment is then 
 * appended to a dataSearchGenres element and dataSearchAuthors element.
 */

//When dataHeaderSearch is clicked, it shows a modal by invoking showModal() on dataSearchOverlay
dataHeaderSearch.addEventListener('click', () => {
    dataSearchOverlay.showModal()
    dataSearchTitle.focus()
})

//When dataSearchCancel is clicked, it closes modal by invoking close() on dataSearchOverlay
dataSearchCancel.addEventListener('click', () => { 
    dataSearchOverlay.close()
})

const genresFragment = document.createDocumentFragment()
const genreElement = document.createElement('option')
genreElement.value = 'any'
genreElement.innerText = 'All Genres'
genresFragment.appendChild(genreElement)

for (const [id] of Object.entries(genres)) {
    const genreElement = document.createElement('option')
    genreElement.value = id
    genreElement.innerText = genres[id]
    genresFragment.appendChild(genreElement)
}

dataSearchGenres.appendChild(genresFragment)

const authorsFragment = document.createDocumentFragment()
const authorsElement = document.createElement('option')
authorsElement.value = 'any'
authorsElement.innerText = 'All Authors'
authorsFragment.appendChild(authorsElement)

for (const [id] of Object.entries(authors)) {
    const authorsElement = document.createElement('option')
    authorsElement.value = id
    authorsElement.innerText = authors[id]
    authorsFragment.appendChild(authorsElement)
}

dataSearchAuthors.appendChild(authorsFragment)


/**
 * FILTER BOOKS BY TITLE, GENRE AND AUTHOR
 * This code sets an event listener for a search form element, dataSearchForm. 
 * When the form is submitted, the event listener prevents the default form 
 * submission behavior and instead executes a search using the provided form data.
 */

dataSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    /**The form data is obtained using FormData and converted into an object using Object.fromEntries. 
     * The search is then performed on an array of books, with the search criteria based on the user's 
     * form input.
     */
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];
  
    for (let x = 0; x < books.length; x++) {
      const titleState = filters.title.trim() && books[x].title.toLowerCase().includes(filters.title.toLowerCase());
      const authorState = filters.author !== 'any' && books[x].author.includes(filters.author);
      const genreState = filters.genre !== 'any' && books[x].genres.includes(filters.genre);
  
      if (titleState && authorState && genreState) {
        result.push(books[x]);
      }
    }
  
    /**
     * If the search returns results, they are displayed using a function called createPreviewsFragment, 
     * and the result count is displayed in a button. If there are no results and the user has provided 
     * search criteria, a message is displayed indicating that there were no results.
     */
    if (result.length > 0) {
      const resultFragment = createPreview(result);
      dataListItems.replaceChildren(resultFragment);
      dataListButton.innerHTML = /* html */ `
        <span>Show more</span>
        <span class="list__remaining"> (0)</span>
      `;
      dataListButton.disabled = true;
    //   showPreview();
    } else if (filters.title.trim() && filters.author !== 'any' && filters.genre !== 'any') {
      const firstElementChild = dataListMessage;
      dataListItems.innerHTML = '';
      dataListItems.replaceChildren(firstElementChild);
      dataListMessage.style.display = 'block';
      dataListButton.innerHTML = /* html */ `
        <span>Show more</span>
        <span class="list__remaining"> (0)</span>
      `;
      dataListButton.disabled = true;
    }
  
    dataSearchOverlay.close();
    dataSearchForm.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
})
  



// dataSearchForm.addEventListener('submit', (event) => {
//     event.preventDefault()
//     const formData = new FormData(event.target)
//     const filters = Object.fromEntries(formData)
//     const result = []

//     for (const book of bookExtract) {
//         const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())
//         const authorMatch = filters.author === 'any' || book.author === filters.author
//         let genreMatch = false
        
//         if (filters.genre = 'any') {
//             genreMatch = true
//         } else {
//             for (const genre of books.genres) { 
//                 if (singleGenre = filters.genre) { 
//                     genreMatch = true 
//                     break;
//                 }
//             }
//         }
//     }
//     if (titleMatch && authorMatch && genreMatch) { 
//         result.push(book)
//     }
//     console.log('result: ', result)
// })


// if (result.length < 1) { 
//     dataListMessage.classList.add('list__message_show')
// } else {
//     dataListMessage.classList.remove('list__message_show')
// }


/** 
 * THEME SELECT
 * This code sets up event listeners and handles form submissions for a 
 * data settings overlay. When the header for the overlay is clicked, the 
 * overlay is shown. When the cancel button is clicked, the overlay is closed.
 * 
 */

dataHeaderSettings.addEventListener('click', () => {
    dataSettingsOverlay.showModal()
})

dataSettingsCancel.addEventListener('click', () => { 
    dataSettingsOverlay.close()
})

//The css object defines two themes, 'day' and 'night'
const css = {
    day : ['255, 255, 255', '10, 10, 20'],
    night: ['10, 10, 20', '255, 255, 255']
}

//The value of the dataSettingsTheme input is determined based on whether the user's preferred color scheme is dark or not.
dataSettingsTheme.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'
let v = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'

/**
 * This code sets up for a submit event listener. When the form is submitted, the selected 
 * object is created by converting the form data to an object using Object.fromEntries(). 
 * Depending on the theme selected, the --color-light and --color-dark CSS variables are 
 * updated with the corresponding light and dark color values from the css object
 */
dataSettingsForm.addEventListener('submit', (event) => { 
    event.preventDefault()
    const formSubmit = new FormData(event.target)
    const selected = Object.fromEntries(formSubmit)

    if (selected.theme === 'night') {
        document.documentElement.style.setProperty('--color-light', css[selected.theme][0])
        document.documentElement.style.setProperty('--color-dark', css[selected.theme][1])     
    } else if (selected.theme === 'day') {
        document.documentElement.style.setProperty('--color-light', css[selected.theme][0])
        document.documentElement.style.setProperty('--color-dark', css[selected.theme][1])
    }

    dataSettingsOverlay.close()
})