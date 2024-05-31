const Photo = require('../models/Photo');


exports.create = (photoData) => Photo.create(photoData);

exports.getAll = () => Photo.find().populate('owner');

exports.getOne = (photoId) => Photo.findById(photoId).populate('owner')

exports.delete = (photoId) => Photo.findByIdAndDelete(photoId);

exports.edit = (photoId,photoData) => Photo.findByIdAndUpdate(photoId, photoData, { runValidators: true, new: true });

exports.search = (query) => {
    return Photo.find(query).lean();
};

exports.vote = async (photoId, userId) => {
    const photo = await Photo.findById(photoId);

    if (!photo) {
        throw new Error('Photo not found');
    }

    // Check if the user has already voted
    if (photo.voteList.includes(userId)) {
        return;
    }

    photo.voteList.push(userId);
    return photo.save();
};