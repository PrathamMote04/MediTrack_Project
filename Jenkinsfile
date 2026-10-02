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
          post{
              success{
               echo('Meditrack pipline completed successfully')
              }
              failure{
              echo('Meditrack pipline fail')
              }
          
      }
  
}
}
