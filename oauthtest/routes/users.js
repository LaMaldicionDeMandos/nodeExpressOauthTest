var express = require('express');
var router = express.Router();

/* GET users listing. */
// El usuario automaticamente queda en el req
router.get('/', function(req, res) {
	console.log("Render Users Page");
  res.send('Hola... ' + req.user.profile.displayName);
});

module.exports = router;
