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
        if(req.query.title){
            query.where('title', new RegExp(req.query.title, 'i'))
        }
        if(req.query.publishedAfter){
            query.gte('publishDate', req.query.publishedAfter)
        }
        if(req.query.publishedBefore){
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
    console.log('book', book.title)
    try{
        const newBook = await book.save()
        res.redirect('books')
    }catch{
        // removeBookCover(book.coverImageName)
        renderNewpage(res, book, true)
    }
})


function saveCover(book, coverEncoded) {
    if(!coverEncoded) return
    const cover = JSON.parse(coverEncoded)
    if(cover && imageMimeTypes.includes(cover.type)){
        // base64轉為buffer二進制數據
        book.coverImage = Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

// 刪除檔案
function removeBookCover(fileName){
    if(fileName){
        fs.unlink(path.join(uploadPath, fileName), (err) => {
            if (err) console.error(err)
        })
    }
}

async function renderNewpage(res, book, hasError = false){
    try {
        // console.log('renderNewpage', book)
        const authors = await Author.find({})
        let data = { authors, book }
        if(hasError) data.errorMessage = 'Error creating Book'
        res.render('books/new', data)
    } catch {
        res.render('/books')
    }
}

module.exports = router
