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

## N8N

```bash
docker exec -it n8n sh -c "n8n import:credentials --input=/files/creds.json && n8n import:workflow --input=/files/workflows.json && n8n update:workflow --id=PgnuLOJDGJgX1OeB --active=true"
docker-compose restart n8n
```


