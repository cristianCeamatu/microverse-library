const library = (() => {
  const firebaseConfig = {
    apiKey: 'AIzaSyDTWDCS8e6dTp65QX0BD4kwHEaPLGOcxUM',
    authDomain: 'book-library-fe8b3.firebaseapp.com',
    databaseURL: 'https://book-library-fe8b3.firebaseio.com',
    projectId: 'book-library-fe8b3',
    storageBucket: 'book-library-fe8b3.appspot.com',
    messagingSenderId: '188690877990',
    appId: '1:188690877990:web:72636a06276e7c9acc60e7',
  };

  // Initializers
  firebase.initializeApp(firebaseConfig);
  const myLibraryRef = firebase.database().ref('myLibrary');

  const snapshotToArray = (snapshot) => {
    const returnArr = [];

    snapshot.forEach((childSnapshot) => {
      const item = childSnapshot.val();
      item.id = childSnapshot.key;

      returnArr.push(item);
    });

    return returnArr;
  };

  const book = (title, author, pages, read) => ({
    title,
    author,
    pages,
    read,
  });

  const createBookFromInputs = (e) => {
    const inputs = [...e.target.elements].map((el) => el.value);
    const [title, author, pages] = inputs;
    let [read] = inputs;
    read = read === 'true';
    return book(title, author, pages, read);
  };

  const createBookNode = (book) => {
    const article = document.createElement('article');
    article.className = 'card col-12 col-sm-6 col-md-4 col-lg-3 border-0 mb-3';

    article.innerHTML = `
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

    return article;
  };

  const render = (library) => {
    const libraryContainer = document.querySelector('#book-library');
    const booksContainer = document.createElement('div');
    booksContainer.className = 'row';
    library.forEach((book, index) =>
      booksContainer.appendChild(createBookNode(book, index))
    );
    libraryContainer.innerHTML = '';
    libraryContainer.appendChild(booksContainer);
  };

  const toggleBookForm = () => {
    document.querySelector('#add-book-button').classList.toggle('hide');
    document.querySelector('#add-book-form').classList.toggle('show');
  };

  const addBookToLibrary = (e) => {
    e.preventDefault();

    const book = createBookFromInputs(e);

    const newBookRef = myLibraryRef.push();
    newBookRef.set(book);

    e.target.reset();
    toggleBookForm();
  };

  const removeBook = (id) => {
    const removeBookRef = myLibraryRef.child(id);
    removeBookRef.remove();
  };

  const toggleReadStatus = (target, value) => {
    const id = target.getAttribute('data-id');
    const bookRef = myLibraryRef.child(id);
    bookRef.update({
      read: !value,
    });
  };

  // Event listeners
  myLibraryRef.on('value', (snap) => {
    render(snapshotToArray(snap));
  });
  document
    .querySelector('#add-book-button')
    .addEventListener('click', toggleBookForm);

  return {
    render,
    addBookToLibrary,
    removeBook,
    toggleReadStatus,
  };
})();
