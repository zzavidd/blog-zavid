String cwd = 'code'

pipeline {
  agent { docker { image 'node:13-alpine' } }

  environment {
    PORT = 4000
    MYSQL_HOST = credentials('MYSQL_HOST')
    MYSQL_NAME = credentials('MYSQL_NAME')
    MYSQL_USER = credentials('MYSQL_USER')
    MYSQL_PWD = credentials('MYSQL_PWD')
    CLOUDINARY_NAME = credentials('CLOUDINARY_NAME')
    CLOUDINARY_API_KEY = credentials('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = credentials('CLOUDINARY_API_SECRET')
    SESSION_NAME = credentials('SESSION_NAME')
    SESSION_SECRET = credentials('SESSION_SECRET')
  }

  options {
    disableConcurrentBuilds()
    timeout(time: 7.5, unit: 'MINUTES')
  }

  stages {
    stage('Install dependencies') {
      steps {
        dir(cwd) {
          sh 'npm ci'
        }
      }
    }
    stage('Check') {
      steps {
        dir(cwd) {
          sh 'npm run check'
        }
      }
    }
    stage('Build') {
      steps {
        dir(cwd) {
          sh 'npm run build'
        }
      }
    }
    stage('Test') {
      steps {
        dir(cwd) {
          sh 'npm run test:ci'
        }
      }
    }
  }
  post {
    always {
      dir(cwd) {
        junit '**/test-results.xml'
        sh 'rm -rf node_modules test-results.xml'
      }
    }
  }
}