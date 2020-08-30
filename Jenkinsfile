String cwd = 'src'

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
    stage('Build') {
      steps {
        dir(cwd) {
          sh 'npm run build'
        }
      }
    }
  }
  post {
    always {
      dir(cwd) {
        // junit '**/test-results.xml'
        sh 'rm -rf node_modules .next'
      }
    }
  }
}