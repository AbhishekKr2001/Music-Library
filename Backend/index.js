const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const songRoutes = require('./routes/songRoutes')
const playlistRoutes = require('./routes/playlistRoutes')
const requireAuth = require('./middleware/requireAuth');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Music', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch(err => {
        console.error(err.message);
        process.exit(1);
    });

// Use express-session middleware
app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: false,

}));
app.use(cors({
    origin: 'http://localhost:3000', // or the URL of your frontend app
    credentials: true // Required for sending cookies in CORS requests
}));
// Middleware 
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/songs', requireAuth.authenticate, songRoutes)
app.use('/playlist', requireAuth.authenticate, playlistRoutes)




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
