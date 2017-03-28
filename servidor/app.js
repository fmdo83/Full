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
    if(username == 'franco' && password == '123456')
    {
      var nombreDoc = req.body.nombreDoc.replace(" ","");
      var mailDoc = req.body.mailDoc;
      var nombrePaciente = req.body.nombrePaciente.replace(" ","");
      var mailPaciente = req.body.mailPaciente;
      var room = req.body.room.replace(" ","");
      var valid = validateForm(nombreDoc, mailDoc, nombrePaciente, mailPaciente, room);
      if(valid.value == true)
      {
        var tokenDoc = jsToken.generateToken(nombreDoc);
        tokenDoc = tokenDoc.replace(/=/g , "%3D");
        var tokenPaciente = jsToken.generateToken(nombrePaciente);
        tokenPaciente = tokenPaciente.replace(/=/g , "%3D");
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
        respuesta.message = valid.message;
      }
    }
    else {
      respuesta.value = false;
      respuesta.message = 'Usuario o contraseña incorrecto';
    }
    res.json(respuesta);
  });
app.listen(3000);
console.log('running on port 3000');

function validateForm(nombreDoc, mailDoc, nombrePaciente, mailPaciente, room)
{
   var valid = new Object();
   valid.value = false;
   valid.message = "";
   if(nombreDoc == "")
      valid.message += "Nombre doctor no valido\n";
   if(!jsMail.validateEmail(mailDoc))
      valid.message += "Mail doctor no valido\n";
   if(nombrePaciente == "")
      valid.message += "Nombre paciente no valido\n";
   if(!jsMail.validateEmail(mailPaciente))
      valid.message += "Mail paciente no valido\n";
   if(room == "")
      valid.message += "Room no valido\n";
   return valid;
}
