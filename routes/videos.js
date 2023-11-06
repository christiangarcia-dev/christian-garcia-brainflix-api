const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const readData = () => {
    return JSON.parse(fs.readFileSync('./data/video-posts.json', 'utf8'));
};

const writeData = (data) => {
    fs.writeFileSync('./data/video-posts.json', JSON.stringify(data, null, 2), 'utf8');
};

router.get('/', (req, res) => {
    const videos = readData();
    res.json(videos.map(({ id, title, channel, image, timestamp, likes, views, comments }) => ({ id, title, channel, image, timestamp, likes, views, comments })));
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const videos = readData();
    const video = videos.find((video) => video.id === id);
    if (!video) {
    return res.status(404).json({ message: "No video with that id exists" });
    }
    res.json(video);
});

router.post('/', (req, res) => {
    const videos = readData();
    const { title, description, channel } = req.body;

    const newVideo = {
        id: uuidv4(),
        title,
        description,
        channel,
        image: '/public/images/upload-video-preview.jpg', 
    };

    videos.push(newVideo);
    writeData(videos);
    res.status(201).json(newVideo);
});

module.exports = router;