const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    const matchUser=users.filter((user)=>user.username===username);
    return matchUser.lenght>0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const userMatched=users.filter((user)=>user.username===username&&user.password===password);
    return userMatched.length>0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username=req.body.username;
  const password=req.body.password;
  if(authenticatedUser(username,password)){
      let accessToken=jwt.sign({data:password},"access",{expiresIn:60*60});
      req.session.authorization={accessToken,username};
      return res.status(200).send(`User ${username} logged in successfully!!`);
  }
  else{
      return res.status(401).send("Invalid credentials!!!");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const username=req.session.authorization.username;
    const isbn=req.params.isbn;
    const review=req.body.review;
    if(books[isbn]){
        let book=books[isbn];
        book.reviews[username]=review;
        return res.status(200).send("Review submitted successfully!!!");
    }
    else{
        return res.status(404).send(`Book with isbn: ${isbn} not found!!`);
    }

  
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
    const username=req.session.authorization.username;
    const isbn=req.params.isbn;
    if(books[isbn]){
        let book=books[isbn];
        delete book.reviews[username];
        return res.status(200).send(`Review for ISBN: ${isbn} by user: ${username} deleted successfully!!`)
    }
    else{
        return res.status(404).send(`ISBN: ${isbn} not found!!!`)
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
