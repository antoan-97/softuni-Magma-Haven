const { getErrorMessage } = require('../utils/errorHelper');
const { isAuth, isOwner } = require('../middlewares/authMiddleware');

const photoManager = require('../managers/photoManager');
const Photo = require('../models/Photo');

const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const photos = await photoManager.getAll().lean();
        res.render('photos', { photos })
    } catch (err) {
        res.render('404', { error: getErrorMessage(err) });
    }

})

router.get('/create', isAuth, (req, res) => {
    try {
        res.render('photos/create');
    } catch (err) {
        res.render('404', { error: getErrorMessage(err) });
    }

});

router.post('/create', isAuth, async (req, res) => {
    const photoData = {
        ...req.body,
        owner: req.user._id,
    }

    try {
        await photoManager.create(photoData);
        res.redirect('/photos')
    } catch (err) {
        res.render('photos/create', { error: getErrorMessage(err), photoData })
    }
})


router.get('/:photoId/details', async (req, res) => {
    const photoId = req.params.photoId;
    const { user } = req;
   
        const photo = await photoManager.getOne(photoId).lean();
        const isOwner = req.user?._id == photo.owner?._id;
        const hasVoted = photo.voteList?.some((v) => v?.toString() === user?._id);
        const votesCount = photo.voteList.length
        res.render('photos/details', { photo, isOwner, hasVoted, votesCount, user })
   
})

router.get('/:photoId/delete', isAuth, async (req, res) => {
    const photoId = req.params.photoId;
    try {
        await photoManager.delete(photoId)
        res.redirect('/photos')
    } catch (err) {
        res.render('photos/details', { error: getErrorMessage(err) })
    }
})

router.get('/:photoId/edit', isAuth, isOwner, async (req, res) => {
    const photoId = req.params.photoId;

    try {
        const photo = await photoManager.getOne(photoId).lean();
        res.render('photos/edit', { photo });
    } catch (error) {
        res.render('404', { error: getErrorMessage(err) });
    }

});


router.post('/:photoId/edit', isAuth,  isOwner,async (req, res) => {
    const photoId = req.params.photoId
    const photoData = req.body;
    try {
        await photoManager.edit(photoId, photoData);
        res.redirect(`/photos/${photoId}/details`);
    } catch (err) {
        res.render('photos/edit', { photo: { ...photoData, _id: photoId }, error: getErrorMessage(err) });
    }
})



router.get('/search', async (req, res) => {
    const { name, typeVolcano } = req.query;

    let query = {};
    if (name) {
        query.name = new RegExp(`^${name}$`, 'i'); // Case-insensitive full match
    }
    if (typeVolcano) {
        query.typeVolcano = typeVolcano;
    }

    try {
        const results = await photoManager.search(query);
        res.render('partials/search', { results }); // Render the 'search.hbs' template
    } catch (err) {
        res.render('404', { error: getErrorMessage(err) });
    }
});



router.get('/:photoId/vote', isAuth, async (req, res) => {
    const photoId = req.params.photoId;
    const userId = req.user._id;

    try {
        await photoManager.vote(photoId, userId);
        res.redirect(`/photos/${photoId}/details`);
    } catch (err) {
        res.render('404', { error: getErrorMessage(err) })
    }
});

module.exports = router;




