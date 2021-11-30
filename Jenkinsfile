pipeline {
  agent any
  stages {
    stage("Prep for per-dir Jenkinsfile") {
        steps {
          checkout(scm)
          sh 'git clean -fdx'
        }
    }
    stage('Build') {
        steps {
            script {
                if (env.BRANCH_NAME == 'master') {
                  echo 'Building preview for master'
                  sh 'cd docker && docker-compose down'
                  sh 'cd docker && docker-compose up -d --build'
                } 
                else if (env.BRANCH_NAME == 'development') {
                  echo 'Building preview for development'
                  sh 'cd docker && docker-compose down'
                  sh 'cd docker && docker-compose up -d --build'
                }
                else {
                  echo 'Branch was not selected for preview build!'
                }
            }
        }
    }
  } 
}
