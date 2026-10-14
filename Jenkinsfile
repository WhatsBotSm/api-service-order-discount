@Library('whatsbotsm-shared-lib') _

// Sitios, usuario y credencial SSH de cada entorno: NO van aqui. Salen de
// jenkins-shared-lib resources/whatsbotsm/sites.conf (whatsbotSites), la
// unica lista de sitios; deployApp()/deployStaticSite() los toman por rama.
def envConfig = [
    'stage-dev': [
        vaultPath:        'API_SECRET_DEV',
    ],
    'stage-qa': [
        vaultPath:        'API_SECRET_QA',
    ],
    'stage-uat': [
        vaultPath:        'API_SECRET_UAT',
    ],
    'main': [
        vaultPath:        'API_SECRET_BOT',
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
    vaultPath:        cfg.vaultPath,
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