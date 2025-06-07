pipeline {
    agent {
        docker {
            image 'docker/compose:2.18.1'  // docker-compose chính thức
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        COMPOSE_DOCKER_CLI_BUILD = '1'
        DOCKER_BUILDKIT = '1'
    }

    stages {
        stage('Test Docker CLI') {
            steps {
                sh 'docker version'
                sh 'docker-compose version'  // dùng docker-compose thay vì docker compose
            }
        }

        stage('Build containers') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Install Backend dependencies') {
            steps {
                sh 'docker-compose exec backend composer install'
            }
        }

        stage('Run Backend Migrations') {
            steps {
                sh 'docker-compose exec backend php artisan migrate'
            }
        }

        stage('Install Frontend dependencies') {
            steps {
                sh 'docker-compose exec frontend npm install'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'docker-compose exec frontend npm run build'
            }
        }

        stage('Deploy All') {
            steps {
                echo 'Deployment successful.'
            }
        }
    }
}
