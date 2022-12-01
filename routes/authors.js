const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

// 全部的作者 Route
router.get('/', async (req, res) => {

    // console.log(req.query.name)
    // new RegExp('Sheng', 'i') = /Sheng/i
    try {
        // {} equal to no condition
        // 在mongodb中使用Regx可進行模糊搜尋
        let searchOptions = {}
        if (req.query.name) searchOptions.name = new RegExp(req.query.name, 'i')
        const authors = await Author.find(searchOptions)
        // console.log('all Author', authors)
        res.render('authors/index', { authors: authors, searchValue: req.query.name })

    } catch {
        res.redirect('/')
    }
})

// 新作者 Route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

// 創建作者的Route 
router.post('/', async (req, res) => {

    // model的實例化 like to mogodb document
    const author = new Author({
        name: req.body.name
    })

    // 透過save將資料存到資料庫
    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: '新增作者失敗, 作者名稱不可為空'
        })
    }

})

// 瀏覽作者
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id }).limit(6).exec()
        res.render('authors/show', { author, books })
    } catch (error) {
        res.redirect('/authors')
    }
})

// 編輯作者
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    } catch (error) {
        // console.log(error)
        res.redirect('/authors')
    }
})

// 更新作者
router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${req.params.id}`)
    } catch {
        if (!author) {
            res.redirect('/')
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: '更新作者失敗, 作者名稱不可為空'
            })
        }
    }
})

// 刪除作者
router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect('/authors')
    } catch (error) {
        // console.log(error)
        if (!author) {
            res.redirect('/')
        } else {
            const books = await Book.find({author: author.id})
            res.render('authors/show', { 
                author,
                errorMessage: '作者還擁有書籍無法刪除!!!',
                books
            })
        }
    }

})

module.exports = router