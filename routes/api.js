/*
 *
 *
 *       Complete the API routing below
 *
 *
 */
const Book = require("../schema/book");
("use strict");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      //response will be array of book objects
      const books = await Book.find();
      const bookList = books.map((book) => {
        const commentCount = book.comments.length;
        return {
          _id: book.id,
          title: book.title,
          commentcount: commentCount,
        };
      });
      res.json(bookList);
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async function (req, res) {
      let title = req.body.title;
      if (!title) {
        res.send("missing required field title");
        return;
      }
      const newBook = new Book({
        title: title,
        comments: [],
      });
      await newBook.save();
      res.json(newBook);
      //response will contain new book object including atleast _id and title
    })

    .delete(async function (req, res) {
      const verify = await Book.deleteMany({});
      if (verify.ok) {
        res.send("complete delete successful");
        return;
      }
      res.send("server error.");
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookid = req.params.id;
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          res.send("no book exists");
          return;
        }
        res.json(book);
      } catch (err) {
        if (err.name === "CastError") {
          res.send("no book exists");
          return;
        }
        res.sendStatus(500);
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        res.send("missing required field comment");
        return;
      }
      try {
        const book = await Book.findByIdAndUpdate(
          bookid,
          { $push: { comments: comment } },
          { new: true }
        );
        if (!book) {
          res.send("no book exists");
          return;
        }
        res.json(book);
      } catch (err) {
        if (err.name === "CastError") {
          res.send("no book exists");
          return;
        }
        res.sendStatus(500);
      }
      //json res format same as .get
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      try {
        const verify = await Book.findByIdAndDelete(bookid);
        if (!verify) {
          res.send("no book exists");
          return;
        }
        res.send("delete successful");
      } catch (err) {
        if (err.name === "CastError") {
          res.send('no book exists')
          return
        }
        res.sendStatus(500)
      }
      //if successful response will be 'delete successful'
    });
};
