const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ihq8y.mongodb.net/${process.env.DB_PASS}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



client.connect(err => {
  const serviceCollection = client.db("Kiddy").collection("allServices");
  const orderCollection = client.db("Kiddy").collection("allOrders");
  const reviewCollection = client.db("Kiddy").collection("allReview");
  const adminCollection = client.db("Kiddy").collection("allAdmin");

  app.post('/addService', (req, res) => {
    const newService = req.body;
    serviceCollection.insertOne(newService)
      .then(result => {
        // console.log(result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  });

  // add review
  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    reviewCollection.insertOne(newReview)
      .then(result => {
        // console.log(result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  });

  // add admin
  app.post('/addAdmin', (req, res) => {
    const newAdmin = req.body;
    adminCollection.insertOne(newAdmin)
      .then(result => {
        // console.log(result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  });

  //call admin on UI
  app.get('/adminList', (req, res) => {
    adminCollection.find()
      .toArray((err, document) => {
        res.send(document)
      })
  })
  //call reviews on UI
  app.get('/reviews', (req, res) => {
    reviewCollection.find()
      .toArray((err, document) => {
        res.send(document)
      })
  })


  //call services on UI 
  app.get('/packages', (req, res) => {
    serviceCollection.find()
      .toArray((err, document) => {
        res.send(document)
      })
  })

  //book service order with payment details
  app.post('/addOrder', (req, res) => {
    orderCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0);
        //console.log(result.insertedCount)
      })
  })

  app.get('/singleService/:id', (req, res) => {
    serviceCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, service) => {
        res.send(service)
      })
  })


  app.get('/orders', (req, res) => {
    console.log(req.query.email);
    const email = req.query.email;
    adminCollection.find({email:email})
    .toArray((err, admin) =>{
      const filter = {}
      if(admin.length === 0){
          filter.email = email;
      }
      orderCollection.find(filter)
      .toArray((err, documents) => {
        res.send(documents)
        console.log(email, documents)
      })
    }) 
    
  })

//update order status
app.patch('/update', (req, res) => {
  const order = req.body;
  orderCollection.updateOne({ _id: ObjectID(req.body.id) },
    { $set: {status: req.body.status} }
  )
  .then(result => {
    res.send(result.modifiedCount > 0)
    console.log(result)
  })
})




  // Is Admin 
  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;

    adminCollection.find({ email: email })
      .toArray((err, result) => {
        res.send(result.length > 0)
      })
  })


  //call products on UI 
  app.get('/availableServices', (req, res) => {
    serviceCollection.find()
      .toArray((err, services) => {
        res.send(services)
      })
  })

  app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    serviceCollection.deleteOne({ _id: ObjectId(id) })
      .then(result => {
        res.send(result.deletedCount > 0)

      })

  })






});





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)