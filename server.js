const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors'); // Import the cors middleware
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/your_database";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const port = process.env.PORT || 3000;

// Use cors middleware
app.use(cors());

// Connect to MongoDB and start the server
async function startServer() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db = client.db('SIH');
    const collection = db.collection('FPO_StateWise');

    // Define routes
    app.get('/api/documents', async (req, res) => {
      const documents = await collection.find().toArray();
      res.json(documents);
    });

    app.get('/api/distinct-states', async (req, res) => {
      const distinctStates = await collection.distinct('State Name');
      res.json(distinctStates);
    });

    app.post('/api/distinct-district', express.json(), async (req, res) => {
      const state = req.body.state;

      try {
        const distinctData = await collection.distinct('District', { "State Name": state });
        res.json(distinctData);
      } catch (error) {
        console.error('Error retrieving distinct data:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    app.post('/api/fpos', express.json(), async (req, res) => {
      const state = req.body.state;
      const district = req.body.district;

      try {
        const fposData = await collection.find({ "State Name": state, "District": district }).toArray();
        res.json(fposData);
      } catch (error) {
        console.error('Error retrieving FPOs data:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
    process.on('SIGINT', async () => {
      await client.close();
      console.log('MongoDB connection closed');
      process.exit();
    });
  }
}

startServer().catch(console.error);
