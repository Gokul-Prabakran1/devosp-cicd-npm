pipeline {
    agent any

    parameters {
        choice(name: 'DIRECTORY', choices: ['frontend', 'backend', 'middleware', 'all three'], description: 'Select the directory to perform actions on')
        string(name: 'IMAGE_TAG', defaultValue: '', description: 'Provide the image tag (required)')
        choice(name: 'ACTION', choices: ['build', 'deploy', 'build + deploy'], description: 'Select the action to perform')
    }

    stages {
        stage('Validate Input') {
            steps {
                script {
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
                    def services = []
                    
                    if (params.DIRECTORY == 'all three') {
                        services = ['frontend', 'backend', 'middleware']
                    } else {
                        services = [params.DIRECTORY]
                    }
                    
                    for (service in services) {
                        echo "Building ${service} with image tag: ${params.IMAGE_TAG}"
                        sh "docker build -t ${params.IMAGE_TAG}-${service} ./${service}"
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
                    def services = []
                    
                    if (params.DIRECTORY == 'all three') {
                        services = ['frontend', 'backend', 'middleware']
                    } else {
                        services = [params.DIRECTORY]
                    }
                    
                    def ports = ['frontend': 3001, 'backend': 3003, 'middleware': 3002]

                    for (service in services) {
                        def containerName = service
                        
                        // Check if the container exists and remove it if necessary
                        def containerExists = sh(script: "docker ps -aq -f name=${containerName}", returnStdout: true).trim()
                        if (containerExists) {
                            echo "Stopping and removing existing container: ${containerName}"
                            sh "docker stop ${containerName} && docker rm ${containerName}"
                        }

                        echo "Deploying ${service} with image tag: ${params.IMAGE_TAG}-${service}"
                        sh "docker run -d --name ${containerName} -p ${ports[service]}:3000 ${params.IMAGE_TAG}-${service}"
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo "Pipeline execution completed."
        }
        success {
            echo "Pipeline executed successfully."
        }
        failure {
            echo "Pipeline execution failed."
        }
    }
}
