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
        stage('Cleanup containers') {
            steps {
                sh 'docker rm -f mysql || true'
            }
        }

        stage('Test Docker CLI') {
            steps {
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t laravel-app -f backend/Dockerfile backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t antoree-frontend-app -f frontend/Dockerfile frontend'
            }
        }

        stage('Build containers') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Start containers') {
            steps {
                sh 'docker compose up -d mysql backend frontend'
            }
        }

        stage('Install Backend dependencies') {
            steps {
                sh 'docker compose exec backend composer install'
            }
        }

        // stage('Run Backend Migrations') {
        //     steps {
        //         sh 'docker compose exec backend php artisan migrate --force'
        //     }
        // }

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

        stage('Check Backend Files') {
            steps {
                sh 'docker compose exec backend ls -l /var/www || true'
            }
        }

        stage('Deploy All') {
            steps {
                echo 'Deployment successful!'
            }
        }
    }
}
