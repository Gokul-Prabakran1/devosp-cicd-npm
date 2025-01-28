pipeline {
	agent any
    stages {
        stage('Docker Image'){
			steps {
                sh " docker build -t gokul:v1 . "
            }
        }
    }
}
