String cwd = 'code'

pipeline {
  agent { docker { image 'node:13-alpine' } }

  environment {
    PORT = 4000
    MYSQL_HOST = credentials('mysql-host')
    MYSQL_NAME = credentials('mysql-name')
    MYSQL_USER = credentials('mysql-user')
    MYSQL_PWD = credentials('mysql-pwd')
    CLOUDINARY_NAME = credentials('cloudinary-name')
    CLOUDINARY_API_KEY = credentials('cloudinary-api-key')
    CLOUDINARY_API_SECRET = credentials('cloudinary-api-secret')
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