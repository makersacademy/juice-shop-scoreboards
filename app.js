document.addEventListener('DOMContentLoaded', () => {
    const scoreboard1Div = document.getElementById('scoreboard1');
    const scoreboard2Div = document.getElementById('scoreboard2');

    // Hardcoded URLs
    const url1 = 'http://ec2-35-179-167-133.eu-west-2.compute.amazonaws.com:8080/';
    const url2 = 'http://ec2-35-176-103-88.eu-west-2.compute.amazonaws.com:8080/';

    // Fetch scoreboards immediately on page load
    fetchScoreboard(1, url1);
    fetchScoreboard(2, url2);

    async function fetchScoreboard(instanceNumber, baseUrl) {
        const scoreboardDiv = instanceNumber === 1 ? scoreboard1Div : scoreboard2Div;

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
        
        const html = `
            <div style="margin-bottom: 20px; font-weight: bold;">
                Progress: ${solvedCount}/${totalCount} challenges solved
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