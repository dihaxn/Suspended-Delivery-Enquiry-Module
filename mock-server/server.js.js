const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Function to read JSON file
const readJsonFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return null;
    }
};

// Function to get all JSON files recursively
const getAllJsonFiles = (dir, basePath = '') => {
    let results = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Recursively get files from subdirectories
            const subResults = getAllJsonFiles(fullPath, path.join(basePath, item));
            results = results.concat(subResults);
        } else if (item.endsWith('.json')) {
            // Add file to results
            const route = path.join(basePath, item.replace('.json', '')).replace(/\\/g, '/');
            results.push({
                route: route,
                filePath: fullPath
            });
        }
    }

    return results;
};

// Get all JSON files and create routes
const dataDir = path.join(__dirname, 'data');
const jsonFiles = getAllJsonFiles(dataDir);

// Create routes for all JSON files
jsonFiles.forEach(({ route, filePath }) => {
    app.get(`/${route}`, (req, res) => {
        const data = readJsonFile(filePath);
        if (data) {
            res.json(data);
        } else {
            res.status(500).json({ error: 'Error reading JSON file' });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Mock server is running on http://localhost:${PORT}`);
    console.log('Available routes:');
    jsonFiles.forEach(({ route }) => {
        console.log(`- http://localhost:${PORT}/${route}`);
    });
}); 