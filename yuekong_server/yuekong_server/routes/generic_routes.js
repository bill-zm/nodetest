/**
 * Created by strawmanbobi
 * 2015-01-22.
 */

var app = require('../yk_server.js');
var geoService = require('../services/geo_service.js');
var redirService = require('../services/redir_service.js');
var testService = require('../services/test_service.js');
var switchService = require('../services/switch_service.js');

// geoService
app.get('/yuekong/city/list_provinces', geoService.listProvinces);
app.get('/yuekong/city/list_cities', geoService.listCities);
app.get('/yuekong/city/list_city_areas', geoService.listCityAreas);

app.get('/yuekong/city/list_covered_cities', geoService.listCoveredCities);
app.get('/yuekong/operator/list_operators', geoService.listOperators);

// switchService
app.get('/yuekong/switch/get_switch', switchService.getSwitch);

// update redirection
app.get('/ucdown', redirService.redirectDownload);
app.get('/ucpurchase', redirService.redirectPurchase);
// app.get('/web/update/:bin_file', redirService.binDownldoad);

// for test
app.get('/test', testService.haveSomeTest);