const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0dt9tdk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db("clientDB").collection("user");
    const serviceCollection = client.db("clientDB").collection("services");

    // get items
    app.get("/user", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // add items
    app.post("/user", async (req, res) => {
      const cursor = req.body;
      const email = cursor.email;
      console.log(email);
      let user = await coffeeCollection.findOne({ email: email });
      console.log(user);
      if (user) {
        res.send("Already exist");
        console.log("Already exist");
      } else {
        const result = await coffeeCollection.insertOne(cursor);
        res.send(result);
      }
    });

    app.get("/user/:email", async(req,res) =>{
      const email = req.params.email;
      const query = { email: email };
      console.log(query);
      const result = await coffeeCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    })

    // get items by id
    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    // service related api start
    app.get("/services", async(req,res) =>{
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/services/:id", async(req,res) =>{
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    })

    app.post("/services", async(req,res) =>{
      const cursor = req.body;
      const result = await serviceCollection.insertOne(cursor);
      res.send(result);
    })
    // service related api end

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffee server is running");
});

app.listen(port, () => {
  console.log(`coffee store is runnig from port:${port}`);
});
