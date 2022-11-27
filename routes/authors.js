const express = require('express')
const router = express.Router()
const Author = require('../models/author')

// 全部的作者 Route
router.get('/', async (req, res) => {

    // console.log(req.query.name)
    // new RegExp('Sheng', 'i') = /Sheng/i
    try {
        // {} equal to no condition
        // 在mongodb中使用Regx可進行模糊搜尋
        let searchOptions = {}
        if(req.query.name) searchOptions.name =  new RegExp(req.query.name, 'i')
        const authors = await Author.find(searchOptions)
        // console.log('all Author', authors)
        res.render('authors/index', {authors: authors, searchValue: req.query.name})

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
        // res.redirect(`authors/${newAuthor.id}`)
        // console.log(newAuthor)
        res.redirect('authors')
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }

})

module.exports = router