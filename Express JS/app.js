const express = require('express');
const fs = require('fs');
const app = express();

// Helper functions
function calculateMean(nums) {
    return nums.reduce((sum, num) => sum + num, 0) / nums.length;
}

function calculateMedian(nums) {
    nums.sort((a, b) => a - b);
    const mid = Math.floor(nums.length / 2);
    return nums.length % 2 === 0
        ? (nums[mid - 1] + nums[mid]) / 2
        : nums[mid];
}

function calculateMode(nums) {
    const freq = {};
    let maxFreq = 0;
    let mode = null;

    for (let num of nums) {
        freq[num] = (freq[num] || 0) + 1;
        if (freq[num] > maxFreq) {
            maxFreq = freq[num];
            mode = num;
        }
    }
    return mode;
}

function parseNumbers(numsStr) {
    const nums = numsStr.split(',').map(n => {
        const num = parseFloat(n);
        if (isNaN(num)) throw new Error(`Invalid number: ${n}`);
        return num;
    });
    return nums;
}

// Routes
app.get('/mean', (req, res) => {
    const { nums } = req.query;
    if (!nums) return res.status(400).json({ error: 'nums are required' });

    try {
        const parsedNums = parseNumbers(nums);
        const mean = calculateMean(parsedNums);
        return res.json({ operation: 'mean', value: mean });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

app.get('/median', (req, res) => {
    const { nums } = req.query;
    if (!nums) return res.status(400).json({ error: 'nums are required' });

    try {
        const parsedNums = parseNumbers(nums);
        const median = calculateMedian(parsedNums);
        return res.json({ operation: 'median', value: median });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

app.get('/mode', (req, res) => {
    const { nums } = req.query;
    if (!nums) return res.status(400).json({ error: 'nums are required' });

    try {
        const parsedNums = parseNumbers(nums);
        const mode = calculateMode(parsedNums);
        return res.json({ operation: 'mode', value: mode });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

// Further Study: /all route
app.get('/all', (req, res) => {
    const { nums, save } = req.query;
    if (!nums) return res.status(400).json({ error: 'nums are required' });

    try {
        const parsedNums = parseNumbers(nums);
        const mean = calculateMean(parsedNums);
        const median = calculateMedian(parsedNums);
        const mode = calculateMode(parsedNums);
        const result = { operation: 'all', mean, median, mode };

        if (save === 'true') {
            const timestamp = new Date().toISOString();
            const fileData = { ...result, timestamp };
            fs.writeFileSync('results.json', JSON.stringify(fileData, null, 2));
        }

        return res.json(result);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

// Error Handling
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
