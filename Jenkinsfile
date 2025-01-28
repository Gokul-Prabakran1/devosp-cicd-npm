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
                    // Check and remove existing container for frontend
                    if (params.DIRECTORY == 'frontend') {
                        def containerExists = sh(script: "docker ps -aq -f name=frontend-container", returnStdout: true).trim()
                        if (containerExists) {
                            echo "Container with name 'frontend-container' already exists. Stopping and removing it."
                            sh "docker stop frontend-container"
                            sh "docker rm frontend-container"
                        }
                        echo "Deploying Frontend with image tag: ${params.IMAGE_TAG}"
                        sh "docker run -d --name frontend-container -p 3002:3000 ${params.IMAGE_TAG}"
                    }

                    // Check and remove existing container for backend
                    if (params.DIRECTORY == 'backend') {
                        def containerExists = sh(script: "docker ps -aq -f name=backend-container", returnStdout: true).trim()
                        if (containerExists) {
                            echo "Container with name 'backend-container' already exists. Stopping and removing it."
                            sh "docker stop backend-container"
                            sh "docker rm backend-container"
                        }
                        echo "Deploying Backend with image tag: ${params.IMAGE_TAG}"
                        sh "docker run -d --name backend-container -p 3003:3000 ${params.IMAGE_TAG}"
                    }

                    // Check and remove existing container for middleware
                    if (params.DIRECTORY == 'middleware') {
                        def containerExists = sh(script: "docker ps -aq -f name=middleware-container", returnStdout: true).trim()
                        if (containerExists) {
                            echo "Container with name 'middleware-container' already exists. Stopping and removing it."
                            sh "docker stop middleware-container"
                            sh "docker rm middleware-container"
                        }
                        echo "Deploying Middleware with image tag: ${params.IMAGE_TAG}"
                        sh "docker run -d --name middleware-container -p 3002:3000 ${params.IMAGE_TAG}"
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
