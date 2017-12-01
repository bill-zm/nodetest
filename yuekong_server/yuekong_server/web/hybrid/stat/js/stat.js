/**
 * Created by Strawmanbobi
 * 2016-01-04
 */

var appKey = "d6119900556c4c1e629fd92d";
var appToken = "fcac5496cba7a12b3bae34abf061f526";

var categoriesStated = false;
var colorClass = ["default", "primary", "success", "warning", "danger", "info"];

// global container var
var gCategories = [];
// 2-dimensions brand array
var gBrands = [];
// 1-dimension city array
var gCities = [];

$(document).ready(function() {
    onStatCategories();
});

///////////////////////////// Event functions /////////////////////////////
function onStatCategories() {
    if (true == categoriesStated) {
        return;
    }
    console.debug("stat categories");
    statCategories();
}

function onStatBrands(categoryIndex) {
    var categoryID = 0;
    if (true == gBrands[categoryIndex].brandStated) {
        return;
    }
    categoryID = gCategories[categoryIndex].id;

    if (3 != categoryID) {
        statBrands(gCategories[categoryIndex].id, categoryIndex);
    } else {
        statCities(gCategories[categoryIndex].id, categoryIndex);
    }
}

///////////////////////////// Data functions /////////////////////////////
function statCategories() {
    $.ajax({
        url: "/yuekong/stat/stat_categories?app_key="+appKey+"&app_token="+appToken,
        type: "GET",
        timeout: 20000,
        success: function (response) {
            if(response.status.code == 0) {
                gCategories = response.entity;
                refreshCategoryList();
            } else {
                console.log("stat categories failed");
            }
        },
        error: function () {
            console.log("stat categories failed");
        }
    });
}

function statBrands(categoryID, categoryIndex) {
    $.ajax({
        url: "/yuekong/stat/stat_brands?category_id="+categoryID + "&app_key="+appKey+"&app_token="+appToken,
        type: "GET",
        timeout: 20000,
        success: function (response) {
            if(response.status.code == 0) {
                gBrands[categoryIndex].brands = response.entity;
                // console.log("brands stat result = " + JSON.stringify(gBrands[categoryIndex].brands));
                refreshBrandList(categoryID, categoryIndex);
            } else {
                console.log("stat brands failed");
            }
        },
        error: function () {
            console.log("stat brands failed");
        }
    });
}

function statCities(categoryID, categoryIndex) {
    $.ajax({
        url: "/yuekong/stat/stat_cities?app_key="+appKey+"&app_token="+appToken,
        type: "GET",
        timeout: 20000,
        success: function (response) {
            if(response.status.code == 0) {
                gCities.cities = response.entity;
                console.log("cities stat result = " + JSON.stringify(gCities.cities));
                refreshCityList(categoryID, categoryIndex);
            } else {
                console.log("stat cities failed");
            }
        },
        error: function () {
            console.log("stat cities failed");
        }
    });
}

///////////////////////////// UI functions /////////////////////////////
function refreshCategoryList() {
    var categoryContent = "";
    gBrands = new Array();
    for (var i = 0; i < gCategories.length; i++) {
        var category = gCategories[i];
        if (category.id == 11) {
            continue;
        }
        var panelID = "category_" + category.id;
        var collapseID = "collapse" + category.id;
        var colorSpace = i % 6;
        var includingText = "";
        if (3 != category.id) {
            includingText = "个品牌";
        } else {
            includingText = "个省份";
        }
        console.log(colorClass[colorSpace]);
        categoryContent +=
            "<div class='panel panel-default'>" +
                "<div class='panel-heading' role='tab' id='" + panelID + "'>" +
                    "<h4 class='panel-title' style='text-align:left;'>" +
                        "<a style='display: block; width: 100%; text-decoration: none;'" +
                            "role='button' data-toggle='collapse' data-parent='#categories_panel'" +
                            "href='#" + collapseID +"' onclick='onStatBrands(" + i + ")' " +
                            "aria-expanded='true' aria-controls='" + collapseID + "'>" +
                            category.name + " (" + category.brands_count + " " + includingText + ")" +
                        "</a>" +
                    "</h4>" +
                "</div>" +
                "<div id='" + collapseID + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='headingOne'>" +
                    "<div class='panel-body' style='text-align:left;' id='brand_charts_" + category.id + "'>" +
                        "正在加载..." +
                    "</div>" +
                "</div>" +
            "</div>";
        gBrands[i] = new Array();
        gBrands[i].brandStated = false;
    }
    $("#categories_panel").html(categoryContent);
    categoriesStated = true;
}

function refreshBrandList(categoryID, categoryIndex) {
    // draw charts with highcharts
    // adjust the container of charts according to the number of brands in this category
    var containerHeight = gBrands[categoryIndex].brands.length * 30 + 200;
    console.log("container height = " + containerHeight);
    $("#brand_charts_" + categoryID).css("width", "100%");
    $("#brand_charts_" + categoryID).css("height", containerHeight + "px");
    $("#brand_charts_" + categoryID).css("padding", "0px");

    // generate brand names and supported remote index counts
    var brandNames = [];
    var remoteIndexCounts = [];
    for (var i = 0; i < gBrands[categoryIndex].brands.length; i++) {
        brandNames[i] = gBrands[categoryIndex].brands[i].name;
        remoteIndexCounts[i] = gBrands[categoryIndex].brands[i].remote_indexes_count;
    }

    $("#brand_charts_" + categoryID).highcharts({
        chart: {
            type: "bar",
            events: {
                load: function(event) {
                    // nothing to do
                }
            }
        },
        title: {
            text: gCategories[categoryIndex].name + "品牌分布"
        },
        xAxis: {
            categories: brandNames
        },
        yAxis: {
            title: {
                text: '支持型号数'
            }
        },
        series: [{
            name: '型号数',
            data: remoteIndexCounts,
            dataLabels: {
                enabled: false
            }
        }]
    });

    gBrands[categoryIndex].brandStated = true;
}

function refreshCityList(categoryID, categoryIndex) {
    // draw charts with highcharts
    // adjust the container of charts according to the number of brands in this category
    var containerHeight = gCities.cities.length * 30 + 200;
    console.log("container height = " + containerHeight);
    $("#brand_charts_" + categoryID).css("width", "100%");
    $("#brand_charts_" + categoryID).css("height", containerHeight + "px");
    $("#brand_charts_" + categoryID).css("padding", "0px");

    // generate brand names and supported remote index counts
    var provinceNames = [];
    var cityCounts = [];
    for (var i = 0; i < gCities.cities.length; i++) {
        provinceNames[i] = gCities.cities[i].name;
        cityCounts[i] = gCities.cities[i].city_count;
    }

    $("#brand_charts_" + categoryID).highcharts({
        chart: {
            type: "bar",
            events: {
                load: function(event) {
                    // nothing to do
                }
            }
        },
        title: {
            text: gCategories[categoryIndex].name + "地区分布"
        },
        xAxis: {
            categories: provinceNames
        },
        yAxis: {
            title: {
                text: '支持城市数'
            }
        },
        series: [{
            name: '城市数',
            data: cityCounts,
            dataLabels: {
                enabled: true
            }
        }]
    });

    gBrands[categoryIndex].brandStated = true;
}