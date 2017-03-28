var helper = require('sendgrid').mail;
var sg = require('sendgrid')('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');

function sendMail(to_email, url)
{
  var to_email = new helper.Email(to_email);
  var from_email = new helper.Email("info@cdt.com");
  var subject = "CONSULTA MEDICA";
  content = new helper.Content("text/plain", url);
  var mail = new helper.Mail(from_email, subject, to_email, content);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  sg.API(request, function(error, response) {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  })
};

module.exports.sendMail = sendMail;
