const router = require('express').Router();
const homeController = require('./controllers/homeController');
const userController = require('./controllers/userController');
const photoController = require('./controllers/photoController');



router.use(homeController);
router.use('/users', userController);
router.use('/photos', photoController);


module.exports = router