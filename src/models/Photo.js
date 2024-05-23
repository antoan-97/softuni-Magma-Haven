const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        minLength: [2, 'Name should be at least 2 characters!'],
    },
    location:{
        type:String,
        required:true,
        minLength: [3, 'Location should be at least 3 characters!'],
    },
    elevation:{
        type:Number,
        required:true,
        min: [0, 'Elevation should be minimum 0!']
    },
    lastEruption:{
        type:Number,
        required:true,
        min: [0, 'The Year of last eruption should be between 0 and 2024!'],
        max: [2024, 'The Year of last eruption should be between 0 and 2024!']
    },
    image:{
        type:String,
        required:true,
        match:[/^https?:\/\//, 'Invalid URL!']
    },
    typeVolcano:{
        type:String,
        enum: ['Supervolcanoes', 'Submarine', 'Subglacial', 'Mud', 'Stratovolcanoes', 'Shield'],
        required:true,
    },
    description:{
        type:String,
        required:true,
        minLength: [10,'Description should be at least 10 characters!']
    },
    voteList:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    owner:{
        type:mongoose.Types.ObjectId,
        ref:'User',
    },
})


const Photo = mongoose.model('Photo',photoSchema);

module.exports = Photo;