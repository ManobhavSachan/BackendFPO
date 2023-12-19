const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/your_database"; // Default URI if not provided in the environment

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB and start the server
async function startServer() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db = client.db('SIH');
    const collection = db.collection('FPO_StateWise');

    // Define routes

    // Route to get all documents in the collection
    app.get('/api/documents', async (req, res) => {
      const documents = await collection.find().toArray();
      res.json(documents);
    });

    // Route to get distinct states
    app.get('/api/distinct-states', async (req, res) => {
      const distinctStates = await collection.distinct('State Name');
      res.json(distinctStates);
    });

    app.post('/api/distinct-district', express.json(), async (req, res) => {
        const state = req.body.state;
    
        try {
          // Find distinct data for the given state
          const distinctData =  await collection.distinct('District', { "State Name": state });
    
          // Send the distinct data as a JSON response
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
          // Find all data for FPOs in the given state and district
          const fposData = await collection.find({ "State Name": state, "District": district }).toArray();
    
          // Send the FPOs data as a JSON response
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
    // Close the MongoDB connection when the server stops
    process.on('SIGINT', async () => {
      await client.close();
      console.log('MongoDB connection closed');
      process.exit();
    });
  }
}

startServer().catch(console.error);
