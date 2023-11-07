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
        channel: 'Christian Garcia',
        image: 'http://localhost:8085/images/upload-video-preview.jpg',
        views: "1,001,023",
        likes: "110,985",
        duration: "4:01",
        video: "https://project-2-api.herokuapp.com/stream",
        timestamp: 1626032763000,
        comments: [
            {
                id: "35bba08b-1b51-4153-ba7e-6da76b5ec1b9",
                name: "Micheal Lyons",
                comment: "They BLEW the ROOF off at their last event, once everyone started figuring out they were going. This is still simply the greatest opening of an event I have EVER witnessed.",
                likes: 0,
                timestamp: 1628522461000
            },
            {
                id: "091de676-61af-4ee6-90de-3a7a53af7521",
                name: "Gary Wong",
                comment: "Every time I see him shred I feel so motivated to get off my couch and hop on my board. He’s so talented! I wish I can ride like him one day so I can really enjoy myself!",
                likes: 0,
                timestamp: 1626359541000
            },
        ]
    };

    videos.push(newVideo);
    writeData(videos);
    res.status(201).json(newVideo);
});

module.exports = router;