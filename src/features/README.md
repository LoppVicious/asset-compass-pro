# Features

This directory contains feature-based modules. Each feature should be self-contained and include:

- Components specific to the feature
- Hooks related to the feature
- Types and interfaces for the feature
- API calls specific to the feature

## Structure

```
features/
├── authentication/
│   ├── components/
│   ├── hooks/
│   └── types.ts
├── portfolio/
│   ├── components/
│   ├── hooks/
│   └── types.ts
└── dashboard/
    ├── components/
    ├── hooks/
    └── types.ts
```

This organization promotes:
- Better code organization
- Easier maintenance
- Clear separation of concerns
- Reusability