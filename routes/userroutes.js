var express = require('express'); // Express web server framework
var usercontroller = require('../controllers/usercontroller');
const router = express.Router();

router
.route('/:id')
.get(usercontroller.user_details);

module.exports = router;