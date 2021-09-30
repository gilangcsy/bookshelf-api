const { nanoid } = require('nanoid');
const books = require('./bookshelf');

const addBookHandler = (req, res) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  if (!name) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = res.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = res.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getBookHandler = (req, res) => {
  const { name, reading, finished } = req.query;
  let newBooks = [...books];

  if (name !== undefined) {
    newBooks = newBooks.filter((book) => book
      .name.toLowerCase().includes(name.toLowerCase()));
  }

  const boolReading = Number.parseInt(reading, 10);
  if (reading !== undefined) {
    newBooks = newBooks.filter((book) => book
      .reading === !!boolReading);
  }

  const boolFinished = Number.parseInt(finished, 10);
  if (finished !== undefined) {
    newBooks = newBooks.filter((book) => book
      .finished === !!boolFinished);
  }

  const response = res.response({
    status: 'success',
    data: {
      books: newBooks.map((book) => ({
        id: book.id,
        name: book.name,
        year: book.year,
        author: book.author,
        summary: book.summary,
        publisher: book.publisher,
        pageCount: book.pageCount,
        readPage: book.readPage,
        reading: book.reading,
        finished: book.finished,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    const response = res.response({
      status: 'success',
      data: book,
    });
    response.code(200);
    return response;
  }
  const response = res.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;
  const index = books.findIndex((b) => b.id === bookId);

  if (!name) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };
    const response = res.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = res.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const index = books.findIndex((b) => b.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = res.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = res.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler, getBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
};
