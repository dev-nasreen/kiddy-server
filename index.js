const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port =process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient;
const  ObjectId  = require('mongodb').ObjectID;
const { connect, ObjectID } = require('mongodb')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ihq8y.mongodb.net/${process.env.DB_PASS}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));



client.connect(err => {
  const serviceCollection = client.db("Kiddy").collection("allServices");
  const orderCollection = client.db("Kiddy").collection("allOrders");
  
  app.post('/addService', (req, res) =>{
      const newService = req.body;
      serviceCollection.insertOne(newService)
      .then(result =>{
         // console.log(result.insertedCount)
          res.send(result.insertedCount > 0)
      })
  });

 //call services on UI 
 app.get('/packages', (req, res) =>{
  serviceCollection.find()
  .toArray((err, document) =>{
    res.send(document)
  })
})

//book service order with payment details
app.post('/addOrder', (req, res) =>{
  orderCollection.insertOne(req.body)
  .then(result =>{
    res.send(result.insertedCount > 0);
    console.log(result.insertedCount)
  })
})

app.get('/singleService/:id', (req, res) =>{
  serviceCollection.find({_id: ObjectID(req.params.id)})
  .toArray((err, service) =>{
    res.send(service)
  })
})

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)