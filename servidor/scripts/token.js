var jsSHA = require('./sha');

function generateToken(userName) {
    var EPOCH_SECONDS = 62167219200;
    var key = "a0fe73330da64709a769272ef597ba23";
    var appID = "8f70c2.vidyo.io";
    var expiresInSeconds = 7200;
    var expires = Math.floor(Date.now() / 1000) + expiresInSeconds + EPOCH_SECONDS;
    var shaObj = new jsSHA("SHA-384", "TEXT");
    shaObj.setHMACKey(key, "TEXT");
    jid = userName + '@' + appID;
    var body = 'provision' + '\x00' + jid + '\x00' + expires + '\x00';
    shaObj.update(body);
    var mac = shaObj.getHMAC("HEX");
    var serialized = body + '\0' + mac;
    //console.log("Genere Token para: " + userName);
    return new Buffer(serialized).toString('base64');
}

module.exports.generateToken = generateToken;
