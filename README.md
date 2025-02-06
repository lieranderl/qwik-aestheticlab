# Deployment docker compose

```bash
docker volume create caddy_data
docker volume create n8n_data
docker-compose build
```
- export env

```bash
docker-compose up -d
```

# N8N

```bash
n8n import:credentials --input=/files/creds.json
n8n import:workflow --input=/files/aestheticlab_workflows.json
n8n update:workflow --all --active=true
```