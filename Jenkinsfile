pipeline {
    agent any

    parameters {
        choice(name: 'DIRECTORY', choices: ['frontend', 'backend', 'middleware'], description: 'Select the directory to perform actions on')
        string(name: 'IMAGE_TAG', defaultValue: '', description: 'Provide the image tag (required)')
        choice(name: 'ACTION', choices: ['build', 'deploy', 'build + deploy'], description: 'Select the action to perform')
    }

    stages {
        stage('Validate Input') {
            steps {
                script {
                    // Fail if no IMAGE_TAG is provided
                    if (!params.IMAGE_TAG?.trim()) {
                        error "IMAGE_TAG is required. Please provide a valid image tag."
                    }
                }
            }
        }
        
        stage('Build') {
            when {
                expression { return params.ACTION == 'build' || params.ACTION == 'build + deploy' }
            }
            steps {
                script {
                    if (params.DIRECTORY == 'frontend') {
                        echo "Building Frontend with image tag: ${params.IMAGE_TAG}"
                        sh "docker build -t ${params.IMAGE_TAG} ./frontend"
                    } else if (params.DIRECTORY == 'backend') {
                        echo "Building Backend with image tag: ${params.IMAGE_TAG}"
                        sh "docker build -t ${params.IMAGE_TAG} ./backend"
                    } else if (params.DIRECTORY == 'middleware') {
                        echo "Building Middleware with image tag: ${params.IMAGE_TAG}"
                        sh "docker build -t ${params.IMAGE_TAG} ./middleware"
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                expression { return params.ACTION == 'deploy' || params.ACTION == 'build + deploy' }
            }
            steps {
                script {
                    if (params.DIRECTORY == 'frontend') {
                        echo "Deploying Frontend with image tag: ${params.IMAGE_TAG}"
                        // Add your frontend deployment logic here
                    } else if (params.DIRECTORY == 'backend') {
                        echo "Deploying Backend with image tag: ${params.IMAGE_TAG}"
                        // Add your backend deployment logic here
                    } else if (params.DIRECTORY == 'middleware') {
                        echo "Deploying Middleware with image tag: ${params.IMAGE_TAG}"
                        // Add your middleware deployment logic here
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo "Pipeline completed"
        }
        success {
            echo "Pipeline completed successfully"
        }
        failure {
            echo "Pipeline failed"
        }
    }
}
