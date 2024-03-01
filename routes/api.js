'use strict';

const Book = require('../models').Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      try {
        const books = await Book.find({}); 
        if (!books) {
          res.json([]);
          return;
        }

        const formatBooks = books.map((book) => {
          return {
            _id: book._id,
            title: book.title,
            comments: book.comments,
            commentcount: book.comments.length
          }
        });
        res.json(formatBooks);
        return;
      } catch (err) {
        res.json([]);
      }
    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      if (!title) {
        res.send("missing required field title");
        return;
      }

      const newBook = new Book({ title, comments: [] });
      try {
        const book = await newBook.save(); 
        res.json({ _id: book._id, title: book.title })
      } catch (err) {
        res.send("book could not be created");
      }
    })
    
    .delete(async (req, res) => {
      try {
        const books = await Book.deleteMany();
        console.log("deleted ", books);
        res.send("complete delete successful");
      } catch (err) {
        res.send("could not delete books")
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;

      try {
        const book = await Book.findById(bookid); 
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments,
          commentcount: book.comments.length
        })

      } catch (err) {
        res.send("no book exists");
      }
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        res.send("missing required field comment");
        return;
      }

      try {
        let book = await Book.findById(bookid); 
        book.comments.push(comment);
        book = await book.save();
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments,
          commentcount: book.comments.length
        });

      } catch (err) {
        res.send("no book exists");
      }
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      try {
        const book = await Book.findByIdAndDelete(bookid);
        console.log("deleted ", book);
        if (!book) {
          throw new Error("no book exists")
        }

        res.send("delete successful");
      } catch (err) {
        res.send("no book exists");
      }
    });
  
};
