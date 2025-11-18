document.addEventListener('DOMContentLoaded', () => {
    const scoreboard1Div = document.getElementById('scoreboard1');
    const scoreboard2Div = document.getElementById('scoreboard2');
    const scoreboard3Div = document.getElementById('scoreboard3');
    
    const connectionStatus1 = document.getElementById('connection-status-1');
    const connectionStatus2 = document.getElementById('connection-status-2');
    const connectionStatus3 = document.getElementById('connection-status-3');

    // Hardcoded URLs
    const url1 = 'http://ec2-3-8-212-48.eu-west-2.compute.amazonaws.com:3000/';
    const url2 = 'http://ec2-35-177-142-42.eu-west-2.compute.amazonaws.com:3000/';
    const url3 = 'http://ec2-35-179-112-188.eu-west-2.compute.amazonaws.com:3000/';

    let ws1 = null;
    let ws2 = null;
    let ws3 = null;
    let team1Progress = 0;
    let team2Progress = 0;
    let team3Progress = 0;

    function connectWebSocket1() {
        const wsUrl = url1.replace('http', 'ws') + 'socket.io/?EIO=3&transport=websocket';
        try {
            if (ws1) {
                ws1.close();
            }
            ws1 = new WebSocket(wsUrl);
            setupWebSocket1Handlers();
        } catch (error) {
            console.error('Failed to create WebSocket connection for Team 1:', error);
            updateConnectionStatus(connectionStatus1, 'error');
            // Retry connection after delay
            setTimeout(connectWebSocket1, 5000);
        }
    }

    function connectWebSocket2() {
        const wsUrl = url2.replace('http', 'ws') + 'socket.io/?EIO=3&transport=websocket';
        try {
            if (ws2) {
                ws2.close();
            }
            ws2 = new WebSocket(wsUrl);
            setupWebSocket2Handlers();
        } catch (error) {
            console.error('Failed to create WebSocket connection for Team 2:', error);
            updateConnectionStatus(connectionStatus2, 'error');
            // Retry connection after delay
            setTimeout(connectWebSocket2, 5000);
        }
    }

    function connectWebSocket3() {
        const wsUrl = url3.replace('http', 'ws') + 'socket.io/?EIO=3&transport=websocket';
        try {
            if (ws2) {
                ws2.close();
            }
            ws3 = new WebSocket(wsUrl);
            setupWebSocket3Handlers();
        } catch (error) {
            console.error('Failed to create WebSocket connection for Team 3:', error);
            updateConnectionStatus(connectionStatus3, 'error');
            // Retry connection after delay
            setTimeout(connectWebSocket3, 5000);
        }
    }

    function setupWebSocket1Handlers() {
        if (!ws1) return;

        ws1.onopen = () => {
            console.log('WebSocket connection established for Team 1');
            updateConnectionStatus(connectionStatus1, 'connected');
            // Only send message if connection is open
            if (ws1.readyState === WebSocket.OPEN) {
                ws1.send('2probe');
            }
        };

        ws1.onmessage = (event) => {
            try {
                console.log('Received message from Team 1:', event.data);
                // Socket.IO sends a '0' message on connect, we can ignore it
                if (event.data === '0') return;
                
                const data = JSON.parse(event.data);
                if (data.type === 'challengeSolved') {
                    fetchScoreboard(1);
                }
            } catch (error) {
                console.error('Error processing WebSocket message for Team 1:', error);
            }
        };

        ws1.onerror = (error) => {
            console.error('WebSocket error for Team 1:', error);
            updateConnectionStatus(connectionStatus1, 'error');
        };

        ws1.onclose = () => {
            console.log('WebSocket connection closed for Team 1');
            updateConnectionStatus(connectionStatus1, 'disconnected');
            setTimeout(connectWebSocket1, 5000);
        };
    }

    function setupWebSocket2Handlers() {
        if (!ws2) return;

        ws2.onopen = () => {
            console.log('WebSocket connection established for Team 2');
            updateConnectionStatus(connectionStatus2, 'connected');
            // Only send message if connection is open
            if (ws2.readyState === WebSocket.OPEN) {
                ws2.send('2probe');
            }
        };

        ws2.onmessage = (event) => {
            try {
                console.log('Received message from Team 2:', event.data);
                // Socket.IO sends a '0' message on connect, we can ignore it
                if (event.data === '0') return;
                
                const data = JSON.parse(event.data);
                if (data.type === 'challengeSolved') {
                    fetchScoreboard(2);
                }
            } catch (error) {
                console.error('Error processing WebSocket message for Team 2:', error);
            }
        };

        ws2.onerror = (error) => {
            console.error('WebSocket error for Team 2:', error);
            updateConnectionStatus(connectionStatus2, 'error');
        };

        ws2.onclose = () => {
            console.log('WebSocket connection closed for Team 2');
            updateConnectionStatus(connectionStatus2, 'disconnected');
            setTimeout(connectWebSocket2, 5000);
        };
    }

    function setupWebSocket3Handlers() {
        if (!ws3) return;

        ws3.onopen = () => {
            console.log('WebSocket connection established for Team 3');
            updateConnectionStatus(connectionStatus3, 'connected');
            // Only send message if connection is open
            if (ws3.readyState === WebSocket.OPEN) {
                ws3.send('3probe');
            }
        };

        ws3.onmessage = (event) => {
            try {
                console.log('Received message from Team 3:', event.data);
                // Socket.IO sends a '0' message on connect, we can ignore it
                if (event.data === '0') return;
                
                const data = JSON.parse(event.data);
                if (data.type === 'challengeSolved') {
                    fetchScoreboard(3);
                }
            } catch (error) {
                console.error('Error processing WebSocket message for Team 3:', error);
            }
        };

        ws3.onerror = (error) => {
            console.error('WebSocket error for Team 3:', error);
            updateConnectionStatus(connectionStatus3, 'error');
        };

        ws3.onclose = () => {
            console.log('WebSocket connection closed for Team 3');
            updateConnectionStatus(connectionStatus3, 'disconnected');
            setTimeout(connectWebSocket3, 5000);
        };
    }

    function updateConnectionStatus(connectionStatus, status) {
        const statusElement = connectionStatus;
        statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        statusElement.classList.remove('connected', 'disconnected', 'error');
        statusElement.classList.add(status);
    }

    // Initial fetch and WebSocket connections
    fetchScoreboard(scoreboard1Div, url1);
    fetchScoreboard(scoreboard2Div, url2);
    fetchScoreboard(scoreboard3Div, url3);
    connectWebSocket1();
    connectWebSocket2();
    connectWebSocket3();

    async function fetchScoreboard(scoreboardDiv, baseUrl) {
        // Show loading state
        scoreboardDiv.innerHTML = '<div class="loading">Loading...</div>';

        try {
            const response = await fetch(`${baseUrl}api/Challenges/`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            if (data.status === 'success' && Array.isArray(data.data)) {
                displayScoreboard(data.data, scoreboardDiv);
            } else {
                throw new Error('Invalid data format received');
            }
        } catch (error) {
            scoreboardDiv.innerHTML = `<div class="error">Error loading scoreboard: ${error.message}</div>`;
        }
    }

    function displayScoreboard(challenges, container) {
        const solvedCount = challenges.filter(c => c.solved).length;
        const totalCount = challenges.length;
        const percentage = Math.round((solvedCount / totalCount) * 100);
        
        // Update progress for the appropriate team
        if (container === scoreboard1Div) {
            team1Progress = percentage;
        } else if (container === scoreboard2Div) {
            team2Progress = percentage;
        } else {
            team3Progress = percentage;
        }

        // Determine if this team is winning
        let isWinning = false;
        if (container === scoreboard1Div) {
            isWinning = team1Progress >= team2Progress && team1Progress >= team3Progress;
        } else if (container === scoreboard2Div) {
            isWinning = team2Progress >= team1Progress && team2Progress >= team3Progress;
        } else {
            isWinning = team3Progress >= team1Progress && team3Progress >= team2Progress;
        }
        
        const html = `
            <div style="margin-bottom: 20px; font-weight: bold;">
                Progress: ${percentage}% complete ${isWinning ? '👑' : ''}
            </div>
            <ul class="challenge-list">
                ${challenges.map(challenge => `
                    <li class="challenge-item">
                        <span class="challenge-name">${challenge.name}</span>
                        <span class="challenge-status ${challenge.solved ? 'solved' : 'unsolved'}">
                            ${challenge.solved ? 'Solved' : 'Unsolved'}
                        </span>
                    </li>
                `).join('')}
            </ul>
        `;
        
        container.innerHTML = html;
    }
}); 