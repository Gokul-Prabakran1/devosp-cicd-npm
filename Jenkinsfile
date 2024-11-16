pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }
    environment {
        SONAR_PROJECT_KEY = 'complete-cicd-02'
        SONAR_SCANNER_HOME = tool 'SonarQubeScanner'
        DOCKER_IMAGE = "gokul72/cicd"
        DOCKER_TAG = "latest"
        DOCKER_HUB_CREDENTIALS = 'dockerpass'  
    }
    stages {
        stage('GitHub') {
            steps {
                git branch: 'main', url: 'https://github.com/Gokul-Prabakran1/devosp-cicd-ecr-ecs.git'
            }
        }
        stage('Unit Test') {
            steps {
                sh 'npm test'
                sh 'npm install'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: 'complete-cicd-02-token', variable: 'SONAR_TOKEN')]) {
                    withSonarQubeEnv('SonarQube') {
                        sh """
                        ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://43.205.254.146:9000/ \
                        -Dsonar.login=${SONAR_TOKEN}
                        """
                    }
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                   
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }
        stage('Remove Old Docker Container') {
            steps {
                script {
                    
                    sh '''
                        if [ $(docker ps -a -q -f name=gocontainer) ]; then
                            docker rm -f gocontainer
                        fi
                    '''
                }
            }
        }
        stage('Run Docker Container') {
            steps {
                script {
                    
                    sh 'docker run -d -p 1010:3000 --name gocontainer gokul72/cicd:latest'
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    
                    withCredentials([string(credentialsId: DOCKER_HUB_CREDENTIALS, variable: 'dockerpassword')]) {
                        sh """
                            docker login -u gokul72 -p ${dockerpassword}
                            docker push gokul72/cicd:latest
                        """
                    }
                }
            }
        }
    }
}
