var express = require('express'); // Express web server framework

const tokencontroller = require('../controllers/tokencontroller');
const router = express.Router();

router
.route('/:id')
.get(tokencontroller.get_cur_token);

router
.route('/:access_token')
.post(tokencontroller.setup_accesstoken);

module.exports = router;