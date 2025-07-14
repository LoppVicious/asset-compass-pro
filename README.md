# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/adf89653-fdc1-492e-b89a-4bafe8800421

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/adf89653-fdc1-492e-b89a-4bafe8800421) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Database & Authentication)
- React Query (State Management)
- Zustand (Global State)
- Jest & Testing Library (Testing)

## Arquitectura del Proyecto

El proyecto está organizado siguiendo una arquitectura modular y escalable:

### 📁 `src/components`
Componentes reutilizables de la interfaz de usuario:
- **`ui/`**: Componentes base del sistema de diseño (buttons, inputs, cards, etc.)
- **`auth/`**: Componentes relacionados con autenticación (login, register, private routes)
- **`dashboard/`**: Componentes específicos del dashboard (gráficos, métricas, tablas)
- **`layout/`**: Componentes de estructura de página (header, sidebar, layout principal)

### 📁 `src/features`
Módulos organizados por funcionalidad de negocio:
- Cada feature contiene sus propios componentes, hooks y tipos
- Promueve la separación de responsabilidades
- Facilita el mantenimiento y la escalabilidad

### 📁 `src/hooks`
Custom hooks para lógica reutilizable:
- **Data fetching**: `useFetchPortfolios`, `useFetchOperations`, `usePositions`
- **Mutations**: `useMutatePortfolio`, `useMutateOperation`
- **Utilities**: `useToast`, `useMobile`

### 📁 `src/services`
Servicios para comunicación con APIs externas:
- **`priceService.ts`**: Manejo de precios históricos y actuales
- Abstrae la lógica de llamadas a Supabase
- Proporciona métodos reutilizables para operaciones CRUD

### 📁 `src/pages`
Componentes de página principal:
- **`DashboardPage.tsx`**: Panel principal con métricas y gráficos
- **`PortfoliosPage.tsx`**: Gestión de carteras de inversión
- **`OperationsPage.tsx`**: Registro y seguimiento de operaciones
- **`Settings.tsx`**: Configuración de usuario

### 📁 `src/utils`
Funciones utilitarias y helpers:
- **`calculations.ts`**: Cálculos financieros (rendimientos, ratios, etc.)
- **`dashboardUtils.ts`**: Utilidades específicas del dashboard
- **`utils.ts`**: Funciones generales (className merging, formateo, etc.)

### 📁 `src/store`
Estado global con Zustand:
- **`portfolioStore.ts`**: Gestión de estado de activos y precios
- Estado reactivo para datos de mercado
- Optimización de renders con selectores

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/adf89653-fdc1-492e-b89a-4bafe8800421) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
