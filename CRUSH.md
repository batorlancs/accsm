# CRUSH.md - ACC Setup Manager Development Guide

## Project Overview

**ACC Setup Manager (ACCSM)** is a Tauri-based desktop application for managing Assetto Corsa Competizione car setups. The app provides a modern interface for organizing, editing, and managing JSON setup files with a Rust backend for file operations and a React frontend for the UI.

## Essential Commands

### Development
```bash
pnpm dev             # Start development server (Vite on port 3000)
pnpm install         # Install dependencies
```

### Building & Production
```bash
pnpm build           # Build for production (Vite + TypeScript)
pnpm serve           # Preview production build
```

### Testing & Quality
```bash
pnpm test            # Run Vitest tests
pnpm lint            # Run Biome linter
pnpm format          # Format code with Biome
pnpm check           # Run Biome check (lint + format)
```

### Tauri Commands
```bash
# The following are automatically run by pnpm scripts:
# cargo tauri dev      # Start Tauri in development mode
# cargo tauri build    # Build Tauri app for production
```

### Adding UI Components
```bash
pnpx shadcn@latest add button    # Add shadcn components
pnpx shadcn@latest add dialog    # Components go to src/components/ui/
```

## Project Structure

### Frontend (`src/`)
```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── modals/         # Global modal system with Zustand
│   ├── viewers/        # Car/Track/Explorer viewers
│   └── views/          # Main view components
├── hooks/              # React hooks (useBackend.ts is key)
├── routes/             # TanStack Router file-based routing
├── services/           # API layer (TauriAPI class)
├── types/              # TypeScript type definitions
├── lib/                # Utility functions
└── integrations/       # Third-party integrations
```

### Backend (`src-tauri/`)
```
src-tauri/
├── src/
│   ├── commands.rs     # Tauri command handlers
│   ├── models.rs       # Data structures
│   ├── state.rs        # App state management
│   └── data.rs         # Data operations
├── Cargo.toml          # Rust dependencies
└── tauri.conf.json     # Tauri configuration
```

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **TanStack Router** - File-based routing
- **TanStack Query** - Server state management
- **Zustand** - Client state management (modals)
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI component library
- **Radix UI** - Headless components
- **Vite** - Build tool

### Backend  
- **Tauri 2.9** - Desktop app framework
- **Rust** - Backend language
- **serde** - JSON serialization
- **tokio** - Async runtime
- **notify** - File system watching

## Code Conventions

### File Organization
- Use kebab-case for file names (`delete-setup-modal.tsx`)
- Components use PascalCase (`DeleteSetupModal`)
- Hooks use camelCase with `use` prefix (`useBackend`)
- Types go in `/types/` directory
- API calls centralized in `/services/api.ts`

### TypeScript Patterns
- Strict typing with interfaces for all data structures
- Backend types in `/types/backend.ts` match Rust models exactly
- Use `Record<string, T>` for object maps
- Extensive use of generics in TanStack Query

### React Patterns
- Functional components with hooks
- Custom hooks for all backend interactions (`useBackend.ts`)
- Compound component pattern for complex UI
- Controlled components with `use-controlled-state` hook

### Styling Conventions
- **Biome formatting**: 4-space indentation, double quotes
- **Tailwind**: Utility-first CSS with design system
- **CSS Variables**: Dark theme support via `next-themes`
- **Component variants**: Using `class-variance-authority` (CVA)
- **Global modals**: Zustand store manages modal state globally
- **Event system**: Real-time updates via Tauri events (`setups-changed`)

### State Management Patterns
- **Server state**: TanStack Query with custom hooks
- **Client state**: Zustand stores for modals and UI state
- **Form state**: Controlled components with validation
- **Global state**: Context + hooks pattern

## Key Architectural Patterns

### Backend Communication
```typescript
// All Tauri commands go through TauriAPI class
export class TauriAPI {
    static async getSetup(params: GetSetupParams): Promise<SetupFile> {
        return invoke<SetupFile>("get_setup", params);
    }
}

// Wrapped in React Query hooks for caching
export function useSetup(car: string, track: string, filename: string) {
    return useQuery({
        queryKey: queryKeys.setup(car, track, filename),
        queryFn: () => TauriAPI.getSetup({ car, track, filename }),
    });
}
```

### Modal System
- Global modal state managed by Zustand
- Modal components rendered at root level
- Context passed via store for any component to trigger modals

### File Structure Pattern
```
ACC Setups Directory/
├── car_model_id/           # e.g., "bmw_m4_gt3"
│   └── track_id/          # e.g., "spa"
│       ├── setup1.json    # Individual setup files
│       └── setup2.json
└── another_car/
    └── another_track/
```
- Backend scans this structure recursively
- Maps car/track IDs to display names using internal data
- Real-time updates via Tauri events (`setups-changed`)
- File watcher detects changes and auto-refreshes

### Error Handling
- Custom `AccError` type in Rust backend
- Toast notifications via `sonner` for user feedback
- TanStack Query handles loading/error states

## Important Gotchas

### Package Manager
- **Uses pnpm, not npm** - Always use `pnpm` commands
- Has `pnpm-lock.yaml` for dependency locking
- All scripts in package.json work with `pnpm run <script>`

### Biome Configuration
- Excludes generated files: `routeTree.gen.ts`, `styles.css`
- 4-space indentation (not 2)
- Double quotes enforced
- Auto-organize imports enabled

### TanStack Router
- File-based routing in `/routes/` directory  
- Auto-generates `routeTree.gen.ts` - never edit manually
- Root route in `__root.tsx` contains global providers

### Tauri Integration
- All backend calls are async
- Use `invoke()` for commands, `listen()` for events
- File paths must be absolute when passed to backend
- Backend events auto-refresh frontend via TanStack Query

### Build Process
- Frontend builds to `/dist/` directory
- Tauri serves from `frontendDist: "../dist"`
- Development runs on port 3000 (configured in `tauri.conf.json`)

### Component Library
- Uses shadcn/ui "new-york" style variant
- Components auto-configured for Tailwind 4
- Custom registry for animate-ui components
- All UI components have consistent focus/invalid states

## Testing Approach

### Test Setup
- **Vitest** for unit testing
- **@testing-library/react** for component testing
- **jsdom** environment for DOM testing
- Test files co-located with components

### Testing Patterns
- Focus on user interactions over implementation details
- Mock Tauri API calls for frontend tests
- Test custom hooks in isolation
- Integration tests for complex user flows

## Common Development Tasks

### Adding a New Setup Operation
1. Add Rust command in `commands.rs`
2. Add parameters type in `types/backend.ts`
3. Add method to `TauriAPI` class
4. Create React Query hook in `useBackend.ts`
5. Use hook in component

### Adding a New Modal
1. Create modal component in `/components/modals/`
2. Add state to Zustand store in `useGlobalModals.tsx`
3. Add modal to `GlobalModals.tsx`
4. Use modal actions in components

### Adding a New Route
1. Create file in `/routes/` directory
2. TanStack Router auto-generates route config
3. Add navigation with `Link` component
4. Use loaders for data fetching

### Styling New Components
1. Check existing shadcn components first
2. Use `cn()` utility for className merging
3. Follow existing component patterns
4. Use CVA for variant-based styling

## Development Tips

- Use TanStack devtools for debugging queries and router
- Check browser console for Tauri API errors
- Use `toast.error()` for user-facing error messages
- File watching auto-refreshes data via backend events
- Always type backend interfaces to match Rust models exactly
- Use `useGlobalModals` for any modal interactions
- Leverage existing query keys pattern for cache management

## Project Context

This is an **ACC (Assetto Corsa Competizione) Setup Manager** - a desktop tool for organizing and managing car setup files for the racing simulation game. 

### Key Features
- **File System Integration**: Reads JSON setup files from user's ACC directory
- **Car/Track Organization**: Hierarchical structure: `Car > Track > Setup Files`
- **Real-time Monitoring**: File system watcher for automatic updates
- **Setup Validation**: Validates setup files against car specifications
- **Drag & Drop**: Import setups via drag and drop interface
- **Modern UI**: Dark theme, responsive design with racing-focused UX

### Data Flow
1. Backend scans ACC setups folder (`~/Documents/Assetto Corsa Competizione/Setups/`)
2. Organizes files by car model and track
3. Frontend displays in hierarchical tree structure
4. Real-time updates via Tauri events when files change
5. CRUD operations sync back to filesystem