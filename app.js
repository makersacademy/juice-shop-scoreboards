document.addEventListener('DOMContentLoaded', () => {
    const scoreboard1Div = document.getElementById('scoreboard1');
    const scoreboard2Div = document.getElementById('scoreboard2');
    const scoreboard3Div = document.getElementById('scoreboard3');

    // Hardcoded URLs
    const url1 = 'https://juiceshop-team1.duckdns.org/';
    const url2 = 'https://juiceshop-team2.duckdns.org/';
    const url3 = 'https://juiceshop-team3.duckdns.org/';

    let team1Progress = 0;
    let team2Progress = 0;
    let team3Progress = 0;

    function startPolling() {

        fetchScoreboard(scoreboard1Div, url1);
        fetchScoreboard(scoreboard2Div, url2);
        fetchScoreboard(scoreboard3Div, url3);

        setInterval(() => {
            fetchScoreboard(scoreboard1Div, url1);
            fetchScoreboard(scoreboard2Div, url2);
            fetchScoreboard(scoreboard3Div, url3);
        }, 5000); // Poll every 5 seconds
    }

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
    startPolling();
});
