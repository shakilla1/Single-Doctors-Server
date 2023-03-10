const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w0pu2sb.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const serviceCollection = client.db('doctor').collection('services');
        const reviewCollection = client.db('doctor').collection('review');
        const addCollection = client.db('doctor').collection('add');

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })
        app.get('/servicess', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id, 'insert service')
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })
        // review api 
        app.get('/review', async (req, res) => {
            console.log(req.query.email);
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        });
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });
        app.get('/review/:id', async (req, res) => {

            const id = req.params.id;
            console.log(id, 'insert review get');
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        });
        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        });
        // service api 
        app.get('/add', async (req, res) => {
            console.log(req.query.email);
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = addCollection.find(query);
            const add = await cursor.toArray();
            res.send(add);

        });
        app.post('/add', async (req, res) => {
            const add = req.body;
            const result = await addCollection.insertOne(add);
            res.send(result);
        });
        app.get('/add/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id, 'insert add get');
            const query = { _id: ObjectId(id) };
            const result = await addCollection.findOne(query);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('genius car server is running')
})
app.listen(port, () => {
    console.log(`genius car server running on ${port}`);
})