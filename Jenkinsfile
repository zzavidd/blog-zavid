String CWD = 'code'
boolean isMaster = env.JOB_NAME.indexOf('PR-') < 0
String TELEGRAM_MESSAGE = isMaster
  ? "Master build <b>#$env.BUILD_NUMBER</b>"
  : "PR build <b>#$env.BUILD_NUMBER</b> on <b>$env.CHANGE_BRANCH</b> branch"

def sendTelegramMessage(message){
  def body = """
  {
    "chat_id": $CHAT_ID,
    "parse_mode": "HTML",
    "text": "$message"
  }
  """

  httpRequest url: "https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage",
    httpMode: 'POST',
    requestBody: body,
    acceptType: 'APPLICATION_JSON',
    contentType: 'APPLICATION_JSON'
}

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
    GOOGLE_ACCOUNT_ID = credentials('GOOGLE_ACCOUNT_ID')
    GOOGLE_CLIENT_ID = credentials('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = credentials('GOOGLE_CLIENT_SECRET')

    CHAT_ID = credentials('TELEGRAM_CHAT_ID')
    TELEGRAM_TOKEN = credentials('TELEGRAM_TOKEN')
  }

  options {
    disableConcurrentBuilds()
    timeout(time: 7.5, unit: 'MINUTES')
  }

  stages {
    stage('Install dependencies') {
      steps {
        dir(CWD) {
          sh 'npm ci'
        }
      }
    }
    stage('Check') {
      steps {
        dir(CWD) {
          sh 'npm run check'
        }
      }
    }
    stage('Build') {
      steps {
        dir(CWD) {
          sh 'npm run build'
        }
      }
    }
    stage('Test') {
      steps {
        dir(CWD) {
          sh 'npm run test:ci'
        }
      }
    }
  }
  post {
    always {
      dir(CWD) {
        junit '**/test-results.xml'
        sh 'rm -rf node_modules test-results.xml'
      }
    }

    success {
      sendTelegramMessage("&#128994; $TELEGRAM_MESSAGE succeeded.")
    }

    failure {
      sendTelegramMessage("&#128308; $TELEGRAM_MESSAGE failed.")
    }

    aborted {
      sendTelegramMessage("&#128993; $TELEGRAM_MESSAGE aborted.")
    }
  }
}