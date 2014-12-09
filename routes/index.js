var express = require('express');
var router = express.Router();

/*GET Hello World*/
router.get('/hw', function(req, res) {
  res.render('hw', { title: 'Hello World' });
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
