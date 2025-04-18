const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/book');

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://admin:adminpass@bd1.vay3lbr.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));


app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.json(book);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


app.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.status(200).send('Book deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});


app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    if (!books || books.length === 0) return res.status(404).send('No books found');
    res.json(books);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


app.post('/books', async (req, res) => {
  try {
    const { title, author, available } = req.body;
    const book = new Book({ title, author, available });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


app.put('/books/:id', async (req, res) => {
  try {
    const { title, author, available } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, available },
      { new: true }
    );
    if (!book) return res.status(404).send('Book not found');
    res.json(book);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});