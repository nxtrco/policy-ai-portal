# Environment Configuration

This document explains how to configure the API base URL for different environments.

## Overview

The application now uses environment-based configuration to determine the API base URL. This allows you to easily switch between development and production environments.

## Configuration Files

### Main Configuration: `src/config/environment.ts`

This is the main configuration file where you can modify the API URLs for different environments.

```typescript
export const ENVIRONMENT = {
  // Set to 'development' for local development, 'production' for production
  NODE_ENV: import.meta.env.MODE || 'development',
  
  // API Base URLs
  DEVELOPMENT_API_URL: 'http://localhost:8000',
  PRODUCTION_API_URL: 'https://complain-management-be-1079206590069.europe-west1.run.app',
  
  // API Version
  API_VERSION: 'v1',
};
```

## How It Works

1. **Development Mode**: When running in development mode (`npm run dev`), the app uses `http://localhost:8000`
2. **Production Mode**: When running in production mode (`npm run build`), the app uses the production URL

## Usage in Code

All API calls now use the `buildApiUrl()` helper function from `@/lib/api`:

```typescript
import { apiFetch, buildApiUrl } from '@/lib/api';

// Instead of hardcoded URLs like:
// "https://complain-management-be-1079206590069.europe-west1.run.app/api/v1/auth/login"

// Use:
const response = await apiFetch(buildApiUrl("/auth/login"), {
  method: "POST",
  // ... other options
});
```

## Available Functions

- `buildApiUrl(endpoint)`: Builds a full API URL with the correct base URL
- `API_URL`: The full API URL (base + version)
- `API_BASE_URL`: Just the base URL
- `ENV_INFO`: Object containing environment information for debugging

## Customizing for Different Environments

### For Local Development

If you need to use a different local URL, modify `src/config/environment.ts`:

```typescript
DEVELOPMENT_API_URL: 'http://localhost:3000', // or your preferred local URL
```

### For Staging Environment

You can add a staging configuration by modifying the logic:

```typescript
export const getApiBaseUrl = (): string => {
  const env = ENVIRONMENT.NODE_ENV;
  
  if (env === 'development') return ENVIRONMENT.DEVELOPMENT_API_URL;
  if (env === 'staging') return 'https://staging-api.example.com';
  return ENVIRONMENT.PRODUCTION_API_URL;
};
```

### Using Environment Variables

For more flexibility, you can use Vite's environment variables:

1. Create a `.env.local` file (for local development):
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

2. Create a `.env.production` file (for production):
   ```
   VITE_API_BASE_URL=https://complain-management-be-1079206590069.europe-west1.run.app
   ```

3. Update `src/config/environment.ts`:
   ```typescript
   export const ENVIRONMENT = {
     NODE_ENV: import.meta.env.MODE || 'development',
     API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
     API_VERSION: 'v1',
   };
   ```

## Files Updated

The following files have been updated to use the new environment configuration:

- `src/lib/api.ts` - Added `buildApiUrl()` helper function
- `src/pages/Login.tsx` - Updated API calls
- `src/pages/UserManagement.tsx` - Updated API calls
- `src/pages/PromptManagement.tsx` - Updated API calls (JSON-based system)
- `src/pages/Ask.tsx` - Updated API calls
- `src/pages/Questions.tsx` - Updated API calls
- `src/pages/Summary.tsx` - Updated API calls
- `src/pages/Policies.tsx` - Updated API calls
- `src/pages/ChangePassword.tsx` - Updated API calls

## JSON-Based Prompt Management

The application now supports a JSON-based prompt management system with the following features:

### Key Features
- **JSON Storage**: Prompts stored in simple JSON files
- **Variable Validation**: Validates required variables before saving
- **Preview Functionality**: Preview prompts with sample data
- **Real-time Validation**: Validate prompts before saving
- **Variable Documentation**: Show available variables and their descriptions

### API Endpoints
- `GET /api/v1/admin/prompts` - Get all prompts
- `GET /api/v1/admin/prompts/{prompt_type}` - Get specific prompt
- `PUT /api/v1/admin/prompts/{prompt_type}` - Update prompt
- `POST /api/v1/admin/prompts/{prompt_type}/validate` - Validate prompt
- `POST /api/v1/admin/prompts/{prompt_type}/preview` - Preview prompt
- `GET /api/v1/admin/prompts/{prompt_type}/variables` - Get variable info

### Supported Prompt Types
- `generation_prompt` - For generating complaint responses
- `extraction_prompt` - For extracting questions from complaints
- `summarization_prompt` - For summarizing complaints

## Benefits

1. **Easy Environment Switching**: No need to manually change URLs in multiple files
2. **Consistent Configuration**: All API calls use the same base URL
3. **Maintainable**: Single source of truth for API configuration
4. **Flexible**: Easy to add new environments or modify existing ones
5. **Type Safe**: TypeScript ensures correct usage
6. **JSON-Based Prompts**: Simple and easy to manage prompt storage

## Troubleshooting

### API Calls Not Working

1. Check that the correct base URL is set in `src/config/environment.ts`
2. Verify that the environment mode is correct (`development` vs `production`)
3. Ensure all API calls use `buildApiUrl()` instead of hardcoded URLs
4. For local development, ensure your backend is running on port 8000

### Environment Not Detected

The environment is detected using Vite's `import.meta.env.MODE`. Make sure you're running the correct command:
- `npm run dev` for development
- `npm run build` for production

### Prompt Management Issues

1. Ensure you're logged in as an admin user (`admin@admin.com`)
2. Check that the backend JSON service is running
3. Verify that the `ai/prompts.json` file exists and is readable
4. Check browser console for any API errors

### Debugging

You can log the environment information to see what's being used:

```typescript
import { ENV_INFO } from '@/config/env';
console.log('Environment Info:', ENV_INFO);
```

## Backend Requirements

For the JSON-based prompt management to work, ensure your backend has:

1. **JSON Service**: `ai/json_service.py` for handling JSON-based prompt operations
2. **Prompt Storage**: `ai/prompts.json` file containing the prompt definitions
3. **API Endpoints**: All the prompt management endpoints implemented
4. **Authentication**: Admin-only access control for prompt management endpoints 