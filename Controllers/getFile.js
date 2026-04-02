const path = require('path')
const fs = require('fs')

const sendIfExists = (res, filePath) => {
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
    }
    return res.sendFile(filePath);
};
exports.getImage = async (req, res) => {
    const image = req.params.image;
    if (!image) {
        return res.status(400).json({ message: 'Image is required' });
    }
    const myPath = path.resolve(process.cwd(), "public", image);
    return sendIfExists(res, myPath);
}

exports.getFlagImage = async (req, res) => {
    const image = req.params.image;
    if (!image) {
        return res.status(400).json({ message: 'Image is required' });
    }
    const myPath = path.resolve(process.cwd(), "public/flag", image);
    return sendIfExists(res, myPath);
}

exports.getBannerVideo = async (req, res) => {
    const file = req.params.video;
    if (!file) {
        return res.status(400).json({ message: 'Video is required' });
    }
    const myPath = path.resolve(process.cwd(), "public/bannerVideo", file);
    return sendIfExists(res, myPath);
}
