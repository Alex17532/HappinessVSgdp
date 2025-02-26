const fs = require('fs');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const filePath = path.join("C:/Users/Alexander/Desktop", "user_responses.json");

// Ensure the JSON file exists
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
}

// Save data to JSON file
app.post('/save', (req, res) => {
    const newData = req.body;

    // Read existing data
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read file" });
        }

        let jsonData = [];
        try {
            jsonData = JSON.parse(data);
        } catch (parseError) {
            return res.status(500).json({ error: "JSON parsing error" });
        }

        jsonData.push(...newData);

        // Write back to file
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', err => {
            if (err) {
                return res.status(500).json({ error: "Failed to save data" });
            }
            res.json({ message: "Data saved successfully" });
        });
    });
});

// Load data from JSON file
app.get('/load', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to load data" });
        }
        try {
            const jsonData = JSON.parse(data || "[]");
            res.json(jsonData);
        } catch (parseError) {
            res.status(500).json({ error: "JSON parsing error" });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
