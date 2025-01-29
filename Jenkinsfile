pipeline {
    agent any

    parameters {
        choice(name: 'DIRECTORY', choices: ['frontend', 'backend', 'middleware', 'all three'], description: 'Select the directory to perform actions on')

        string(name: 'FRONTEND_IMAGE', defaultValue: '', description: 'Provide the frontend image tag (Required if selecting all three)')
        string(name: 'BACKEND_IMAGE', defaultValue: '', description: 'Provide the backend image tag (Required if selecting all three)')
        string(name: 'MIDDLEWARE_IMAGE', defaultValue: '', description: 'Provide the middleware image tag (Required if selecting all three)')
        string(name: 'IMAGE_TAG', defaultValue: '', description: 'Provide the image tag (Required if selecting a single service)')

        choice(name: 'ACTION', choices: ['build', 'deploy', 'build + deploy'], description: 'Select the action to perform')
    }

    stages {
        stage('Validate Input') {
            steps {
                script {
                    if (params.DIRECTORY == 'all three') {
                        if (!params.FRONTEND_IMAGE?.trim() || !params.BACKEND_IMAGE?.trim() || !params.MIDDLEWARE_IMAGE?.trim()) {
                            error "All three image tags (FRONTEND_IMAGE, BACKEND_IMAGE, MIDDLEWARE_IMAGE) must be provided."
                        }
                    } else {
                        if (!params.IMAGE_TAG?.trim()) {
                            error "IMAGE_TAG is required for individual service deployment."
                        }
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
                        services = [
                            ['name': 'frontend', 'image': params.FRONTEND_IMAGE],
                            ['name': 'backend', 'image': params.BACKEND_IMAGE],
                            ['name': 'middleware', 'image': params.MIDDLEWARE_IMAGE]
                        ]
                    } else {
                        services = [['name': params.DIRECTORY, 'image': params.IMAGE_TAG]]
                    }

                    for (service in services) {
                        echo "Building ${service.name} with image tag: ${service.image}"
                        sh "docker build -t ${service.image} ./${service.name}"
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
                    def ports = ['frontend': 3001, 'backend': 3003, 'middleware': 3002]

                    if (params.DIRECTORY == 'all three') {
                        services = [
                            ['name': 'frontend', 'image': params.FRONTEND_IMAGE],
                            ['name': 'backend', 'image': params.BACKEND_IMAGE],
                            ['name': 'middleware', 'image': params.MIDDLEWARE_IMAGE]
                        ]
                    } else {
                        services = [['name': params.DIRECTORY, 'image': params.IMAGE_TAG]]
                    }

                    for (service in services) {
                        def containerName = service.name

                        def containerExists = sh(script: "docker ps -aq -f name=${containerName}", returnStdout: true).trim()
                        if (containerExists) {
                            echo "Stopping and removing existing container: ${containerName}"
                            sh "docker stop ${containerName} && docker rm ${containerName}"
                        }

                        echo "Deploying ${service.name} with image tag: ${service.image}"
                        sh "docker run -d --name ${containerName} -p ${ports[service.name]}:3000 ${service.image}"
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
