@Library('whatsbotsm-shared-lib') _

def envConfig = [
    'stage-dev': [
        sites:            [tecamac: '100.75.28.73',  texcoco: '100.75.19.175'],
        vaultPath:        'API_SECRET_DEV',
        remoteUser:       'stagedev',
        sshCredentialsId: 'SSH-DEVST',
    ],
    'stage-qa': [
        sites:            [tecamac: '100.75.59.237', texcoco: '100.75.218.76'],
        vaultPath:        'API_SECRET_QA',
        remoteUser:       'stageqa',
        sshCredentialsId: 'SSH-QA',
    ],
    'stage-uat': [
        sites:            [tecamac: '100.75.113.148', texcoco: '100.75.57.120'],
        vaultPath:        'API_SECRET_UAT',
        remoteUser:       'stageuat',
        sshCredentialsId: 'SSH-UAT',
    ],
    'main': [
        sites:            [tecamac: '100.75.96.90', texcoco: '100.75.36.226'],
        vaultPath:        'API_SECRET_BOT',
        remoteUser:       'bot',
        sshCredentialsId: 'SSH-BOT',
    ],
]

def cfg = envConfig[env.BRANCH_NAME]
if (!cfg) {
    error("Rama sin configuracion: ${env.BRANCH_NAME}")
}

deployApp(
    repoService:      'api-service-order-discount',
    replicas: 1,
    branch:           env.BRANCH_NAME,
    sites:            cfg.sites,
    vaultPath:        cfg.vaultPath,
    remoteUser:       cfg.remoteUser,
    sshCredentialsId: cfg.sshCredentialsId,
    port:             '7005',

    nginxRoute: [
        path:          '/api/descuento/',
        proxyPassPath: '/api/descuento/v1/',
    ],

    staticEnv: [
        BASE_API:               '/api/descuento/v1',   // propio de este repo, no secreto
        API_URL_ADMINBOT:       'http://apps-api-admin-bot_api-admin-bot:7000/api/adminbot/v1',
    ],

    vaultKeys: [
        config: ['NODE_ENV', 'NUM_REQ_MAX_API',
                 'ALGORITHM', 'ENCODE_RSA', 'CIFRADO_RSA', 'ENCODE_PRMS_CRP',
                 'STORE_BOT', 'ID_ALERT', 'URL_RTDB'],
        dbpool: ['DB_NAME', 'DB_USER', 'DB_PASSWORD'],
        saas:   ['SAAS_API_URL', 'SAAS_API_TOKEN', 'SAAS_CRUMB'],
    ],

    dryRun:   false,
    runLint:  true,
)