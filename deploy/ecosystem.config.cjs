/** PM2 process file — alternative to systemd.
 *
 * Usage:
 *   cd /var/www/micilla-eduweb
 *   pm2 start deploy/ecosystem.config.cjs
 *   pm2 save
 *   pm2 startup
 */

module.exports = {
  apps: [
    {
      name: "micilla-eduweb",
      cwd: "/var/www/micilla-eduweb",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
