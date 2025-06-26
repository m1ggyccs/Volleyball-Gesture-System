# VolleyVision Component Structure

## Overview

The VolleyVision application has been refactored from a single large file into a modular component-based architecture for better maintainability and organization.

## Directory Structure

```
app/
├── components/
│   ├── index.js              # Component exports
│   ├── AppContext.jsx        # Global state management
│   ├── Navbar.jsx           # Navigation component
│   ├── HomePage.jsx         # Landing page
│   ├── WatchPage.jsx        # Live streaming page
│   ├── AdminPage.jsx        # Admin dashboard
│   └── LoginPage.jsx        # Authentication page
├── page.jsx                 # Main app entry point
├── layout.tsx              # Next.js layout
├── globals.css             # Global styles
└── favicon.ico             # App icon
```

## Components

### AppContext.jsx

- **Purpose**: Global state management using React Context
- **Exports**: `AppProvider`, `useApp`
- **State**: Current page, user authentication, gesture detection, matches data

### Navbar.jsx

- **Purpose**: Main navigation bar
- **Features**: Logo, navigation links, authentication buttons
- **Dependencies**: `useApp`, `lucide-react` icons

### HomePage.jsx

- **Purpose**: Landing page with hero section and features
- **Features**: Hero banner, feature cards, call-to-action
- **Dependencies**: `useApp`, `lucide-react` icons

### WatchPage.jsx

- **Purpose**: Live streaming interface
- **Features**: Video player, gesture detection panel, match statistics
- **Dependencies**: `useApp`, `lucide-react` icons

### AdminPage.jsx

- **Purpose**: Administrative dashboard
- **Features**: Match upload, gesture configuration, user management
- **Dependencies**: `useApp`, `lucide-react` icons
- **Access Control**: Admin role required

### LoginPage.jsx

- **Purpose**: User authentication
- **Features**: Login/signup forms, demo accounts
- **Dependencies**: `useApp`

## Usage

### Importing Components

```javascript
import { AppProvider, useApp, Navbar, HomePage } from "./components";
```

### Using Context

```javascript
const { currentPage, setCurrentPage, user } = useApp();
```

### Adding New Components

1. Create the component file in `app/components/`
2. Export it from `app/components/index.js`
3. Import and use in `app/page.jsx`

## Benefits of This Structure

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused across the app
3. **Maintainability**: Easier to find and fix issues
4. **Scalability**: New features can be added without affecting existing code
5. **Testing**: Individual components can be tested in isolation
6. **Collaboration**: Multiple developers can work on different components simultaneously

## State Management

The app uses React Context for global state management:

- **currentPage**: Controls which page is currently displayed
- **user**: Stores user authentication information
- **gestureDetection**: Tracks gesture detection status
- **currentGesture**: Stores the currently detected gesture
- **matches**: Contains match data

## Styling

All components use Tailwind CSS for styling with a consistent dark theme:

- Primary color: Emerald (`emerald-400`, `emerald-500`, `emerald-600`)
- Background: Black (`bg-black`)
- Text: White and gray variations
- Cards: Dark gray (`bg-gray-900`)
