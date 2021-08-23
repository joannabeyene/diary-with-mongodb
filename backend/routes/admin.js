var express = require('express');
var router = express.Router();
const cors = require("cors");
let rand = require("random-key");
router.use(cors()); 
//LOGIN PAGE
router.get('/', function(req, res) {
    let adminLogin = `<div>
    <h3>Login:</h3>
    <form action= '/admin/login' method='post'>
    <label>Username: </label>
    <input id='user' name='user' type='text'>
    <label>Password: </label>
    <input id='password' name='password' type='text'>
    <button type='submit'>login</button>
    </form>

    <p>Don't have an account? <strong>Signup below!</strong></p>
    <a href='/admin/signup'>Signup</a>
    </div>`
    res.send(adminLogin)
});
//GET USER FROM DB
router.post('/login', function(req, res) {
    let adminLogin;
    let userName = req.body.user;
    let userPassword = req.body.password;
    req.app.locals.db.collection('users').find().toArray()
    .then(results=>{
        for (users in results) {
            if(userName == results[users].user && userPassword == results[users].password) {
                adminLogin = `
                <h3>Welcome <u>${results[users].user}</u>, create a new blog post below!</h3>
                <form form action= '/admin/${results[users].id}' method='post'>
                <div>
                <label>Blog title:</label>
                </div>
                <input id='title' name='title' type='text'>
                <div>
                <label>Blogpost:</label>
                </div>
                <textarea id='note' name='note' rows="20" cols="80"></textarea>
                <div>
                <button type='submit'>POST</button>
                </div>
                </form>
                <a href='/admin'>Logout</a>
                `
                res.send(adminLogin);
            }
        }
    })
});
//ADD A USER TO DB
router.get('/signup', function(req, res) {
    let adminSignup = `<div>
    <h3>Signup:</h3>
    <form action= '/admin/signup' method='post'>
    <label>Username: </label>
    <input id='user' name='user' type='text'>
    <label>Password: </label>
    <input id='password'  name='password' type='text'>
    <button type='submit'>signup</button>
    </form>
    <a href='/admin'>Login</a>
    </div>`
    res.send(adminSignup)
});
router.post('/signup', function(req, res) {
    let userName = req.body.user;
    let userPassword = req.body.password;
    let adminSignup;
    req.app.locals.db.collection('users').insertOne({
        id: rand.generate(10),
        user: userName,
        password: userPassword
    }).then(result => {
        adminSignup = `<div>
        <p>You have now signed up a new account!!</p>
        <a href='/admin'>Login</a>
        </div>`
        console.log(result);
        res.send(adminSignup)
    });
});
//ADD NOTES TO DB  
router.post('/:id', function(req, res) {
    let id = req.params.id;
    let newPost;
    console.log(id);
    req.app.locals.db.collection('notes').insertOne({
        noteId: id,
        title: req.body.title,
        note: req.body.note,
        createDate: new Date()
    }).then(result => {
        newPost = `<div>
        <p>You have created a new post!!</p>
        <a href='/admin'>Signout</a>
        </div>`
        console.log(result);
        res.send(newPost)
    });
});
router.get('/users', function(req, res) {
    req.app.locals.db.collection('users').find().toArray()
    .then(results=>{
        res.send(results);
    })
});
router.get('/notes', function(req, res) {
    req.app.locals.db.collection('notes').find().toArray()
    .then(results=>{
        res.send(results);
    })
});

module.exports = router;