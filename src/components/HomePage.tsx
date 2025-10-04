import { useEffect, useState } from 'react';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';
import { supabase, Course } from '../lib/supabase';

interface HomePageProps {
  onCourseClick: (courseId: string) => void;
}

export default function HomePage({ onCourseClick }: HomePageProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-blue-100 text-blue-700';
      case 'advanced':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-lg">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-slate-700" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            E-Learning Platform
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover courses designed to help you grow your skills and advance your career
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => onCourseClick(course.id)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="h-48 overflow-hidden bg-slate-200">
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>{course.level}</span>
                  </div>
                </div>

                <button className="mt-4 w-full bg-slate-800 text-white py-2.5 rounded-lg font-medium transition-all duration-200 hover:bg-slate-700 hover:shadow-md">
                  View Course
                </button>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No courses available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
