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
        FRONTEND_HOOK_URL = 'https://api.render.com/deploy/srv-d133k8s9c44c738sh26g?key=HO1rWLN_gz0'
        BACKEND_HOOK_URL = 'https://api.render.com/deploy/srv-d133h7k9c44c738seeag?key=4pmzhoGt_fU'
    }

    stages {
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
                sh 'docker compose up -d backend frontend'
            }
        }

        stage('Install Backend dependencies') {
            steps {
                sh 'docker compose exec backend composer install'
            }
        }

        // Optional: run migrations if DB available
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

        stage('Trigger Render Deploy - Frontend') {
            steps {
                sh 'curl -X POST $FRONTEND_HOOK_URL'
            }
        }

        stage('Trigger Render Deploy - Backend') {
            steps {
                sh 'curl -X POST $BACKEND_HOOK_URL'
            }
        }

        stage('Finish') {
            steps {
                echo '✅ CI/CD completed and deployed to cloud!'
            }
        }
    }
}
