module.exports.apps = [{
    name: "whtsb-api-service-order-v1",
    script: "./app.js",
    watch: false,
    max_memory_restart: "256M",
    exec_mode: "cluster",
    instances: 1,
    cron_restart: "59 23 * * *"
}]