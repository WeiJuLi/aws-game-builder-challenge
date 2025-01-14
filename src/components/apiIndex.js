export const submitScore = async (playerName, collisionCount) => {
    try {
        const response = await fetch("https://78v7hm3gld.execute-api.us-east-1.amazonaws.com/dev/leaderboard", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "playerName": playerName,
                "collisionTimes": collisionCount,
            }),
        });

    } catch (error) {
        console.error("Failed to submit score.");
    }
};