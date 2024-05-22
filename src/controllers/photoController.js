const { getErrorMessage } = require('../utils/errorHelper');
const photoManager = require('../managers/photoManager');

const router = require('express').Router();

router.get('/', async (req, res) => {
    const photos = await photoManager.getAll().lean();
    res.render('photos', { photos })
})

router.post('/create', async (req, res) => {
    const photoData = {
        ...req.body,
        owner: req.user._id,
    }

    try {
        await photoManager.create(photoData);
        res.redirect('/photos')
    } catch (err) {
        res.render('photos/create', { error: getErrorMessage(err) })
    }
})

