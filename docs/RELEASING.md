# Releasing Docker images

This repo publishes two independent container images to GitHub Container Registry (GHCR):

- `ghcr.io/<owner>/playbacc-api`
- `ghcr.io/<owner>/playbacc-web`

## Trigger

Images are built and published **only** when pushing version tags.

### API

Tag format:

- `api/v<semver>`

Example:

```bash
git tag api/v1.2.3
git push origin api/v1.2.3
```

Publishes:

- `playbacc-api:1.2.3`
- `playbacc-api:latest`

### Web

Tag format:

- `web/v<semver>`

Example:

```bash
git tag web/v0.4.1
git push origin web/v0.4.1
```

Publishes:

- `playbacc-web:0.4.1`
- `playbacc-web:latest`
