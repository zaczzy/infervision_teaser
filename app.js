
/**
 * Created by zac on 17-6-18.
 */
var name = null;
var email = null;
var score = -1;
var message = null;
var phone = null;
var date = null;

var __dirname = "/home/admintmp/infervision_teaser";
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
//mongodb setup
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://heroku_481lrz9g:ggcq1214muvkq9fifn9u6tcehm@ds153752.mlab.com:53752/heroku_481lrz9g');
var db = mongoose.connection;
db.once('open', function () {
    const Schema = mongoose.Schema;
    const bodyParser = require('body-parser');
    var userSchema = new Schema({
        name: String,
        email: {
            type: String,
            lowercase: true
        },
        phone: String,
        message: String,
        created_at: Date,
        score: Number
    }, {runSettersOnQuery: true});
    var User = mongoose.model('User', userSchema);
//logging
    const logger = require('morgan');
    app.use(logger('combined'));

//resource routing
    app.use('/', express.static(__dirname));
    app.use('/paper', express.static(__dirname + '/node_modules/paper/dist'));
    app.use('/sweetalert2', express.static(__dirname + '/node_modules/sweetalert2/dist/'));
    app.use('/jquery-ui', express.static(__dirname + '/node_modules/jquery-ui'));
//handlebars
    app.engine('handlebars', exphbs({defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts'}));
    app.set('view engine', 'handlebars');
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
//http request routing
    app.get('/', function (req, res) {
        res.render('home')
    });

    app.listen(process.env.PORT || 5000, function () {
        console.log('Example app listening on port 5000!')
    });

    var saveData = function () {
        if (name && email && phone && message && score > -1) {
            var doc = new User({
                name: name,
                email: email,
                phone: phone,
                message: message,
                created_at: new Date().toDateString(),
                score: score
            });
            var error;
            doc.save(function (e) {
                name = email = phone = message = null;
                score = -1;
                error = e
            });
            if (error) {
                return {result: error, status: 'error'}
            } else {
                return {result: 'Doctor data has been saved!', status: 'success'}
            }
        }
    };

    app.post('/', function (req, res) {
        console.log('Your name is ' + req.body.name);
        console.log('Your email is ' + req.body.email);
        console.log('Your phone number is ' + req.body.phone);
        console.log('Your message is ' + req.body.message);
        name = req.body.name;
        email = req.body.email;
        phone = req.body.phone;
        message = req.body.message;
        res.json(saveData())
    });

    app.post('/score', function (req, res) {
        score = req.body.score;
        console.log('Your score is ' + req.body.score);
        res.json({result: 'success', status: 200});
        saveData();
    });
    app.get('/scoreboard', function (req, res) {
        User.find({}, function (err, docs) {
            res.json(docs)
        })
    });
    app.post('/clear', function (req, res) {
        User.remove({}, function (err) {
            res.json({err: err})
        })
    });
});
