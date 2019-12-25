pipeline {
    agent { dockerfile true }
    stages {
        stage('Clean') { 
            steps {
              dir('src'){
                sh 'rm -rf node_modules .next out'
              }
            }
        }
    }
}