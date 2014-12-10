var express = require('express');

module.exports = function (app){

  var router = express.Router(),
  mongoskin = require('mongoskin');

  var db = mongoskin.db('mongodb://@localhost:27017/keeper', {safe:true})

  /* GET success true */
  router.get('/', function(req, res) {
    res.send({success:true});
  });

  /* GET success true */
  router.get('/test', function(req, res) {
    res.send({success:true});
  });

  return router;
  
};
