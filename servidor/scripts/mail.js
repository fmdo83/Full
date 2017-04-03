var helper = require('sendgrid').mail;
//Cambiar por Key de sendgrid PROD.
var sg = require('sendgrid')('');
fs = require('fs');

function sendMail(to_email, url)
{
  var message = fs.readFileSync('./extras/message.html', 'utf8');
  var to_email = new helper.Email(to_email);
  var from_email = new helper.Email("info@cdt.com");
  var subject = "CONSULTA MEDICA";
  message = message.replace('URLVYDIO', url);
  //Content poner html del mail.
  content = new helper.Content("text/html", message);
  var mail = new helper.Mail(from_email, subject, to_email, content);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });
  //request.headers['Access-Control-Allow-Origin'] = '*'
  sg.API(request, function(error, response) {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  })
};

function validateEmail(email)
{
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

module.exports.sendMail = sendMail;
module.exports.validateEmail = validateEmail;
