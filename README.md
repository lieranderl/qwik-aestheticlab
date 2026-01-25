# Aesthetic Lab | Qwik + DaisyUI

A premium web application for Aesthetic Lab, built with Qwik and styled with modern Vanilla CSS and DaisyUI.

## 🚀 Tech Stack

- **Framework**: [Qwik](https://qwik.dev/)
- **Styling**: [DaisyUI](https://daisyui.com/) + TailwindCSS / Vanilla CSS
- **Data**: [Supabase](https://supabase.com/)
- **Runtime**: [Bun](https://bun.sh/)
- **Linter/Formatter**: [Biome](https://biomejs.dev/)

## ✨ Key Features

- **Blazing Fast**: Qwik's resumability ensures instant loading.
- **Multi-language Support**: Integrated `qwik-speak` for internationalization (en, nl, fr, ru, uk).
- **SEO Optimized**: Pre-configured JSON-LD and meta tags.
- **Premium Design**: Modern aesthetic with DaisyUI components.

## 🛠️ Local Development

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

## 📦 Deployment

The project includes a `Dockerfile` and a `Makefile` target for deploying to Google Cloud Run:

```bash
make docker-build-push TAG=v1.0.0
make gcloud-deploy TAG=v1.0.0
```

## 📜 License

MIT — see [LICENSE](file:///Users/evfedoto/Documents/Projects/qwik-aestheticlab/LICENSE) file for details.
