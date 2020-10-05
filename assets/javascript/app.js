firebaseConfig = {
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

snapshotToArray = (snapshot) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot) => {
    const item = childSnapshot.val();
    item.id = childSnapshot.key;

    returnArr.push(item);
  });

  return returnArr;
};

class Library {
  createBook(title, author, pages, read) {
    this.book = {
      title,
      author,
      pages,
      read,
    };
    return this.book;
  }

  createBookFromInputs(e) {
    const inputs = [...e.target.elements].map((el) => el.value);
    const [title, author, pages] = inputs;
    let [read] = inputs;
    read = read === 'true';
    this.book = this.createBook(title, author, pages, read);
    return this.book;
  }

  createBookNode(book) {
    this.article = document.createElement('article');
    this.article.className = 'card col-12 col-sm-6 col-md-4 col-lg-3 border-0 mb-3';

    this.article.innerHTML = `
    <div class="card-body shadow">
      <div class="header d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
        <h5 class="card-title mb-0">${book.title}</h5>
        <button
          id="remove-book"
          type="submit"
          class="text-danger"
          onclick="library.removeBook('${book.id}')">
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
} h4 mb-0" class="read-toggler" onclick="library.toggleReadStatus(this, ${
  book.read
})" data-id=${book.id}></i>
      </div>
    </div>`;

    return this.article;
  }

  render(library) {
    const libraryContainer = document.querySelector('#book-library');
    this.booksContainer = document.createElement('div');
    this.booksContainer.className = 'row';
    library.forEach((book, index) => {
      this.booksContainer.appendChild(this.createBookNode(book, index));
    });
    libraryContainer.innerHTML = '';
    libraryContainer.appendChild(this.booksContainer);
  }

  toggleBookForm = () => {
    document.querySelector('#add-book-button').classList.toggle('hide');
    document.querySelector('#add-book-form').classList.toggle('show');
  }

  addBookToLibrary(e) {
    e.preventDefault();

    this.book = this.createBookFromInputs(e);

    const newBookRef = myLibraryRef.push();
    newBookRef.set(this.book);

    e.target.reset();
    this.toggleBookForm();
    return this;
  }

  removeBook(id) {
    const removeBookRef = myLibraryRef.child(id);
    removeBookRef.remove();
    return this;
  }

  toggleReadStatus(target, value) {
    const id = target.getAttribute('data-id');
    const bookRef = myLibraryRef.child(id);
    bookRef.update({
      read: !value,
    });
    return this;
  }
}

library = new Library();
myLibraryRef.on('value', (snap) => {
  library.render(snapshotToArray(snap));
});
document
  .querySelector('#add-book-button')
  .addEventListener('click', library.toggleBookForm);