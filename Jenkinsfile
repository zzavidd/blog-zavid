String CWD = 'code'
boolean isMaster = env.JOB_NAME == 'zavid'
String TELEGRAM_MESSAGE = isMaster
  ? "Master build *#$env.BUILD_NUMBER*"
  : "PR build *#$env.BUILD_NUMBER* on *$env.CHANGE_BRANCH* branch"

def sendTelegramMessage(){
  String result = "$currentBuild.result"
  String message = ""

  echo result

  if (result == "SUCCESS"){
    message = "\uD83D\uDFE2 $TELEGRAM_MESSAGE succeeded."
  } else if (result == "FAILURE"){
    message = "\uD83D\uDD34 $TELEGRAM_MESSAGE failed."
  } else {
    message = "\uD83D\uDFE1 $TELEGRAM_MESSAGE aborted."
  }

  def body = """
  {
    "chat_id": $CHAT_ID,
    "parse_mode": "Markdown",
    "text": "$message"
  }
  """

  httpRequest url: "https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage",
  httpMode: 'POST',
  requestBody: body,
  acceptType: 'APPLICATION_JSON_UTF8',
  contentType: 'APPLICATION_JSON_UTF8'
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
    stage('hi'){
      steps {
        echo 'woah'
      }
    }
    // stage('Install dependencies') {
    //   steps {
    //     dir(CWD) {
    //       sh 'npm ci'
    //     }
    //   }
    // }
    // stage('Check') {
    //   steps {
    //     dir(CWD) {
    //       sh 'npm run check'
    //     }
    //   }
    // }
    // stage('Build') {
    //   steps {
    //     dir(CWD) {
    //       sh 'npm run build'
    //     }
    //   }
    // }
    // stage('Test') {
    //   steps {
    //     dir(CWD) {
    //       sh 'npm run test:ci'
    //     }
    //   }
    // }
  }
  post {
    always {
      // dir(CWD) {
      //   junit '**/test-results.xml'
      //   sh 'rm -rf node_modules test-results.xml'
      // }
      sendTelegramMessage()
    }
  }
}