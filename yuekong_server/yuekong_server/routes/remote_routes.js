/**
 * Created by strawmanbobi
 * 2015-02-02
 */

var app = require('../yk_server.js');
var remoteIndexService = require('../services/remote_index_service.js');
var remoteService = require('../services/remote_service.js');

// remote index related
app.post('/yuekong/remote/match_remote', remoteIndexService.matchRemote);
app.get('/yuekong/remote/list_categories', remoteIndexService.listCategories);
app.get('/yuekong/remote/list_brands', remoteIndexService.listBrands);
app.get('/yuekong/remote/list_popular_brands', remoteIndexService.listPopularBrands);
app.get('/yuekong/remote/list_remote_indexes', remoteIndexService.listRemoteIndexes);
app.get('/yuekong/remote/list_remote_indexes_by_operator', remoteIndexService.listRemoteIndexesByOperator);
app.get('/rb/:file_name', remoteIndexService.downloadRemoteBin);
app.get('/rbc/:file_name', remoteIndexService.downloadRemoteBinCached);
app.get('/yuekong/remote/get_ble_remote_index', remoteIndexService.getBleRemoteIndex);
app.get('/yuekong/remote/count_user_remote_indexes', remoteIndexService.countUserRemoteIndexes);
app.get('/yuekong/remote/list_user_remote_indexes', remoteIndexService.listUserRemoteIndexes);

// remote instance related
app.post('/yuekong/remote/create_remote_instance', remoteService.createRemoteInstance);
app.post('/yuekong/remote/bind_remote_instance', remoteService.bindRemoteInstance);
app.post('/yuekong/remote/reset_remote_instance', remoteService.resetRemoteInstance);
app.post('/yuekong/remote/rename_remote_instance', remoteService.renameRemoteInstance);
app.post('/yuekong/remote/update_remote_instance', remoteService.updateRemoteInstance);
app.get('/yuekong/remote/list_remote_instances', remoteService.listRemoteInstances);

// ce remote related
app.post('/yuekong/remote/create_remote', remoteService.createRemote);
app.post('/yuekong/remote/update_remote', remoteService.updateRemote);
app.post('/yuekong/remote/delete_remote', remoteService.deleteRemote);

app.get('/yuekong/remote/list_remotes', remoteService.listRemotes);
app.get('/yuekong/remote/get_remote_info', remoteService.getRemoteInfo);

// ce remote sirius related
app.post('/yuekong/remote/create_sirius_remote', remoteService.createSiriusRemote);
app.get('/yuekong/remote/list_remotes_by_room', remoteService.listRemotesByRoom);
app.get('/yuekong/remote/list_remotes_by_room_and_category', remoteService.listRemotesByRoomAndCategory);
app.get('/yuekong/remote/list_remotes_by_sirius_id', remoteService.listRemotesBySiriusID);
app.get('/yuekong/remote/list_stb_remotes_by_sirius_id', remoteService.listStbRemotesBySiriusID);

app.post('/yuekong/remote/create_remote_relationship', remoteService.createRemoteRelationship);
app.post('/yuekong/remote/delete_remote_relationship', remoteService.deleteRemoteRelationship);
app.get('/yuekong/remote/get_remote_relationship', remoteService.getRemoteRelationship);

// remote management related
app.post('/yuekong/remote/publish_brands', remoteIndexService.publishBrands);
app.post('/yuekong/remote/publish_remote_indexes', remoteIndexService.publishRemoteIndexes);
app.post('/yuekong/remote/create_brand', remoteIndexService.createBrand);
app.post('/yuekong/remote/delete_remote_index', remoteIndexService.deleteRemoteIndex);
app.post('/yuekong/remote/publish_ble_remote_index', remoteIndexService.publishBleRemoteIndex);