# Voice & Gesture-Controlled Game - The Christmas Cat 
This project was developed as a solo entry for the [AWS Game Builder Challenge: a hackathon for Developers](https://awsdevchallenge.devpost.com/). 
The goal was to create an engaging and interactive web game using AWS-powered features and creative gameplay mechanics.

[Let's Play the Game](https://d33rhx7ia9zwqa.cloudfront.net/)
<br></br>
[Demo Video](https://youtu.be/zddcuBzWsjE)

## How to play
Skip all obstacles and control a cat using **voice** and **hand gestures** in this interactive game.  
- **Low-pitch voice**: Flatten the cat to dodge obstacles.
- **High-pitch voice**: Make the cat jump.
- **Show your hand**: Pass through walls.
<br></br>
## Inspiration
I wanted to move beyond the usual mouse and keyboard controls to create something more engaging. My goal was to design a game that lets players use different parts of their body, like **voice pitch** and **hand gestures**, to control the character. This approach not only makes the gameplay unique but also challenges players' reaction abilities in an interactive and refreshing way.
<br></br>
## What it does
The game offers a dynamic and immersive experience by challenging players to control a cat using their voice and hand gestures. The voice detection system distinguishes between pitch ranges to trigger specific actions: **a low-pitch voice (50-150 Hz)** at a defined intensity causes the cat to flatten and avoid obstacles, while **a high-pitch voice (500-800 Hz)** makes the cat jump to overcome challenges. Additionally, when the camera detects a hand gesture, the cat gains the ability to pass through walls, adding another layer of interactivity. To enhance the competitive experience, an **AWS-powered** leaderboard tracks players' scores in real time, creating an engaging and lively environment for players to compete and improve.
<br></br>
## How we built it
We built the game using the following technologies and services:

**1. DynamoDB :** For storing player scores in a leaderboard table.

**2. API Gateway :** For managing GET and POST requests to update and retrieve scores.

**3. Lambda :** For executing backend logic to process leaderboard data.

**4. IAM :** To manage secure permissions for AWS resources.

**5. S3 :** For hosting static game assets and resources.

**6. CloudFront :** As a CDN to enhance performance and load times.

**7. CloudWatch :** For monitoring and debugging AWS services.

**8. Frontend :** Built with the React framework for an intuitive and visually engaging user interface.

**9. Hand Detection :** Implemented using MediaPipe's Hand Detect model to recognize and process real-time hand gestures for in-game interactions.  

**10. Pitch detection :** The audio detection analyzes microphone frequencies and triggers actions if intensity in specific ranges (50-150 Hz or 500-800 Hz) exceeds a threshold.

**11. Pixi.js :** For rendering 2D graphics and creating visually engaging gameplay elements.

**12. GSAP :** For handling smooth animations and transitions, enhancing the overall game experience.
<br></br>
## Accomplishments that we're proud of
**1.** Successfully **integrating voice and hand-detection technologies** into the game to create a unique and interactive experience.

**2.** Leveraging AWS services effectively to build a scalable and reliable backend.
<br></br>
## What we learned
**1.** Gained hands-on experience with AWS services, including DynamoDB, Lambda, API Gateway, IAM, S3, CloudWatch, and CloudFront.
