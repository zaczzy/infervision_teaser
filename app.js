/**
 * Created by zac on 17-6-18.
 */
var __dirname = "/home/zac/WebstormProjects/infervision_teaser";

const express = require('express');
const app = express();
const exphbs = require('express-handlebars');

//resource routing
app.use('/public', express.static(__dirname + '/public'));
app.use('/paper', express.static(__dirname + '/node_modules/paper/dist'));
app.use('/sweetalert2', express.static(__dirname + '/node_modules/sweetalert2/dist/'));
//handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts'}));
app.set('view engine', 'handlebars');





//http request routing
app.get('/', function (req, res) {
    res.render('home')
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});