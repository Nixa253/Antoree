pipeline {
    agent {
        docker { image 'php:8.2-cli' }
    }

    environment {
        APP_ENV = 'local'
    }

    stages {
        stage('Clone source') {
            steps {
                echo 'Code pulled from GitHub'
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'apt update && apt install -y unzip zip curl git'
                sh 'curl -sS https://getcomposer.org/installer | php'
                sh 'php composer.phar install'
            }
        }

        stage('Run tests') {
            steps {
                echo 'You can run PHPUnit or any test script here'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Here you can deploy to Docker or Cloud'
            }
        }
    }
}
