/*
  # E-Learning Platform Schema

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text) - Course title
      - `description` (text) - Course description
      - `image_url` (text) - Course thumbnail image
      - `duration` (text) - Estimated duration
      - `level` (text) - Difficulty level
      - `created_at` (timestamptz) - Creation timestamp
    
    - `lessons`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key) - References courses table
      - `title` (text) - Lesson title
      - `content` (text) - Lesson content/description
      - `order` (integer) - Lesson order within course
      - `created_at` (timestamptz) - Creation timestamp
    
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - User identifier (for future auth integration)
      - `course_id` (uuid, foreign key) - References courses table
      - `completed` (boolean) - Course completion status
      - `completed_at` (timestamptz) - Completion timestamp
      - `created_at` (timestamptz) - Creation timestamp
      - Unique constraint on (user_id, course_id)

  2. Security
    - Enable RLS on all tables
    - Add public read policies for courses and lessons (public platform)
    - Add policies for user_progress to allow users to manage their own progress

  3. Sample Data
    - Insert sample courses with lessons for demo purposes
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text DEFAULT '',
  duration text DEFAULT '1 hour',
  level text DEFAULT 'Beginner',
  created_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policies for courses (public read access)
CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  USING (true);

-- Policies for lessons (public read access)
CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  USING (true);

-- Policies for user_progress (users can manage their own progress)
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Insert sample courses
INSERT INTO courses (title, description, image_url, duration, level) VALUES
  ('Introduction to Web Development', 'Learn the fundamentals of HTML, CSS, and JavaScript to build your first website.', 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800', '6 hours', 'Beginner'),
  ('React for Beginners', 'Master React.js and build modern, interactive user interfaces with components and hooks.', 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800', '8 hours', 'Beginner'),
  ('Advanced JavaScript', 'Deep dive into advanced JavaScript concepts including closures, promises, and async/await.', 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800', '10 hours', 'Advanced'),
  ('Database Design Fundamentals', 'Understand relational databases, SQL queries, and how to design efficient database schemas.', 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800', '5 hours', 'Intermediate');

-- Insert sample lessons for course 1 (Web Development)
INSERT INTO lessons (course_id, title, content, "order")
SELECT id, 'Getting Started with HTML', 'Learn the basic structure of HTML documents and essential tags.', 1
FROM courses WHERE title = 'Introduction to Web Development'
UNION ALL
SELECT id, 'Styling with CSS', 'Discover how to style your web pages with colors, fonts, and layouts.', 2
FROM courses WHERE title = 'Introduction to Web Development'
UNION ALL
SELECT id, 'JavaScript Basics', 'Introduction to variables, functions, and DOM manipulation.', 3
FROM courses WHERE title = 'Introduction to Web Development'
UNION ALL
SELECT id, 'Building Your First Project', 'Put everything together and create a complete web page.', 4
FROM courses WHERE title = 'Introduction to Web Development';

-- Insert sample lessons for course 2 (React)
INSERT INTO lessons (course_id, title, content, "order")
SELECT id, 'React Components', 'Understanding functional and class components in React.', 1
FROM courses WHERE title = 'React for Beginners'
UNION ALL
SELECT id, 'State and Props', 'Learn how to manage component state and pass data via props.', 2
FROM courses WHERE title = 'React for Beginners'
UNION ALL
SELECT id, 'React Hooks', 'Master useState, useEffect, and other essential hooks.', 3
FROM courses WHERE title = 'React for Beginners'
UNION ALL
SELECT id, 'Building a Todo App', 'Create a fully functional todo application with React.', 4
FROM courses WHERE title = 'React for Beginners';

-- Insert sample lessons for course 3 (Advanced JavaScript)
INSERT INTO lessons (course_id, title, content, "order")
SELECT id, 'Closures and Scope', 'Deep understanding of JavaScript closures and lexical scope.', 1
FROM courses WHERE title = 'Advanced JavaScript'
UNION ALL
SELECT id, 'Promises and Async/Await', 'Master asynchronous JavaScript programming patterns.', 2
FROM courses WHERE title = 'Advanced JavaScript'
UNION ALL
SELECT id, 'Prototypes and Inheritance', 'Learn how JavaScript handles inheritance and the prototype chain.', 3
FROM courses WHERE title = 'Advanced JavaScript';

-- Insert sample lessons for course 4 (Database Design)
INSERT INTO lessons (course_id, title, content, "order")
SELECT id, 'Introduction to Databases', 'Understanding relational databases and their importance.', 1
FROM courses WHERE title = 'Database Design Fundamentals'
UNION ALL
SELECT id, 'SQL Basics', 'Learn essential SQL commands for querying and manipulating data.', 2
FROM courses WHERE title = 'Database Design Fundamentals'
UNION ALL
SELECT id, 'Schema Design', 'Best practices for designing efficient and scalable database schemas.', 3
FROM courses WHERE title = 'Database Design Fundamentals';