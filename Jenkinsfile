pipeline {
    agent {
        docker {
            image 'docker:24.0.2-cli'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        COMPOSE_DOCKER_CLI_BUILD = '1'
        DOCKER_BUILDKIT = '1'
    }

    stages {
        stage('Checkout source') {
            steps {
                checkout scm
            }
        }

        stage('Build containers') {
            steps {
                sh 'docker version' // test docker command
                sh 'docker compose version'
                sh 'docker compose build'
            }
        }

        stage('Install Backend dependencies') {
            steps {
                sh 'docker compose exec backend composer install'
            }
        }

        stage('Run Backend Migrations') {
            steps {
                sh 'docker compose exec backend php artisan migrate'
            }
        }

        stage('Install Frontend dependencies') {
            steps {
                sh 'docker compose exec frontend npm install'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'docker compose exec frontend npm run build'
            }
        }

        stage('Deploy All') {
            steps {
                echo 'Deployment successful.'
            }
        }
    }
}
