pipeline {
    agent any
    triggers {
        githubPush()
    }
    environment {
        SERVER = 'stagedev'
		BRANCH_NAME = 'stage-dev'
        NAME_REPO = 'api-service-order-discount'
        IMAGE_NAME = 'api-svc-discount'
        CONTAINER_NAME = 'api-discount'
        REMOTE_PORT = '22'
        REMOTE_PATH = '/home'
        REMOTE_SERVER = '192.168.1.98'
        REMOTE_USER = 'stagedev'
        SSH_CREDENTIALS_ID = 'SSH-DEVST'
    }
    stages {
        stage('Limpieza del Workspace') {
            steps {
                cleanWs()
            }
        }
        stage('Checkout') {
            steps {
                script {
                    git branch: "${BRANCH_NAME}", credentialsId: "USER_GH", url: "https://github.com/WhatsBotSm/${NAME_REPO}"
                }
            }
        }
        stage('Empaquetar') {
            steps {
                script {
                    sh """
                        echo "Creando el archivo tar para ${NAME_REPO}..."
                        # Empaquetar solo el contenido del repo (el workspace actual)
                        tar -czf ../${NAME_REPO}.tar.gz -C . .
                    """
                }
            }
        }
        stage('Validar creación del archivo tar') {
            steps {
                script {
                    def fileExists = sh(script: "test -f ../${NAME_REPO}.tar.gz && echo 'exists' || echo 'not found'", returnStdout: true).trim()
                    if (fileExists == "not found") {
                        error "El archivo tar no se ha creado. Verifica los errores en la etapa de empaquetado."
                    }
                }
            }
        }
        stage('Enviar a servidor remoto') {
            steps {
                script {
                    def rPathDeploy = "${REMOTE_PATH}/${SERVER}/deploy"
                    withCredentials([sshUserPrivateKey(credentialsId: SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                        sh """
                            ssh -i "\$SSH_KEY" -o StrictHostKeyChecking=no -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_SERVER} "mkdir -p ${rPathDeploy}"
                            scp -i "\$SSH_KEY" -P ${REMOTE_PORT} ../${NAME_REPO}.tar.gz ${REMOTE_USER}@${REMOTE_SERVER}:${rPathDeploy}
                        """
                    }
                }
            }
        }
        stage('Despliegue en servidor remoto') {
			steps {
				script {
				    def rPathDeploy = "${REMOTE_PATH}/${SERVER}/deploy/"
                    def imageName = "${IMAGE_NAME}:${BRANCH_NAME}"
                    def containerName = "${CONTAINER_NAME}"
					def envVars = [
                        NODE_ENV: 'stagedev',
                        PORT: '7005',
                        DB_HOST: '192.168.1.98',
                        DB_NAME: 'whatsbotsm',
                        DB_USER: 'ltorres',
                        DB_PASSWORD: 'pgpassworddev',
                        DB_PORT: '5432',
                        NUM_REQ_MAX_API: '100',
                        BASE_API: '/api/descuento/v1',
                        STORE_BOT: 'APPS_WBSM',
                        USEFIRESTORE: 'true',
                        API_URL_ADMIN: 'https://dev.whatsbot.com.mx/api/adminbot',
                    ]
					// Convierte variables de entorno a formato para Docker
					def envVarsStr = envVars.collect { k, v -> "-e ${k}=${v}" }.join(' ')
					def pathVolume = "${REMOTE_PATH}/${SERVER}/logs/${NAME_REPO}"
                    def envVolume = "${pathVolume}:/app/logs"

					def sshCommands = """mkdir -p ${rPathDeploy}${NAME_REPO}
						echo "Comprobación y parada del contenedor ${containerName}..."
						if [ \$(docker ps -q -f "name=${containerName}") ]; then
							docker stop ${containerName}
							echo "Contenedor ${containerName} detenido."
						else
							echo "No hay contenedor en ejecución con el nombre ${containerName}."
						fi
						
						echo "Eliminación del contenedor ${containerName}..."
						if [ \$(docker ps -aq -f "name=${containerName}") ]; then
							docker rm ${containerName}
							echo "Contenedor ${containerName} eliminado."
						else
							echo "No hay contenedor detenido con el nombre ${containerName}."
						fi
						
						echo "Comprobación de la existencia del archivo tar.gz..."        
						if [ -f ${rPathDeploy}${NAME_REPO}.tar.gz ]; then
							tar -xzf ${rPathDeploy}${NAME_REPO}.tar.gz -C ${rPathDeploy}${NAME_REPO}
						else
							echo "El archivo tar.gz no existe. Saliendo..."
							exit 1
						fi
						
						echo "Construcción y ejecución del contenedor Docker ${containerName}... ${envVarsStr}"
						docker build --target production --no-cache -t ${imageName} ${rPathDeploy}${NAME_REPO}
						mkdir -p ${pathVolume} && docker run --restart=always -d -p ${envVars.PORT}:${envVars.PORT} --name ${containerName} -v ${envVolume} ${envVarsStr} ${imageName}
						
						rm -f ${rPathDeploy}${NAME_REPO}.tar.gz
					"""
					
                    withCredentials([sshUserPrivateKey(credentialsId: SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                        sh """
						ssh -i "\$SSH_KEY" -o StrictHostKeyChecking=no -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_SERVER} << 'EOF'
						${sshCommands}
                        """
                    }

				}
			}
		}
		stage('Limpiar imágenes Docker obsoletas') {
            steps {
                script {
                withCredentials([sshUserPrivateKey(credentialsId: SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                        sh """
						ssh -i "\$SSH_KEY" -o StrictHostKeyChecking=no -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_SERVER}  "docker image prune -f"
                        """
                    }
                }
            }
        }
    }
}
