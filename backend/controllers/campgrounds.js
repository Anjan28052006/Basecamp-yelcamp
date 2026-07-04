if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const Campground = require('../module/campground');
const { cloudinary } = require('../cloudinary/index');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.indexPage = async (req, res) => {
    const camp = await Campground.find({});
    res.json({ camp, maptilerApiKey: process.env.MAPTILER_API_KEY });
}

module.exports.newForm = async (req, res) => {
    res.json({ message: 'ok' });
}

module.exports.createNew = async (req, res, next) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    if (!geoData.features?.length) {
        return res.status(400).json({ error: true, status: 400, message: 'Could not geocode that location. Please try again and enter a valid location.' });
    }
    const cmp = new Campground(req.body.campground)
    cmp.geometry = geoData.features[0].geometry;
    cmp.location = geoData.features[0].place_name;
    cmp.image = (req.files || []).map(f => ({ url: f.path, filename: f.filename }))
    cmp.author = req.user._id;
    await cmp.save();
    res.status(201).json({ message: 'successfully created a new campground', campground: cmp });
}

module.exports.findForUpdate = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.json({ campground });
}

module.exports.update = async (req, res) => { // using the middleware validatecampground
    const { id } = req.params;
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    if (!geoData.features?.length) {
        return res.status(400).json({ error: true, status: 400, message: 'Could not geocode that location. Please try again and enter a valid location.' });
    }
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    campground.geometry = geoData.features[0].geometry;
    campground.location = geoData.features[0].place_name;
    const images = (req.files || []).map(f => ({
        url: f.path,
        filename: f.filename,
    }))
    campground.image.push(...images); // spread the elements of the images array
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }
    res.json({ message: 'Sucessfully edited the campground', campground });
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.json({ message: 'Successfully deleted the campground' });
}

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        return res.status(404).json({ error: true, status: 404, message: 'Campground not found' });
    }
    res.json({ campground, maptilerApiKey: process.env.MAPTILER_API_KEY });
}
