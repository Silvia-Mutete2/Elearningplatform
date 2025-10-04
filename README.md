# E-Learning Platform

A modern, interactive e-learning platform built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Course Catalog**: Browse through a collection of courses with beautiful card layouts
- **Course Details**: View detailed information about each course including lessons, duration, and difficulty level
- **Progress Tracking**: Mark courses as completed and track your learning progress
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Smooth Animations**: Engaging hover effects and transitions throughout the interface
- **Database Integration**: All course data and user progress stored in Supabase

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite

## Sample Courses

The platform comes pre-loaded with sample courses:

1. **Introduction to Web Development** - Learn HTML, CSS, and JavaScript basics
2. **React for Beginners** - Master React.js and modern UI development
3. **Advanced JavaScript** - Deep dive into closures, promises, and async patterns
4. **Database Design Fundamentals** - Understand relational databases and SQL

## Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── HomePage.tsx        # Main course listing page
│   └── CourseDetail.tsx    # Individual course detail page
├── lib/
│   └── supabase.ts        # Supabase client and types
├── App.tsx                # Main app component with routing
└── main.tsx              # App entry point
```

## Database Schema

### Tables

- **courses**: Stores course information (title, description, image, duration, level)
- **lessons**: Contains lesson content linked to courses
- **user_progress**: Tracks user completion status for courses

## Features in Detail

### Home Page
- Grid layout of course cards
- Hover effects with card elevation and image zoom
- Color-coded difficulty badges
- Quick course information (duration, level)

### Course Detail Page
- Full course information with hero image
- Lesson list with numbered indicators
- Mark as complete/incomplete functionality
- Smooth navigation back to home page

### Progress Tracking
- User-specific progress stored in database
- Visual completion badges
- Persistent across sessions using localStorage for user ID

## License

MIT
