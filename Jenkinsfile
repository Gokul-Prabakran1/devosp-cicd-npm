pipeline {
    agent any

    parameters {
        choice(
            name: 'COMPONENT',
            choices: ['frontend', 'backend', 'middleware'],
            description: 'Select the component to build and deploy'
        )
        choice(
            name: 'ACTION',
            choices: ['Build', 'Deploy', 'Build + Deploy'],
            description: 'Select the action to perform'
        )
        string(
            name: 'IMAGE',
            defaultValue: '',
            description: 'Enter the Docker image with tag (e.g., myimage:v1.0)'
        )
    }

    
    stages {
        
        stage('Checkout Code') {
            steps {
                echo "Checking out code for branch: ${BRANCH}..."
                checkout scm
            }
        }

        stage('Validate Inputs') {
            steps {
                script {
                    // Validate component directory
                    def componentDir = "${params.COMPONENT}"
                    if (!fileExists(componentDir)) {
                        error "Directory '${componentDir}' does not exist in the repository. Aborting the job."
                    }

                    // Validate IMAGE for Deploy or Build + Deploy
                    if ((params.ACTION == 'Deploy' || params.ACTION == 'Build + Deploy') && !params.IMAGE) {
                        error "IMAGE must be provided for Deploy or Build + Deploy!"
                    }
                }
            }
        }

        stage('Build Job') {
            when {
                expression { return params.ACTION == 'Build' || params.ACTION == 'Build + Deploy' }
            }
            steps {
                script {
                    def componentPath = "${params.COMPONENT}"
                    echo "Building Docker image for ${componentPath} on branch ${BRANCH}..."

                    // Build Docker image
                    sh """
                        docker build -t ${params.IMAGE} ${componentPath}
                    """
                }
            }
        }

        stage('Deploy Job') {
            when {
                expression { return params.ACTION == 'Deploy' || params.ACTION == 'Build + Deploy' }
            }
            steps {
                script {
                    echo "Deploying Docker image ${params.IMAGE} on branch ${BRANCH}..."
                    
                    // Stop and remove any existing container for the same component
                    sh """
                        docker stop ${params.COMPONENT} || true
                        docker rm ${params.COMPONENT} || true
                    """
                    
                    // Deploy Docker container
                    sh """
                        docker run -d --name ${params.COMPONENT} -p 3000:3000 ${params.IMAGE}
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Job completed successfully for branch ${BRANCH}, component ${params.COMPONENT}, and action ${params.ACTION}."
        }
        failure {
            echo "Job failed for branch ${BRANCH}, component ${params.COMPONENT}, and action ${params.ACTION}."
        }
    }
}
