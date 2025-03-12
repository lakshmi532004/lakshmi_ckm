const http = require('http');
const fs = require('fs');
const path = require('path');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

// ChartJS Node Canvas instance
const width = 800; // Width of the canvas
const height = 600; // Height of the canvas
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

// Data storage
let chartData = {
    heartRate: {},
    calories: {},
    sleepPattern: {},
    exercise: {}
};

// Helper function to save chart data
const saveChartData = () => {
    fs.writeFileSync('chartData.json', JSON.stringify(chartData, null, 2));
};

// Helper function to serve static files
const serveStaticFile = (res, filePath, contentType) => {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
};

// Function to generate and save chart images
const generateCharts = async () => {
    // Generate Heart Rate Chart
    const heartRateChart = await chartJSNodeCanvas.renderToBuffer({
        type: 'line',
        data: {
            labels: chartData.heartRate.timeLabels,
            datasets: [{
                label: 'Heart Rate (bpm)',
                data: chartData.heartRate.heartRates,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true
            }]
        }
    });
    fs.writeFileSync(path.join(__dirname, 'heartRateChart.png'), heartRateChart);

    // Generate Calories Burned Chart
    const caloriesChart = await chartJSNodeCanvas.renderToBuffer({
        type: 'bar',
        data: {
            labels: chartData.calories.activityLabels,
            datasets: [{
                label: 'Calories Burned',
                data: chartData.calories.caloriesBurned,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        }
    });
    fs.writeFileSync(path.join(__dirname, 'caloriesChart.png'), caloriesChart);

    // Generate Sleep Pattern Chart
    const sleepPatternChart = await chartJSNodeCanvas.renderToBuffer({
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Sleep Quality (%) vs. Hours Slept',
                data: chartData.sleepPattern.sleepHours.map((hours, index) => ({
                    x: hours,
                    y: chartData.sleepPattern.sleepQuality[index]
                })),
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderColor: 'rgba(0,130,0,1)',
                pointRadius: 5
            }]
        }
    });
    fs.writeFileSync(path.join(__dirname, 'sleepPatternChart.png'), sleepPatternChart);

    // Generate Exercise Chart
    const exerciseChart = await chartJSNodeCanvas.renderToBuffer({
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Exercise Intensity (%) vs. Duration (mins)',
                data: chartData.exercise.exerciseDuration.map((duration, index) => ({
                    x: duration,
                    y: chartData.exercise.exerciseIntensity[index]
                })),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                pointRadius: 5
            }]
        }
    });
    fs.writeFileSync(path.join(__dirname, 'exerciseChart.png'), exerciseChart);
};

// Create HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        if (req.url === '/') {
            // Serve a placeholder HTML or main page
            serveStaticFile(res, path.join(__dirname, 'index.html'), 'text/html');
        } else if (req.url.startsWith('/charts/')) {
            // Serve chart images
            const chartName = req.url.split('/charts/')[1];
            const filePath = path.join(__dirname, chartName);
            if (fs.existsSync(filePath)) {
                serveStaticFile(res, filePath, 'image/png');
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Chart Not Found');
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    } else if (req.method === 'POST' && req.url === '/saveData') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                chartData = {
                    heartRate: { timeLabels: data.timeLabels, heartRates: data.heartRates },
                    calories: { activityLabels: data.activityLabels, caloriesBurned: data.caloriesBurned },
                    sleepPattern: { sleepHours: data.sleepHours, sleepQuality: data.sleepQuality },
                    exercise: { exerciseDuration: data.exerciseDuration, exerciseIntensity: data.exerciseIntensity }
                };

                saveChartData(); // Save to file
                await generateCharts(); // Generate chart images

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Data saved and charts generated successfully!' }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error processing data', error: err.message }));
            }
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
});

// Start the server
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});

