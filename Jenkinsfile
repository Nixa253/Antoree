pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout source') {
            steps {
                checkout scm
            }
        }

        stage('Build containers') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Install Backend dependencies') {
            steps {
                sh 'docker compose run --rm backend composer install'
            }
        }

        stage('Run Backend Migrations') {
            steps {
                sh 'docker compose run --rm backend php artisan migrate'
            }
        }

        stage('Install Frontend dependencies') {
            steps {
                sh 'docker compose run --rm frontend npm install'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'docker compose run --rm frontend npm run build'
            }
        }

        stage('Deploy All') {
            steps {
                sh 'docker compose up -d'
            }
        }
    }
}
