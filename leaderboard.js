getLeaderboard = () => {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    const leaderboardData = JSON.parse(localStorage.getItem('archeryLeaderboard')) || [];
}

getPlayerData = () => {
    const playerData = leaderboardData.find(player => player.name === currentPlayerName); 
    return playerData ? playerData.score : 0;
}
        