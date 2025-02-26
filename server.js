const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, "user_responses.json");

// Middleware
app.use(express.json());
app.use(cors());

// Save data
app.post("/save", (req, res) => {
    try {
        const newData = req.body;
        let existingData = [];

        // Read existing file
        if (fs.existsSync(FILE_PATH)) {
            const fileContent = fs.readFileSync(FILE_PATH, "utf8");
            if (fileContent.trim()) {
                existingData = JSON.parse(fileContent);
            }
        }

        // Append new data
        existingData.push(...newData);

        // Write to file
        fs.writeFileSync(FILE_PATH, JSON.stringify(existingData, null, 2));

        res.json({ message: "Data saved successfully!" });
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ error: "Failed to save data" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
