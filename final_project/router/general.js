const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username=req.body.username;
  const password=req.body.password;
  if(username&&password){
      if(!isValid(username)){
          users.push({"username":username,"password":password});
          return res.status(200).send(`User ${username} registered successfully!!!`);
      }
      else{
          return res.status(403).send(`Username ${username} already registered!!!`);
      }
  }
  else{
      return res.status(400).send("Invalid credentials provided!!");
  }
});

const getbks=()=>{
    return new Promise((res,rej)=>{
        res(books);
    });
};

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    getbks().then((bks)=>{
        res.send(JSON.stringify(bks));
    });
});

const getIsBn=(isbn)=>{
    return new Promise((res,rej)=>{
        let ISBN=parseInt(isbn);
        if(books[ISBN]){
            res(books[ISBN]);
        }
        else{
            rej({status:404,message:`ISBN: ${isbn} not found!!`});
        }
    });
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    getIsBn(req.params.isbn).then(
        result=>res.send(result),
        error=>res.status(error.status).send(error.message)
    );
});



// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author=req.params.author;
    getbks()
    .then((bookInventory)=>Object.values(bookInventory))
    .then((books)=>books.filter((book)=>book.author===author))
    .then((matchingBooks)=>res.send(matchingBooks));
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const ttl=req.params.title;
    getbks()
    .then((bookInventory)=>Object.values(bookInventory))
    .then((books)=>books.filter((book)=>book.title===ttl))
    .then((matchingBooks)=>res.send(matchingBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  getIsBn(isbn)
  .then(
      result=>res.send(result.reviews),
      error=>res.status(error.status).send(error.message)
  );
});

module.exports.general = public_users;
