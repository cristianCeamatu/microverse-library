function Book(title, author, pages, read = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

function createBookNode(book, index) {
  const article = document.createElement('article');
  article.className = 'card col-md-4 col-lg-3 border-0';

  article.innerHTML = `
  <div class="card-body shadow">
    <div class="header d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
      <h5 class="card-title mb-0">${book.title}</h5>
      <button
        id="remove-book"
        type="submit"
        class="text-danger"
        onclick="removeBook(myLibrary, ${index})">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
    <p class="card-text">Author: <span id="author">${book.title}</span></p>
    <p class="card-text">Pages: <span id="pages">${book.pages}</span></p>
    <div class="read-container d-flex align-items-center justify-content-between">
      <p class="card-text mb-0">Read: <span id="read">${
        book.read === true ? 'Yes' : 'No'
      }</span></p>
      <i class="fas ${
        book.read === true
          ? 'fa-toggle-on text-success'
          : 'fa-toggle-off text-warning'
      } h4 mb-0" id="read-toggler" onclick="toggleReadStatus(myLibrary, ${index})"></i>
    </div>
  </div>`;

  return article;
}

function createBookFromInputs(e) {
  let [title, author, pages, read] = [...e.target.elements].map(
    (el) => el.value
  );
  read = read === 'true' ? true : false;
  return new Book(title, author, pages, read);
}

function render(library) {
  const libraryContainer = document.querySelector('#book-library');
  const booksContainer = document.createElement('div');
  booksContainer.className = 'row';
  library.forEach((book, index) =>
    booksContainer.appendChild(createBookNode(book, index))
  );
  libraryContainer.innerHTML = '';
  libraryContainer.appendChild(booksContainer);
}

function addBookToLibrary(event, library) {
  event.preventDefault();
  book = createBookFromInputs(event);
  library.push(book);
  event.target.reset();
  render(myLibrary);
}

function removeBook(library, index) {
  library.splice(index, 1);
  render(library);
}

function toggleReadStatus(library, index) {
  library[index].toggleRead();
  render(library);
}

myLibrary = [];
myLibrary.push(new Book('First book', 'First Author', 234, true));
myLibrary.push(new Book('Second book', 'Second Author', 1234, false));
function saveToLocalStorage(data) {
  myLibrary = JSON.parse(localStorage.getItem('myLibrary')) || [];
  myLibrary.push(data);
  // Alert the array value
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

render(myLibrary);
