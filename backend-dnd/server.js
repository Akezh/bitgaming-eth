require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const { startGameSession, sendQuery, generateImageResponse } = require("./gameSession");
const {
  LANGUAGES,
  GENRES,
  MAX_TURNS,
  gameInstructions,
  extractOptionsFromAIResponse,
} = require("./utils");
const { v4: uuidv4 } = require('uuid');

const uuid = uuidv4();

const app = express();
const PORT = process.env.PORT || 3000;

const fs = require("fs").promises;
const axios = require("axios");
const json = require("body-parser/lib/types/json");

// Store game settings for active sessions
let gameSettings = {};

// Serve static files from the "public" directory (your frontend)
app.use(express.static("public"));

app.use(cors({
  origin: 'http://localhost:5173',
}));


// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Route to serve the main HTML page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/web_index.html");
});

// POST route to start a new game session
app.post("/start", async (req, res) => {
  console.log(req.body);

  const { gptVersion, language, genre, turns, wallet_address } = req.body;

  // Initialize game settings
  gameSettings = { gptVersion, language, genre, turns, round: 1, isGameStarted: true };

  // Start the game and get the initial response
  const response = await startGameSession(wallet_address, uuid, gameSettings);
  console.log(response)
  const choices = extractOptionsFromAIResponse(response);

  res.json({ message: response, choices });
});

// POST route to continue the game with user input
app.post("/continue", async (req, res) => {
  console.log(req.body);
  const { userPrompt, wallet_address } = req.body;

  if (!gameSettings.isGameStarted) {
    return res.json({ message: "No active game session. Start a new game!" });
  }

  // Increment the round and check if the game should end
  gameSettings.round++;
  if (gameSettings.round > +gameSettings.turns) {
    gameSettings.isGameStarted = false;
    return res.json({ message: "Game finished. Start a new game?" });
  }

  // Continue the game session with the user's input
  const response = await sendQuery(wallet_address, uuid, userPrompt);
  const choices = extractOptionsFromAIResponse(response);

  // Generate an image related to the game response
  const imageResponse = await generateImageResponse(response);

  res.json({ message: response, choices, imageUrl: imageResponse.data[0].url });
  const walrus_data = await uploadToWalrus(imageResponse.data[0].url);
  updateJsonFile(walrus_data);

});

app.get("/gallery", async (req, res) => {
  const walrus_json = "saved_files/walrus_blob_id.json"
  const fileContent = await fs.readFile(walrus_json, 'utf8');
  jsonData = JSON.parse(fileContent);
  res.json(jsonData);

})

function generateUniqueFilename() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `dnd_${timestamp}.png`;
}

async function uploadToWalrus(imageUrl) {
    try {
      // Fetch the image from the URL and convert it to a Blob

      const basePublisherUrl = "https://walrus-testnet-publisher.nodes.guru";
      const numEpochs = 25;

      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
  
      if (!(response.status === 200)) {
        throw new Error("Failed to fetch the image from URL");
      }

      // Submit a PUT request to store the image blob to Walrus
      const walrusResponse = await fetch(`${basePublisherUrl}/v1/store?epochs=${numEpochs}`, {
        method: "PUT",
        body: response.data,
      });
  
      if (walrusResponse.status === 200) {
        // Parse successful responses as JSON, and return the blob ID along with the mime type
        const info = await walrusResponse.json();
        console.log("Stored blob info:", info);
        if ("alreadyCertified" in info) {
          storage_info = {
            status: "Already certified",
            blobId: info.alreadyCertified.blobId,
            endEpoch: info.alreadyCertified.endEpoch,
          };
        } else {
          storage_info = {
            status: "Newly created",
            blobId: info.newlyCreated.blobObject.blobId,
            endEpoch: info.newlyCreated.blobObject.storage.endEpoch,
          };
        }


        return { blob_id: storage_info.blobId, endEpoch: storage_info.endEpoch };
      } else {
        console.log(walrusResponse)
        throw new Error("Something went wrong when storing the blob to Walrus!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  async function updateJsonFile(newData) {
    try {
      // Read the existing data from the JSON file (if it exists)
      let jsonData = {};
      const walrus_json = "saved_files/walrus_blob_id.json"

      try {
        const fileContent = await fs.readFile(walrus_json, 'utf8');
        jsonData = JSON.parse(fileContent); // Parse the JSON content into an object
      } catch (err) {
        if (err.code === 'ENOENT') {
          // If the file does not exist, create the file with an empty object
          console.log("File not found, creating a new one...");
          jsonData = {}; // Initialize empty object
          await fs.writeFile(walrus_json, JSON.stringify(jsonData, null, 2), 'utf8'); // Create an empty JSON file
        } else {
          // Re-throw other errors
          throw err;
        }
      }
  
      // Update the data with the new entry (you can customize the update logic)
      // Assuming newData contains blob_id and media_type
      jsonData[generateUniqueFilename()] = newData;
  
      // Write the updated data back to the file
      await fs.writeFile(walrus_json, JSON.stringify(jsonData, null, 2), 'utf8');
  
      console.log('JSON file updated successfully!');
    } catch (error) {
      console.error('Error updating JSON file:', error);
    }
  }

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
