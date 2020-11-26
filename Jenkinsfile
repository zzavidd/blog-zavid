String cwd = 'code'

pipeline {
  agent { docker { image 'node:13-alpine' } }
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
        sh 'rm -rf node_modules'
      }
    }
  }
}