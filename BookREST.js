/**
 * Created by Jordan.Ross on 4/18/2017.
 */
let express = require('express');
let bodyParser = require('body-parser');
let router = express.Router();
let mongoDAO = require('./mongoDAO');

router.use(bodyParser.json()); // for parsing application/json

router.get('/book/getPages', function (req, res) {
    let title = req.query.title;
    mongoDAO.findOneByTitle(title, function(err, book) {
        if(err) {
            throw err;
        }

        res.status(200).send(book.pages);
    });

});

router.get('/books', function (req, res) {
    mongoDAO.findAll(function(err, books) {
        if(err) {
            throw err;
        }

        res.status(200).send(books);
    });
});

router.put('/book/:title.json', function(req, res){
    console.log(`Updating book: ${req.params.title}`);
    mongoDAO.updateBook(req.params.title, req.body)
});

module.exports = router;
