var express = require('express');
var app = express();
var jsToken = require('./scripts/token');
var bodyParser = require('body-parser');
var jsMail = require('./scripts/mail');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/api/invitaciones', function(req, res) {
    var header=req.headers['authorization'];
    var token=header.split(/\s+/).pop();
    auth=new Buffer(token, 'base64').toString();
    parts=auth.split(/:/);
    username=parts[0];
    password=parts[1];
    var respuesta = new Object();
    if(username == 'franco' && password == '123456'){
      var nombreDoc = req.body.nombreDoc.replace(" ","");
      var mailDoc = req.body.mailDoc;
      var tokenDoc = jsToken.generateToken(nombreDoc);
      tokenDoc = tokenDoc.replace(/=/g , "%3D");

      var nombrePaciente = req.body.nombrePaciente.replace(" ","");
      var mailPaciente = req.body.mailPaciente;
      var tokenPaciente = jsToken.generateToken(nombrePaciente);
      tokenPaciente = tokenPaciente.replace(/=/g , "%3D");

      var room = req.body.room.replace(" ","");

      var urlstart = 'https://vidyio.herokuapp.com/VidyoConnector.html?';
      var autojoin = 'autoJoin=1';
      var host = 'host=prod.vidyo.io';
      var hideConfig = 'hideConfig=1';
      var connectorType = 'connectorType=browser';

      //Primer mail
      var url = urlstart + autojoin + '&' + host + '&' + hideConfig + '&' + connectorType + '&' + 'token=' + tokenDoc + '&' + 'resourceId=' + room + '&' + 'displayName=' + nombreDoc;
      console.log("Doctor: " + url);
      jsMail.sendMail(mailDoc,url);

      //segundo mail
      url = urlstart + autojoin + '&' + host + '&' + hideConfig + '&' + connectorType + '&' + 'token=' + tokenPaciente + '&' + 'resourceId=' + room + '&' + 'displayName=' + nombrePaciente;
      console.log("Paciente: " + url);
      jsMail.sendMail(mailPaciente,url);

      respuesta.value = true;
      respuesta.message = "Todo perfecto";
    }
    else {
      respuesta.value = false;
      respuesta.message = 'Usuario o contraseña incorrecto';
    }
    res.json(respuesta);
  });
app.listen(3000);
console.log('running on port 3000');
