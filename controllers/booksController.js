const db = require("../config/db");


// -------- Get all books
const getBooks = function (req, res) {
  res.setHeader("Content-Type", "application/json");

  var booksReference = db.ref("books");

  booksReference.on(
    "value",
    function (snapshot) {
      res.status(200).json(snapshot.val());
      booksReference.off("value");
    },
    function (errorObject) {
      res
        .status(errorObject.statusCode || 500)
        .send("The read failed: " + errorObject.code);
    }
  );
};



// 1) -------- Add new book
const addBook=async  function (req, res)  {

  var bookidValue = req.body.bookid;
  var titleValue = req.body.title;
  var shortDescriptionValue = req.body.shortDescription;
  var authorValue = req.body.author;
  var categoryValue = req.body.category;
  var isbnValue = req.body.isbn;
  var pageCountValue = req.body.pageCount;
  var priceValue = req.body.price;
  var publishedDateValue = req.body.publishedDate;
  var thumbnailUrlValue = req.body.thumbnailUrl;

  var referencePath = "/books/" + bookidValue + "/";

  //Add to Firebase
  var bookReference = db.ref(referencePath);

  const hasBook = await db
    .ref(bookReference)
    .once("value")
    .then((res) => res.exists());

  if (hasBook == false) {
    bookReference.update(
      {
        bookid: bookidValue,
        title: titleValue,
        shortDescription: shortDescriptionValue,
        author: authorValue,
        category: categoryValue,
        isbn: isbnValue,
        pageCount: pageCountValue,
        price: priceValue,
        publishedDate: publishedDateValue,
        thumbnailUrl: thumbnailUrlValue,
      },
      function (error) {
        if (error) {
          res
            .status(error.statusCode || 500)
            .send("Data could not be saved." + error);
        } else {
          return res
            .status(201)
            .send({ error: false, message: "New book added" });
        }
      }
    );
  } else {
    res.status(409).send({ error: "this book id is already exists." });
  }
};







// 2) -------- Get book by id
const getBookbyId=async function (req, res)  {

  res.setHeader("Content-Type", "application/json");

  var referencePath = "/books/" + req.params.bookid + "/";

  const hasBook = await db
    .ref(referencePath)
    .once("value")
    .then((res) => res.exists());

  if (hasBook == false) {
    return res.status(404).send({
      error: true,
      message: "Cannot find book id = " + req.params.bookid,
    });
  } else {
    const book = await db
      .ref(referencePath)
      .once("value")
      .then((res) => res.val());

    res.status(200).json(book);
  }
};







// 3) -------- Delete book by id
const deleteBookbyId= async function (req, res)  {

  res.setHeader("Content-Type", "application/json");

  var bookid = Number(req.params.bookid);
  var booksReference = db.ref("books/" + bookid);

  const hasBook = await db
    .ref(booksReference)
    .once("value")
    .then((res) => res.exists());

  if (hasBook) {
    booksReference.remove();
    return res.status(200).send({
      error: false,
      message: "Delete book id = " + bookid.toString(),
    });
  } else {
    return res.status(404).send({
      error: true,
      message: "Cannot find book id = " + bookid.toString(),
    });
  }
};








// 4) -------- Edit book by id
const updateBookbyId= async  function (req, res)  {

  var bookidValue = Number(req.params.bookid);
  var titleValue = req.body.title;
  var shortDescriptionValue = req.body.shortDescription;
  var authorValue = req.body.author;
  var categoryValue = req.body.category;
  var isbnValue = req.body.isbn;
  var pageCountValue = req.body.pageCount;
  var priceValue = req.body.price;
  var publishedDateValue = req.body.publishedDate;
  var thumbnailUrlValue = req.body.thumbnailUrl;

  var referencePath = "/books/" + bookidValue + "/";

  var bookReference = db.ref(referencePath);

  const hasBook = await db
    .ref(bookReference)
    .once("value")
    .then((res) => res.exists());

  if (hasBook) {
    bookReference.update(
      {
        bookid: bookidValue,
        title: titleValue,
        shortDescription: shortDescriptionValue,
        author: authorValue,
        category: categoryValue,
        isbn: isbnValue,
        pageCount: pageCountValue,
        price: priceValue,
        publishedDate: publishedDateValue,
        thumbnailUrl: thumbnailUrlValue,
      },
      function (error) {
        if (error) {
          res
            .status(error.statusCode || 500)
            .send(
              "book id =" + bookidValue.toString() + " cannot update : " + error
            );
        } else {
          return res.status(200).send({
            error: false,
            message: "book id = " + bookidValue.toString() + " updated",
          });
        }
      }
    );
  } else {
    return res.status(404).send({
      error: true,
      message: "Cannot find book id = " + bookidValue.toString(),
    });
  }
}; 














//export ใช้ในการเรียกใช้ตัวแปร
module.exports = {
  // 5) -------- export functions from here (getBooks, getBookbyId, addBook, updateBookbyId and deleteBookbyId)
  getBooks,
  addBook,
  getBookbyId,
  deleteBookbyId,
  updateBookbyId,
};
