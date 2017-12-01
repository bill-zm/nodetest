/**
 * Created by strawmanbobi
 * 2015-05-17
 */

var app = require('../yk_server.js');
var statService = require('../services/stat_service.js');

// generic statistics
app.get('/yuekong/stat/generic_count', statService.genericCount);
app.get('/yuekong/stat/generic_stat', statService.genericStat);

app.get('/yuekong/stat/stat_categories', statService.statCategories);
app.get('/yuekong/stat/stat_brands', statService.statBrands);
app.get('/yuekong/stat/stat_cities', statService.statCities);

// log statistics
app.post('/yuekong/stat/create_stat', statService.createStat);

// upgrade statistics
app.get('/yuekong/stat/get_upgrade_stat', statService.listUpdateRecords);