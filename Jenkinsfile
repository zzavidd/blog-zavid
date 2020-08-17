String cwd = 'src'

pipeline {
  agent { dockerfile true }
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
}