var express = require('express'); // Express web server framework

const libraryController = require('../controllers/librarycontroller');
const router = express.Router();

router
.route('/newrelease/:id')
.get(libraryController.new_release);

router
.route('/:id')
.get(libraryController.mylibrary);

router
.route('/:id/item/:lib_id/type/:type')
.put(libraryController.add2library)
.delete(libraryController.remove4rmlibrary);

module.exports = router;