var express = require('express');
var router = express.Router();
var app = require('../app');
/* GET home page. */

router.post('/express', function(req, res, next) {
  // res.render('index', { title: 'Express' });
    var data = {
        "user4": "111",
        "ret":"0",
    }
    connection.query('SELECT * FROM `city`', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
        res.end(JSON.stringify(results));
    });
    // res.send(JSON.stringify(req.body));
    //   res.send("111"+req.param('uid'));
  //   connection.query("INSERT INTO `student` VALUES (6,'zjamwieiew')", function (error, results, fields) {
  //       // if (error) throw error;
  //       // console.log('The solution is: ', results[0].solution);
  //       if(error){
  //           res.end(JSON.stringify(error));
  //       }
  //       else{
  //           res.end(JSON.stringify(results));
  //       }
  //   });
});

module.exports = router;
