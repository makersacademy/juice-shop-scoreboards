const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Proxy configuration
const proxyOptions = {
    target: 'http://ec2-3-8-212-48.eu-west-2.compute.amazonaws.com:3000',
    changeOrigin: true,
    pathRewrite: {
        '^/team1': '/api/Challenges'
    }
};

const proxyOptions2 = {
    target: 'http://ec2-35-177-142-42.eu-west-2.compute.amazonaws.com:3000',
    changeOrigin: true,
    pathRewrite: {
        '^/team2': '/api/Challenges'
    }
};

const proxyOptions3 = {
    target: 'http://ec2-35-176-103-88.eu-west-2.compute.amazonaws.com:8080',
    changeOrigin: true,
    pathRewrite: {
        '^/team3': '/api/Challenges'
    }
};

// Create proxy middleware
const proxy = createProxyMiddleware(proxyOptions);
const proxy2 = createProxyMiddleware(proxyOptions2);
const proxy3 = createProxyMiddleware(proxyOptions3);

// Apply proxy middleware
app.use('/team1', proxy);
app.use('/team2', proxy2);
app.use('/team3', proxy3);

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
}); 