const firebaseConfig = {
  apiKey: 'AIzaSyDTWDCS8e6dTp65QX0BD4kwHEaPLGOcxUM',
  authDomain: 'book-library-fe8b3.firebaseapp.com',
  databaseURL: 'https://book-library-fe8b3.firebaseio.com',
  projectId: 'book-library-fe8b3',
  storageBucket: 'book-library-fe8b3.appspot.com',
  messagingSenderId: '188690877990',
  appId: '1:188690877990:web:72636a06276e7c9acc60e7',
};

firebase.initializeApp(firebaseConfig);
const myLibraryRef = firebase.database().ref('myLibrary');

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
        onclick="removeBook('${book.id}')">
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
      } h4 mb-0" class="read-toggler" onclick="toggleReadStatus(this, ${
    book.read
  })" data-id=${book.id}></i>
    </div>
  </div>`;

  return article;
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

function snapshotToArray(snapshot) {
  let returnArr = [];

  snapshot.forEach(function (childSnapshot) {
    let item = childSnapshot.val();
    item.id = childSnapshot.key;

    returnArr.push(item);
  });

  return returnArr;
}

myLibraryRef.on('value', (snap) => {
  render(snapshotToArray(snap));
});

function Book(title, author, pages, read = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function createBookFromInputs(e) {
  let [title, author, pages, read] = [...e.target.elements].map(
    (el) => el.value
  );
  read = read === 'true' ? true : false;
  return new Book(title, author, pages, read);
}

function addBookToLibrary(e) {
  e.preventDefault();

  const book = createBookFromInputs(e);

  const newBookRef = myLibraryRef.push();
  newBookRef.set(book);

  e.target.reset();
}

function removeBook(id) {
  const removeBookRef = myLibraryRef.child(id);
  removeBookRef.remove();
}

function toggleReadStatus(target, value) {
  const id = target.getAttribute('data-id');
  const bookRef = myLibraryRef.child(id);
  bookRef.update({ read: !value });
}
