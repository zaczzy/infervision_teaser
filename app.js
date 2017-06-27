/**
 * Created by zac on 17-6-18.
 */
var __dirname = "/home/zac/WebstormProjects/infervision_teaser";
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/teaserDB');
const Schema = mongoose.Schema;
const bodyParser = require('body-parser');
var userSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    created_at: Date
});
var User = mongoose.model('User', userSchema);
const logger;
//resource routing
app.use('/', express.static(__dirname));
app.use('/paper', express.static(__dirname + '/node_modules/paper/dist'));
app.use('/sweetalert2', express.static(__dirname + '/node_modules/sweetalert2/dist/'));
//handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//http request routing
app.get('/', function (req, res) {
    res.render('home')
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

app.post('/', function (req, res) {
   console.log('Your name is ' + req.body.name);
   console.log('Your email is ' + req.body.email);
   console.log('Your phone number is ' + req.body.phone);
   console.log('Your message is ' + req.body.message);
   console.log('Entry created at: ' + new Date());
   res.send(req.body);
});