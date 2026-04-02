require('dotenv').config()
const express = require('express');
const cors = require('cors');
const path = require("path");
const fs = require("fs");
const bodyParser = require('body-parser');
const {routes }  = require('./routes/routes');
const {adminRoutes} = require("./routes/adminRoutes")

const cookieParser = require('cookie-parser');

const app = express();

// const apires = require('./Controllers/thirdPartyApi/thirdParty')

/////////////////// SSL CODE ADDED
// var fs = require('fs');
// var http = require('http');
// var https = require('https');
// var privateKey = fs.readFileSync('ssl/privkey.pem', 'utf8');
// var certificate = fs.readFileSync('ssl/fullchain.pem', 'utf8');

// var credentials = {key: privateKey, cert: certificate};
 
// var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

//////////////////////////////////////


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors('*'));
// {
//   origin: ['https://espsofttech.org','http://localhost:3000', 'http://localhost:3001'],
//   optionsSuccessStatus: 200 ,
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// }
app.get('/api/user/public/invoices/:image', (req, res) => {
    const fileName = req.params.image;
    const filePath = path.join(__dirname, 'public', 'invoices', fileName);
  
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).send('File not found');
      }
  
      res.sendFile(filePath, (err) => {
        if (err) {
          res.status(500).send('Error sending file');
        }
      });
    });
  });

console.log("HII")

app.get("/", function (req, res) {
res.send('Node is running');
})

app.use('/api/user/', routes)
app.use('/api/admin/', adminRoutes)

// if (module === require.main) {
//     var server = app.listen( 8000, function () {
//         var port = server.address().port;
//     });
// }



var server = app.listen(8000, function () {
//   var server = httpsServer.listen(process.env.PORT || 6029, function () {
        var port = server.address().port;
        console.log("App listening on port %s", port);

    });