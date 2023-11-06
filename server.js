const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
// const andrea = require('./routes/videos');

app.use(cors());
app.use(express.json());

app.use('/images', express.static('./public/images'));
// app.use('/videos', andrea);
const readData = () => {
    return JSON.parse(fs.readFileSync('./data/video-posts.json', 'utf8'));
};

const writeData = (data) => {
    fs.writeFileSync('./data/video-posts.json', JSON.stringify(data, null, 2), 'utf8');
};

app.get('/videos', (req, res) => {
    const videos = readData();
    res.json(videos.map(({ id, title, channel, image, timestamp, likes, views, comments }) => ({ id, title, channel, image, timestamp, likes, views, comments })));
});

app.get('/videos/:id', (req, res) => {
    const { id } = req.params;
    const videos = readData();
    const video = videos.find((video) => video.id === id);
    if (!video) {
    return res.status(404).json({ message: "No video with that id exists" });
    }
    res.json(video);
});

app.post('/videos', (req, res) => {
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

app.listen(8085, () => {
    console.log('Server listening on port 8085');
});
