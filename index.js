const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kzt0x.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());
// app.use(express.static('doctors'));
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const ordersCollection = client.db("creativeAgency").collection("orders");
    const servicesCollection = client.db("creativeAgency").collection("services");
    const reviewsCollection = client.db("creativeAgency").collection("reviews");
    const adminsCollection = client.db("creativeAgency").collection("admins");


    // Add a new Admin
    app.post('/addAdmin', (req, res) => {
        const admin = req.body;
        adminsCollection.insertOne(admin)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });
    
    // Add a new Review
    app.post('/addReview', (req, res) => {
        const review = req.body;
        reviewsCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    // Show all Reviews
    app.get('/reviews', (req, res) => {
        reviewsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    
    // Add a new Order
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    // Show all Orders
    app.get('/orders', (req, res) => {
        ordersCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // app.post('/appointmentsByDate', (req, res) => {
    //     const date = req.body;
    //     const email = req.body.email;
    //     doctorCollection.find({ email: email })
    //         .toArray((err, doctors) => {
    //             const filter = { date: date.date }
    //             if (doctors.length === 0) {
    //                 filter.email = email;
    //             }
    //             appointmentCollection.find(filter)
    //                 .toArray((err, documents) => {
    //                     console.log(email, date.date, doctors, documents)
    //                     res.send(documents);
    //                 })
    //         })
    // })

    

});


app.listen(process.env.PORT || port)