const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors()); 

// Static Data
// src/cardData.js
const listings = [
    {
        id: 1,
        title: "Apartment in City Center",
        description: "Live in Healthy Environment.",
        price: 120,
        image: "../public/listings.jpeg",
        type: "Apartment",
        guests: 4,
        category: "apartment",
        rating: 4.7,
    },
    {
        id: 2,
        title: "Luxury Beach House",
        description: "Enjoy your life with amazing view",
        price: 300,
        image: "../public/listings.jpeg",
        type: "House",
        guests: 8,
        category: "house",
        rating: 4.9,
    },
    {
        id: 3,
        title: "Woods Cottage",
        description: "Peace your lives with nature.",
        price: 150,
        image: "../public/listings.jpeg",
        type: "Cottage",
        guests: 2,
        category: "cottage",
        rating: 4.8,
    },
    {
        id: 4,
        title: "Modern Studio with City View",
        description: "A stylish studio with a breathtaking view of the skyline.",
        price: 100,
        image: "../public/listings.jpeg",
        type: "Studio",
        guests: 2,
        category: "apartment",
        rating: 4.5,
    },
    {
        id: 5,
        title: "Rustic Farmhouse Retreat",
        description: "A relaxing farmhouse retreat with scenic views.",
        price: 180,
        image: "../public/listings.jpeg",
        type: "Farmhouse",
        guests: 6,
        category: "house",
        rating: 4.6,
    },
    {
        id: 6,
        title: "Elegant Condo Near the Beach",
        description: "Stay in this beautiful condo just a short walk from the beach.",
        price: 250,
        image: "../public/listings.jpeg",
        type: "Condo",
        guests: 5,
        category: "apartment",
        rating: 4.8,
    },
    {
        id: 7,
        title: "Ski Chalet in the Mountains",
        description: "Perfect for winter getaways, this chalet is close to ski resorts.",
        price: 220,
        image: "../public/listings.jpeg",
        type: "Chalet",
        guests: 8,
        category: "house",
        rating: 4.7,
    },
    {
        id: 8,
        title: "Downtown Loft with Open Concept",
        description: "An urban loft with an open floor plan and modern amenities.",
        price: 130,
        image: "../public/listings.jpeg",
        type: "Loft",
        guests: 3,
        category: "apartment",
        rating: 4.5,
    },
    {
        id: 9,
        title: "Quaint Bungalow with Garden",
        description: "A lovely bungalow featuring a beautiful garden.",
        price: 160,
        image: "../public/listings.jpeg",
        type: "Bungalow",
        guests: 4,
        category: "house",
        rating: 4.6,
    },
    {
        id: 10,
        title: "Luxury Villa with Pool",
        description: "Experience luxury living in this spacious villa with a private pool.",
        price: 500,
        image: "../public/listings.jpeg",
        type: "Villa",
        guests: 10,
        category: "house",
        rating: 4.9,
    }
];


const bookings = [];

// Routes
app.get('/api/listings', (req, res) => {
    try {
        res.status(200).json(listings);
    }
    catch (error) {
        res.status(500).json("There is error while Fetching Data From Linstings");
    }
});

app.get('/api/listings/:id', (req, res) => {
    const listing = listings.find(l => l.id === parseInt(req.params.id));
    if (!listing) return res.status(404).json('Listing not found');
    res.status(200).json(listing);
});


app.get('/api/listings/search', (req, res) => {
    const query = req.query.query?.toLowerCase();
    const filtered = listings.filter(loc => loc.location.toLowerCase().includes(query));
    res.status(200).json(filtered);
});



app.post('/api/booking/:id', (req, res) => {
    const { checkIn, checkOut } = req.body;
    const { id } = req.params;  
    console.log('Data Received');
    if (!checkIn || !checkOut) {
        return res.status(400).json({ message: 'Missing check-in or check-out dates' });
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
        return res.status(400).json({ message: 'Check-in date must be earlier than check-out date' });
    }

    const newBooking = { listingId: id, checkIn, checkOut };
    bookings.push(newBooking);  

    res.status(200).json({ message: 'Booking created successfully', booking: newBooking });
});


app.get('/api/bookings', (req, res) => {
    res.json(bookings);  
});




app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
