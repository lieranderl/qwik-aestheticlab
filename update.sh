#!/bin/bash
git clone git@github.com:lieranderl/qwik-aestheticlab.git /aesthetic
cd /aesthetic
docker-compose build
find /aesthetic -mindepth 1 ! -path '/aesthetic/n8n_files/*' ! -path '/aesthetic/caddy_config/*' ! -name 'n8n_files' ! -name 'caddy_config' ! -name 'Dockerfile' ! -name 'docker-compose.yaml' ! -name 'update.sh' -exec rm -rf {} +
docker-compose pull
docker-compose down
docker-compose up -d