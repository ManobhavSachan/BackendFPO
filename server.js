const { MongoClient } = require('mongodb');
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
  // ... (unchanged code)

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
    // ... (unchanged code)
  });

  app.post('/api/fpos', express.json(), async (req, res) => {
    // ... (unchanged code)
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer().catch(console.error);
