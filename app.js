const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/hello', (req, res) => {
  res.send('THIS IS MY CICD PROJECT USING GIT,NPM,SONARQUBE,DOCKER,DOCKERHUB\n');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
