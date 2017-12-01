/**
 * Created by strawmanbobi
 * 2015-05-17
 */

var app = require('../yk_server.js');
var versionService = require('../services/version_service.js');
var updateRecordService = require('../services/update_record_service.js');

app.get('/yuekong/version/get_latest_version', versionService.getLatestVersion);
app.get('/yuekong/version/get_latest_version_simple', versionService.getLatestVersionSimple);
app.get('/yuekong/version/get_version_by_id', versionService.getVersionByID);
// app.get('/web/update/:bin_file', versionService.downloadImage);
app.get('/yuekong/version/list_update_records', updateRecordService.listUpdateRecord);

app.post('/yuekong/version/publish_version', versionService.publishVersion);
app.post('/yuekong/version/update_update_record', updateRecordService.updateUpdateRecord);