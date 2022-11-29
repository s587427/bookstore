const express = require('express')
const path = require('path')
const fs = require('fs')
// const multer = require('multer') // 檔案上傳
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// 檔案上傳
// const uploadPath = path.join('public', Book.coverImageBasePath)
// const upload = multer({ 
//     dest: uploadPath,
//     fileFilter: (req, file, callback) => { 
//         // console.log('檔案', file)
//         callback(null, imageMimeTypes.includes(file.mimetype))
//     }
// })

router.get('/', async (req, res) => {
    try {
        let query = Book.find()
        if (req.query.title) {
            query.where('title', new RegExp(req.query.title, 'i'))
        }
        if (req.query.publishedAfter) {
            query.gte('publishDate', req.query.publishedAfter)
        }
        if (req.query.publishedBefore) {
            query.lte('publishDate', req.query.publishedBefore)
        }
        const books = await query.exec()
        res.render('books', { books: books, searchOptions: req.query })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.get('/new', async (req, res) => {
    renderNewpage(res, new Book())
})

router.post('/', /*upload.single('coverImageName'),*/ async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        // coverImageName: fileName, // 改成存在database所以不需要此欄位
        description: req.body.description,
    })
    saveCover(book, req.body.coverImageName)
    try {
        const newBook = await book.save()
        res.redirect(`/books/${newBook.id}`)
    } catch {
        // removeBookCover(book.coverImageName)
        renderNewpage(res, book, true)
    }
})


router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        const author = await Author.findById(book.author)
        res.render('books/show', { book, author })
    } catch (error) {
        res.redirect('/authors')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        const authors = await Author.find()
        res.render('books/edit', { book, authors })
    } catch (error) {
        res.redirect('/books')
    }
})

router.put('/:id', async (req, res) => {
    let book

    try {
        book = await Book.findById(req.params.id)
        book = Object.assign(book, {
            title: req.body.title,
            author: req.body.author,
            publishDate: new Date(req.body.publishDate),
            pageCount: req.body.pageCount,
            description: req.body.description,
        })

        saveCover(book, req.body.coverImageName)
        await book.save()
        res.redirect(`/books/${req.params.id}`)

    } catch (err) {
        if (!book) {
            res.redirect('/')
        } else {
            renderEditpage(res, book, true)
        }
    }
})

router.delete('/:id', async (req, res) => {
    let book
    try {
        const book = await Book.findById(req.params.id)
        book.remove()
        res.redirect('/books')
    } catch (error) {
        if (!book) {
            res.redirect('/')
        } else {
            res.render('books/show', { book, errorMessage: '刪除失敗' })
        }
    }
})

function saveCover(book, coverEncoded) {
    if (!coverEncoded) return
    const cover = JSON.parse(coverEncoded)
    if (cover && imageMimeTypes.includes(cover.type)) {
        // base64轉為buffer二進制數據
        book.coverImage = Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

function renderNewpage(res, book, hasError = false) {
    renderFormPage(res, book, 'new', hasError)
}

function renderEditpage(res, book, hasError = false) {
    renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false) {
    try {
        // console.log('renderNewpage', book)
        const authors = await Author.find({})
        let data = { authors, book }
        if (hasError) {
            if (form === 'new') {
                data.errorMessage = '建立失敗'
            } else if (form === 'edit') {
                data.errorMessage = '更新失敗'
            }
        }
        res.render(`books/${form}`, data)
    } catch {
        res.render('/books')
    }
}

// 刪除檔案
function removeBookCover(fileName) {
    if (fileName) {
        fs.unlink(path.join(uploadPath, fileName), (err) => {
            if (err) console.error(err)
        })
    }
}


module.exports = router
