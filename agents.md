# AGENTS

This document describes the comprehensive agent system for this Tauri desktop application with Rust backend and modern React frontend.

## Overview

This Tauri application combines a high-performance Rust backend with a modern React frontend built on TanStack and Vite. The agent system orchestrates communication between these layers while maintaining type safety and optimal performance.

## Architecture

- **Frontend**: React + TypeScript with Vite build system
- **Backend**: Rust using Tauri framework
- **Communication**: Tauri's IPC (Inter-Process Communication) system
- **State Management**: TanStack Query for server state
- **Environment**: T3 Env for type-safe environment variables
- **Forms**: React Hook Form for form management

## Frontend Stack Details

### TanStack Vite Setup

- **Vite**: Lightning-fast development server and build tool
- **TanStack Query**: Powerful data synchronization for React
- **TanStack Router**: Type-safe routing (if used)
- **Hot Module Replacement**: Instant updates during development

### Environment Management (T3 Env)

```typescript
// env.ts
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_API_URL: z.string().url(),
    VITE_APP_ENV: z.enum(["development", "staging", "production"]),
  },
  runtimeEnv: import.meta.env,
});
```

### Form Management (React Hook Form)

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const result = await invoke('process_user_data', data);
    // Handle result
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      {errors.name && <span>{errors.name.message}</span>}
      
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Key Components

### Tauri Commands (Rust Backend)

```rust
use tauri::command;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct UserData {
    name: String,
    email: String,
}

#[derive(Serialize)]
struct ProcessResult {
    success: bool,
    message: String,
    id: Option<u32>,
}

#[command]
async fn process_user_data(data: UserData) -> Result<ProcessResult, String> {
    // Validate and process data
    match validate_user(&data) {
        Ok(user_id) => Ok(ProcessResult {
            success: true,
            message: "User processed successfully".to_string(),
            id: Some(user_id),
        }),
        Err(e) => Err(format!("Processing failed: {}", e)),
    }
}

#[command]
async fn get_user_list() -> Result<Vec<UserData>, String> {
    // Fetch users from database/storage
    Ok(vec![]) // Implementation here
}
```

### Frontend Data Fetching (TanStack Query)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/tauri';

// Query hook for fetching data
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => invoke<UserData[]>('get_user_list'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Mutation hook for updating data
export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: UserData) => 
      invoke<ProcessResult>('process_user_data', userData),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Usage in component
function UserManagement() {
  const { data: users, isLoading, error } = useUsers();
  const createUser = useCreateUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {users?.map(user => (
        <div key={user.email}>{user.name}</div>
      ))}
      <UserForm onSubmit={createUser.mutate} />
    </div>
  );
}
```

## Agent Patterns

### Data Agents

- **Purpose**: Handle data persistence, caching, and synchronization
- **Frontend**: TanStack Query for caching and background updates
- **Backend**: Rust services for database operations and business logic
- **Pattern**: React Query + Tauri commands for seamless data flow

```rust
#[command]
async fn save_settings(settings: AppSettings) -> Result<(), String> {
    // Persist to local storage/database
    Ok(())
}

#[command]
async fn get_settings() -> Result<AppSettings, String> {
    // Retrieve from storage with fallback to defaults
    Ok(AppSettings::default())
}
```

### System Agents

- **File Operations**: Handle file system interactions securely
- **OS Integration**: System notifications, window management
- **Hardware Access**: Camera, microphone, system info

```rust
use tauri::api::notification::Notification;

#[command]
async fn show_notification(title: String, body: String) -> Result<(), String> {
    Notification::new(&tauri::generate_context!().config().tauri.bundle.identifier)
        .title(&title)
        .body(&body)
        .show()
        .map_err(|e| e.to_string())
}
```

### Network Agents

- **HTTP Client**: Centralized API communication
- **Error Handling**: Consistent error boundaries
- **Retry Logic**: Built into TanStack Query

```typescript
// Custom hook for external API calls
export function useExternalData(endpoint: string) {
  return useQuery({
    queryKey: ['external', endpoint],
    queryFn: async () => {
      const result = await invoke<ApiResponse>('fetch_external_data', { endpoint });
      return result;
    },
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
```

## State Management Strategy

### Local State (React)

- Component state with `useState`
- Form state with React Hook Form
- UI state (modals, dropdowns, etc.)

### Server State (TanStack Query)

- API data caching
- Background synchronization
- Optimistic updates
- Error handling and retries

### Global State (Context/Zustand if needed)

- User authentication state
- Application-wide settings
- Theme preferences

## Development Workflow

### Environment Setup

```bash
# Install dependencies
npm install

# Development mode (frontend + backend)
npm run tauri dev

# Build for production
npm run tauri build
```

### Type Safety Pipeline

1. **Zod schemas** for runtime validation
2. **TypeScript** for compile-time safety
3. **T3 Env** for environment variable validation
4. **React Hook Form + Zod** for form validation

## Error Handling Strategy

### Frontend Error Boundaries

```typescript
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <div>
              Something went wrong
              <button onClick={resetErrorBoundary}>Try again</button>
            </div>
          )}
        >
          <AppContent />
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
```

### Backend Error Handling

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(String),
    #[error("Validation error: {0}")]
    Validation(String),
    #[error("Network error: {0}")]
    Network(String),
}

impl From<AppError> for String {
    fn from(err: AppError) -> Self {
        err.to_string()
    }
}
```

## Best Practices

### Performance

1. **Lazy Loading**: Code splitting with React.lazy
2. **Query Optimization**: Smart caching with TanStack Query
3. **Bundle Optimization**: Vite's tree shaking and chunking
4. **Rust Optimization**: Release builds with LTO

### Security

1. **Input Validation**: Zod schemas on frontend + Rust validation
2. **CSP Headers**: Content Security Policy in Tauri config
3. **Secure IPC**: Never expose sensitive Rust functions
4. **Environment Isolation**: T3 Env for safe env var handling

### Developer Experience

1. **Hot Reload**: Instant feedback during development
2. **Type Safety**: End-to-end TypeScript + Rust types
3. **Error Messages**: Meaningful error reporting
4. **Debug Tools**: React DevTools + Tauri DevTools

## File Structure

```
├── src/                    # Frontend React code
│   ├── components/         # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and configurations
│   ├── pages/             # Route components
│   └── types/             # TypeScript type definitions
├── src-tauri/             # Rust backend
│   ├── src/               # Rust source code
│   ├── icons/             # App icons
│   └── tauri.conf.json    # Tauri configuration
├── public/                # Static assets
└── package.json           # Frontend dependencies
```

## Development Notes

- Frontend development server runs on Vite's default port
- Tauri handles the desktop window and backend processes
- Hot reload works for both frontend and backend (with `cargo watch`)
- Use TypeScript strict mode for maximum type safety
- Leverage TanStack Query's devtools for debugging data flow
