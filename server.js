const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const path = require("path");


const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/listSchools', (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }

    const query = 'SELECT * FROM schools';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error.' });
        }

        const userLocation = { lat: parseFloat(latitude), lon: parseFloat(longitude) };

        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const toRad = (value) => (value * Math.PI) / 180;
            const R = 6371; // Radius of Earth in km
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
        };

        results.forEach((school) => {
            school.distance = calculateDistance(
                userLocation.lat,
                userLocation.lon,
                school.latitude,
                school.longitude
            );
        });

        results.sort((a, b) => a.distance - b.distance);

        res.json(results);
    });
});


app.post('/addSchool', (req, res) => {
    const { name, address, latitude, longitude } = req.body;
    console.log(req.body);
    // Validate inputs
    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(query, [name, address, latitude, longitude], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error.' });
        }
        // res.status(201).json({ message: 'School added successfully.' });
    });
    res.redirect('/');
});


app.get('/', (req, res) => {
    res.render('index');
})