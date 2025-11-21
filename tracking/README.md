# Expense Tracker

A complete frontend-only React (Vite) application for tracking expenses. This is a demo application with dummy data and no backend integration.

## Features

- 🔐 **Login Page** - Simple client-side authentication (dummy)
- 📊 **Dashboard** - Summary cards, expense charts, and recent transactions
- 💰 **Expenses Management** - View, filter, and search expenses
- 👤 **Profile Page** - User profile information
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Mobile-first design with adaptive layouts
- ♿ **Accessible** - Keyboard navigation and ARIA labels

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Icon library
- **Recharts** - Chart library for data visualization

## Project Structure

```
tracking/
├── src/
│   ├── components/          # Reusable components
│   │   ├── AppLayout.jsx    # Main app layout with sidebar
│   │   ├── Header.jsx        # Page header component
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   ├── Modal.jsx        # Modal dialog component
│   │   ├── Toast.jsx        # Toast notification component
│   │   └── ProtectedRoute.jsx # Route protection wrapper
│   ├── pages/               # Page components
│   │   ├── Login.jsx        # Login page
│   │   ├── Dashboard.jsx    # Dashboard page
│   │   ├── Expenses.jsx     # Expenses list page
│   │   └── Profile.jsx      # Profile page
│   ├── context/             # React Context
│   │   └── AppContext.jsx   # Global app state management
│   ├── data/                # Static data
│   │   └── expenses.js      # Dummy expenses data
│   ├── utils/               # Utility functions
│   │   └── fixtures.js      # Data generation utilities
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # App entry point
│   ├── index.css            # Global styles (Tailwind)
│   └── App.css              # Custom animations
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── vite.config.js           # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the tracking directory:
   ```bash
   cd tracking
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

### Login

- Use any email and password (minimum 6 characters) to log in
- The login is client-side only - no real authentication is performed
- On successful login, you'll be redirected to the dashboard

### Dashboard

- View summary statistics (total expenses, categories, highest expense)
- See expense trends in the chart
- Review recent transactions

### Expenses

- View all expenses in a table (desktop) or card view (mobile)
- Filter by category, date range, or search by description
- Edit/Delete buttons show a modal indicating the feature is not implemented

### Profile

- View user profile information
- Edit button shows a modal indicating the feature is not implemented

## Dummy Data

The application uses static dummy data stored in `src/data/expenses.js`. The data includes:
- 35+ realistic expense entries
- Multiple categories (Food, Transportation, Shopping, etc.)
- Dates spanning the past 3 months
- Realistic amounts based on category

You can regenerate or manipulate the data using utilities in `src/utils/fixtures.js`.

## Future Integration Points

The codebase includes TODO comments marking where backend integration should be added:

1. **Authentication** - Replace fake login with real JWT-based auth
2. **API Calls** - Replace dummy data with API endpoints
3. **CRUD Operations** - Implement real create, update, delete for expenses
4. **User Management** - Add real user profile updates
5. **Data Persistence** - Connect to a database

Look for `TODO:` comments throughout the codebase for specific integration points.

## Customization

### Adding New Categories

Edit `src/data/expenses.js` and add new categories to the `categories` array and corresponding descriptions.

### Modifying Theme

Tailwind CSS is configured with dark mode support. Modify `tailwind.config.js` to customize colors and theme settings.

### Adding New Routes

1. Create a new page component in `src/pages/`
2. Add the route to `src/App.jsx`
3. Add a navigation link in `src/components/Sidebar.jsx`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This is a demo project for educational purposes.

## Notes

- All data is stored in localStorage for persistence during the session
- No backend is required - this is a frontend-only application
- All "actions" (edit, delete, etc.) show modals indicating they're not implemented
- The application is fully functional for viewing and filtering expenses
