pipeline {
    agent any
    stages {
        stage('Build Docker Image') {
            steps {
                sh "docker build -t gokul:v1 ."
            }
        }
        stage('Run Docker Container') {
            steps {
                sh "docker run -d --name gokuld -p 3001:3000 gokul:v1"
            }
        }
    }
}
