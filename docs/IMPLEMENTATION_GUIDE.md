# Masqany Mobile - Implementation Guide

## Document Purpose

This guide translates the **Expo Enterprise Specifications** into actionable development workflows for the Masqany mobile app. Every module will follow this guide to ensure consistency, scalability, and enterprise-grade quality.

---

## 🎯 Core Principles

### 1. **Modular Architecture**

- Each feature is self-contained in `modules/[feature-name]/`
- No cross-module imports except through `shared/` or `lib/`
- Each module has: `api.ts`, `hooks.ts`, `types.ts`, `index.ts`

### 2. **Three-Layer State Management**

* State TypeToolUse Cases**Server State**TanStack QueryAPI data, caching, pagination, mutations**UI State**ZustandModals, loaders, selections, video playback**Business-Critical**ReduxPayments, bookings, transactions**App Context**Context APITheme, auth session, language

### 3. **Strict Separation of Concerns**

- **Components** → Render only
- **Hooks** → Data orchestration (TanStack Query)
- **API Layer** → Pure HTTP calls (no React, no hooks)
- **Stores** → UI state management (Zustand/Redux)

---

## 📁 Module Structure Template

```
modules/[module-name]/
├── api.ts           # Pure HTTP calls (axios)
├── hooks.ts         # TanStack Query hooks
├── types.ts         # TypeScript interfaces
├── index.ts         # Public API exports
└── store/           # (Optional) Local Zustand slice
    └── [feature].store.ts
```

### Example: Property Module

```typescript
// modules/property/api.ts
export const propertyApi = {
  getAll: (filters) => apiClient.get('/properties', { params: filters }),
  getById: (id) => apiClient.get(`/properties/${id}`),
  create: (data) => apiClient.post('/properties', data),
}

// modules/property/hooks.ts
export const useProperties = (filters) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyApi.getAll(filters),
  })
}

// modules/property/types.ts
export interface Property {
  id: string
  title: string
  // ...
}

// modules/property/index.ts
export * from './api'
export * from './hooks'
export * from './types'
```

---

## 🔄 Module Development Workflow

### Phase 1: Planning & Requirements

1. **Create Spec File** (`.kiro/specs/[module-name]/`)

   - `requirements.md` - Business requirements
   - `design.md` - Technical design
   - `tasks.md` - Implementation tasks
2. **Define API Contracts**

   - Document expected endpoints
   - Define request/response schemas
   - Plan error handling
3. **Identify State Needs**

   - Server state → TanStack Query
   - UI state → Zustand
   - Business-critical → Redux

### Phase 2: Implementation

1. **Create Module Structure**

   ```bash
   mkdir -p modules/[module-name]
   touch modules/[module-name]/{api,hooks,types,index}.ts
   ```
2. **Define Types First** (`types.ts`)

   - All interfaces and types
   - Request/response payloads
   - Domain models
3. **Implement API Layer** (`api.ts`)

   - Pure HTTP calls
   - No React dependencies
   - Export named functions
4. **Create Query Hooks** (`hooks.ts`)

   - TanStack Query hooks
   - Query keys as constants
   - Mutations with invalidation
5. **Add UI State** (if needed)

   - Create Zustand store in `store/`
   - Use selectors pattern
   - Keep state flat
6. **Export Public API** (`index.ts`)

   ```typescript
   export * from './api'
   export * from './hooks'
   export * from './types'
   ```

### Phase 3: Testing & Documentation

1. **Create Mock Data** (`assets/data/[module].ts`)

   - For development/testing
   - Matches API response structure
2. **Document Module**

   - API endpoints used
   - Query keys
   - State management approach
   - Integration points
3. **Run Deployment Checks**

   ```bash
   npx expo-doctor
   pnpm install
   npx expo prebuild --clean
   ```

---

## 🎨 TanStack Query Standards

### Query Client Configuration

```typescript
// lib/query/client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutes
      cacheTime: 1000 * 60 * 30,     // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,    // Mobile optimization
    }
  }
})
```

### Query Keys Pattern

```typescript
// Always use structured query keys
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id) => [...propertyKeys.details(), id] as const,
}
```

### Infinite Scroll Pattern (TikTok-style)

```typescript
export const usePropertyFeed = () => {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam = 1 }) => 
      apiClient.get('/feed', { params: { page: pageParam } }),
    getNextPageParam: (lastPage) => lastPage.data.nextPage ?? undefined,
  })
}
```

### Mutation Pattern

```typescript
export const useCreateProperty = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => propertyApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['properties'])
    },
  })
}
```

---

## 🎭 Zustand Standards

### Store Structure

```
store/
├── ui/
│   ├── modal.store.ts
│   ├── feed.store.ts
│   ├── map.store.ts
│   └── index.ts
└── auth.store.ts
```

### Store Pattern

```typescript
// store/ui/modal.store.ts
export const useModalStore = create((set) => ({
  activeModal: null,
  openModal: (name) => set({ activeModal: name }),
  closeModal: () => set({ activeModal: null }),
}))

// Usage with selectors (ALWAYS)
const activeModal = useModalStore(s => s.activeModal)
const openModal = useModalStore(s => s.openModal)
```

### Performance Rules

1. **Always use selectors** - Never `const state = useStore()`
2. **Use shallow for multiple values**
   ```typescript
   import { shallow } from 'zustand/shallow'
   const { isOpen, open } = useModalStore(
     (s) => ({ isOpen: s.isOpen, open: s.open }),
     shallow
   )
   ```
3. **Keep state flat** - Avoid deep nesting

---

## 🚫 Prohibited Patterns

| ❌ Don't Do This                 | ✅ Do This Instead                          | Why                           |
| -------------------------------- | ------------------------------------------- | ----------------------------- |
| Store server data in Zustand     | Use TanStack Query                          | Lose caching, duplicate state |
| Call APIs directly in components | Use query hooks                             | Breaks caching, deduplication |
| Generic query keys `['data']`  | Structured keys `['properties', filters]` | Cache collisions              |
| Cross-module imports             | Import from `shared/` or `lib/`         | Breaks modularity             |
| `staleTime: 0` on mobile       | `staleTime: 5 * 60 * 1000`                | Battery drain                 |

---

## 📦 Module Completion Checklist

Before marking a module as complete:

- [ ] All types defined in `types.ts`
- [ ] API layer implemented in `api.ts`
- [ ] Query hooks created in `hooks.ts`
- [ ] Public API exported from `index.ts`
- [ ] Mock data created in `assets/data/`
- [ ] Documentation updated
- [ ] No cross-module imports
- [ ] Query keys are structured
- [ ] Selectors used in Zustand
- [ ] Deployment commands tested

---

## 🔧 Development Commands

### Daily Development

```bash
pnpm start              # Start Expo dev server
pnpm android            # Run on Android
pnpm ios                # Run on iOS
pnpm lint               # Run linter
```

### Module Completion

```bash
# 1. Check for issues
npx expo-doctor

# 2. Clean install
rm -rf node_modules android .expo
pnpm install

# 3. Prebuild
npx expo prebuild --clean

# 4. Build preview
pnpm dlx eas-cli build -p android --profile preview --clear-cache
```

---

## 📚 Module Priority Order

1. ✅ **Auth** (Already implemented - needs review)
2. 🔄 **Property** (Next - core feature)
3. 🔄 **Search** (Depends on Property)
4. 🔄 **Booking** (Business-critical)
5. 🔄 **Chat** (AI agent integration)
6. 🔄 **Move** (Transportation feature)

---

## 🎯 Next Steps

1. **Review Auth Module** - Ensure it meets all standards
2. **Create Property Module Spec** - Requirements → Design → Tasks
3. **Implement Property Module** - Following this guide
4. **Document & Test** - Before moving to next module
5. **Repeat** - For each remaining module

---

## 📝 Notes

- **Package Manager**: pnpm (not npm or yarn)
- **TypeScript**: Strict mode, no JavaScript files
- **Styling**: Tailwind (NativeWind) + vanilla CSS when needed
- **Mock Data**: Store in `assets/data/` for testing
- **API Base**: `https://www.masqany.speqlink.com/api/v1/`
- **Backend**: Microservices (different frameworks)

---

## 🔗 References

- Enterprise Specs: `docs/Expo enterprise specs.pdf`
- Architecture Guide: `.kiro/steering/architecture.md`
- This Guide: `docs/IMPLEMENTATION_GUIDE.md`
