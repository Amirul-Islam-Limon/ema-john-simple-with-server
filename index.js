const express = require('express')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const bodyParser =require('body-parser')
const cors = require('cors')


const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 5000
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mvdkd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_CONNECTION}`);
  const orderCollection = client.db("emaJohnDb").collection('orderedData');

  app.post('/addProduct',(req, res) => {
    const products = req.body
    productCollection.insertMany(products)
    .then(results=>{
              console.log(results.insertedCount);
              res.send(results.insertedCount)
          })
  }) 

  app.get('/products',(req, res)=>{
      productCollection.find({}).limit(81)
      .toArray((error, document)=>{
          res.send(document);
      })
  })

  app.get('/products/:key',(req, res)=>{
    productCollection.find({key:req.params.key})
    .toArray((error, document)=>{
        res.send(document[0]);
    })
})

app.post('/productsByKeys',(req, res)=>{
    const productKeys = req.body;
    productCollection.find({key: {$in:productKeys}})
    .toArray((error, documents)=>{
        res.send(documents)
    })
})

app.post('/addOrder',(req, res) => {
    const order = req.body
    orderCollection.insertOne(order)
    .then(results=>{
              res.send(results.insertedCount > 0)
              console.log(results);
          })
  })

});

app.get('/', (req, res)=>{
    res.send("Hello, from DB.")
})


app.listen(port)