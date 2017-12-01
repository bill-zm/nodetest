/**
 * Created by strawmanbobi
 * 2015-05-25
 */

var app = require('../yk_server.js');
var keyCodeService = require('../services/key_code_service.js');

app.get('/yuekong/key_code/get_key_codes', keyCodeService.getKeyCodes);
app.post('/yuekong/key_code/create_key_code', keyCodeService.createKeyCode);