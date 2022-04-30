var express = require('express'); // Express web server framework

const playlistcontroller = require('../controllers/playlistcontroller');
const router = express.Router();

router
.route('/export/:id')
.post(playlistcontroller.export2spotify);

module.exports = router;