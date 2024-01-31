const router = require('express').Router();
// -------- Declare our booksController
const booksController = require('../controllers/booksController');

const verify  = require('../middleware/jwtMiddleware').verify;


// -------- Route for Get all books and Add new book
router.route('')
    .get(verify,booksController.getBooks)
    .post(verify,booksController.addBook)



//กา่รบ้านที่เหลือเพิ่มตรงนี้ จะคล้ายๆกัน
// -------- Route for Get book by id, Delete book by id and Edit book by id
router.route('/:bookid')
    .get(verify,booksController.getBookbyId)
    .put(verify,booksController.updateBookbyId)
    .delete(verify,booksController.deleteBookbyId)

module.exports = router;