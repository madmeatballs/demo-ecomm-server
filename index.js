const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());

//connect to mongodb database
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    console.log("Server Online!")
	res.send("Successfully hosted online")
})


//routes
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const userRoutes = require('./routes/user');

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Now connected to cloud database: MongoDB Atlas'));
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});