var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Keeper' });
});
/* GET Redirect page. */
router.get('/redirect', function(req, res) {
	// console.log(req.params);
  res.render('redirect', { title: 'Auth Success' });
});
/* GET Test page. */
router.get('/test', function(req, res) {
  res.render('test', { title: 'Keeper Test' });
});
module.exports = router;
