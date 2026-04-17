# Aesthetic Lab | Qwik + DaisyUI

A multilingual marketing site for Aesthetic Lab, built with Qwik City and styled with Tailwind CSS v4 plus DaisyUI 5.

## 🚀 Tech Stack

- **Framework**: [Qwik](https://qwik.dev/)
- **Styling**: [DaisyUI](https://daisyui.com/) + Tailwind CSS v4 (CSS-first config)
- **Data**: [Supabase](https://supabase.com/)
- **Runtime**: [Bun](https://bun.sh/)
- **Linter/Formatter**: [Biome](https://biomejs.dev/)

## ✨ Key Features

- **Blazing Fast**: Qwik's resumability ensures instant loading.
- **Multi-language Support**: Integrated `qwik-speak` for internationalization (en, nl, fr, ru, uk).
- **SEO Optimized**: Pre-configured JSON-LD and meta tags.
- **Premium Design**: Modern aesthetic with DaisyUI components.

## 🛠️ Local Development

Before making changes, read [AGENTS.md](AGENTS.md) for project conventions and [CLAUDE.md](CLAUDE.md) for the AI-agent entrypoint.

### Prerequisites

- [Bun](https://bun.sh/) installed.
- Supabase account (or local instance).

### Setup

1.  **Clone the repository**:
    ```bash
    git clone <repo-url>
    cd qwik-aestheticlab
    ```

2.  **Environment Variables**:
    Copy `.env.example` to `.env` and fill in your credentials:
    ```bash
    cp .env.example .env
    ```

3.  **Install dependencies**:
    ```bash
    bun install
    ```

4.  **Run Development Server**:
    ```bash
    make dev
    ```

### Available Commands (Makefile)

- `make help`: Show all available commands.
- `make dev`: Start development server.
- `make build`: Build for production.
- `make lint`: Run Biome checks.
- `make clean`: Reset node_modules and build artifacts.

## AI Workflow

- Start non-trivial work with a plan in `plans/`.
- Use `AGENTS.md` as the canonical shared policy.
- Split work into planner, implementer, reviewer, and verifier roles when helpful; one agent may cover multiple roles if needed.
- Prefer a fresh review or verification pass before claiming completion on substantial work.
- Use `.claude/rules/` for path-scoped workflow hints instead of expanding the root docs indefinitely.
- Use `/doctor-project` for a quick repository health check when workflow, config, or environment behavior feels off.

See [CLAUDE.md](CLAUDE.md), [.codex/README.md](.codex/README.md), [plans/README.md](plans/README.md), and [REVIEW.md](REVIEW.md).

## 📦 Deployment

The project includes a `Dockerfile` and a `Makefile` target for deploying to Google Cloud Run:

```bash
make docker-build-push TAG=v1.0.0
make gcloud-deploy TAG=v1.0.0
```

## 📜 License

MIT — see [LICENSE](LICENSE) for details.
