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
                  sh 'docker-compose down'
                  sh 'docker-compose up -d --build'
                } 
                else if (env.BRANCH_NAME == 'development') {
                  echo 'Building preview for development'
                  sh 'docker-compose down'
                  sh 'docker-compose up --build'
                }
                else {
                  echo 'Branch was not selected for preview build!'
                }
            }
        }
    }
  } 
}
