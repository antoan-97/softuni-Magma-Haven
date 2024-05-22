const { getErrorMessage } = require('../utils/errorHelper');
const photoManager = require('../managers/photoManager');

const router = require('express').Router();

router.get('/', async (req, res) => {
    const photos = await photoManager.getAll().lean();
    res.render('photos', { photos })
})

router.get('/create', (req, res) => {
    res.render('photos/create');
});

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


router.get('/:photoId/details', async (req, res) => {
    const photoId = req.params.photoId;

    const photo = await photoManager.getOne(photoId).populate('voteList.user').lean();
    const isOwner = req.user?._id == photo.owner?._id;
    const hasVoted = photo.voteList.some(vote => vote.equals(req.user?._id));
    res.render('photos/details', { photo, isOwner, hasVoted })
})

router.get('/:photoId/delete', async (req, res) => {
    const photoId = req.params.photoId;
    try {
        await photoManager.delete(photoId)
        res.redirect('/photos')
    } catch (err) {
        res.render('photos/details', { error: getErrorMessage(err) })
    }
})

router.get('/:photoId/edit', async(req,res) =>{
    const photoId = req.params.photoId;
    const photo = await photoManager.getOne(photoId).lean();
    res.render('photos/edit', { photo });
});


router.post('/:photoId/edit', async (req, res) => {
    const photoId = req.params.photoId
    const photoData = req.body;
    try {
        await photoManager.edit(photoId, photoData);
        res.redirect(`/photos/${photoId}/details`);
    } catch (err) {
        res.render('photos/edit', { error: 'Unsuccessful edit photo!'  });
    }
})

router.get('/search', async (req, res) => {
    const { name, typeVolcano } = req.query;

    let query = {};
    if (name) {
        query.name = new RegExp(name, 'i'); // Case-insensitive regex search
    }
    if (typeVolcano) {
        query.typeVolcano = typeVolcano;
    }

    try {
        const results = await photoManager.search(query);
        res.render('partials/search', { results }); // Render the 'search.hbs' template
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
 
});

module.exports = router;