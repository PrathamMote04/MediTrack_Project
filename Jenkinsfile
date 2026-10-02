pipeline {
    agent any
  stages{
    stage('Install Dependencies') {
    steps {
        dir('meditrack') {
           bat('npm install')
        }
    }
}
  stage('Build Meditrack')
  {
    steps{
      dir('meditrack'){
      bat('npm run build')
      }
    }
  }
  
}
}
