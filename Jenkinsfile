pipeline {
	agent any
    stages {
        stage('Docker Image'){
			steps {
                sh " docker build -t gokul:v1 . "
            }
        }
	stage('Docker Image'){
			steps {
                sh " docker run -d --name gokulc -p 3000:3000  gokul:v1 "
            }
        }
	    
    }
}
