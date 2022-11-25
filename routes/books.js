const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

router.get('/', (req, res) => {
    const books = Book.find({})
    res.render('books', { books: books })
})

router.get('/new', async (req, res) => {
    try {
        const authors = await Author.find({})
        const book = new Book()
        res.render('books/new', { authors, book })
    } catch {
        res.render('/books')
    }

})

router.post('/', (req, res) => {
    res.send('created book')
})

module.exports = router
