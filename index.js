const express = require('express');
const path = require("path");
require('dotenv').config();

const app = express();
const PORT = 1600;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

const mongoose = require('mongoose');
const connection = require('./connectMongo');
connection();
const bookSchema = new mongoose.Schema({
    no: {
        type: Number,
        require: true
    },
    name: {
        type: String,
        require: true
    }, 
    author: String,
    price: {
        type: Number,
        require: true
    }
});

const Book = mongoose.model('Book', bookSchema);
// const book = new Book({
//     name: 'new world',
//     author: 'me',
//     price: 15220,
//     description: 'very good'
// });
// book.save();

// Book.find()
// .then (result=>{
//     console.log(result);
//     mongoose.disconnect();
// })
// .catch (e=>{
//     console.log("Error: ",e)
// });


app.get('/', (req, res) => {
    Book.find({}, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('index.ejs', { data });
            // console.log(data);
        }
    });
});
app.post('/pop',(req, res)=>{
    Book.deleteOne({no: req.body["no"]})
    .then (result=>{
        console.log('deleted');
    })
    .catch(e=>{
        console.log(e);
    });
    res.redirect('/');
}) 

app.post('/create', (req,res)=>{
    console.log(req.body);
    const book = new Book({
        no: req.body["no"],
        name: req.body["name"],
        author: req.body["author"],
        price: req.body["price"]
    });
    book.save();
    res.redirect('/');
})
  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});