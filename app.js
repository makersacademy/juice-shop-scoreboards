document.addEventListener('DOMContentLoaded', () => {
    const url1Input = document.getElementById('url1');
    const url2Input = document.getElementById('url2');
    const scoreboard1Div = document.getElementById('scoreboard1');
    const scoreboard2Div = document.getElementById('scoreboard2');

    // Add event listeners to URL inputs
    url1Input.addEventListener('change', () => fetchScoreboard(1));
    url2Input.addEventListener('change', () => fetchScoreboard(2));

    async function fetchScoreboard(instanceNumber) {
        const urlInput = instanceNumber === 1 ? url1Input : url2Input;
        const scoreboardDiv = instanceNumber === 1 ? scoreboard1Div : scoreboard2Div;
        const baseUrl = urlInput.value.trim();

        if (!baseUrl) {
            scoreboardDiv.innerHTML = '<div class="error">Please enter a URL</div>';
            return;
        }

        // Show loading state
        scoreboardDiv.innerHTML = '<div class="loading">Loading...</div>';

        try {
            const response = await fetch(`${baseUrl}/api/Challenges/`);
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