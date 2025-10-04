import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, Circle, Clock, TrendingUp } from 'lucide-react';
import { supabase, Course, Lesson, UserProgress } from '../lib/supabase';

interface CourseDetailProps {
  courseId: string;
  onBack: () => void;
}

export default function CourseDetail({ courseId, onBack }: CourseDetailProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(() => {
    let id = localStorage.getItem('user_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('user_id', id);
    }
    return id;
  });

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  async function fetchCourseData() {
    try {
      setLoading(true);

      const [courseResult, lessonsResult, progressResult] = await Promise.all([
        supabase.from('courses').select('*').eq('id', courseId).maybeSingle(),
        supabase.from('lessons').select('*').eq('course_id', courseId).order('order', { ascending: true }),
        supabase.from('user_progress').select('*').eq('course_id', courseId).eq('user_id', userId).maybeSingle()
      ]);

      if (courseResult.error) throw courseResult.error;
      if (lessonsResult.error) throw lessonsResult.error;

      setCourse(courseResult.data);
      setLessons(lessonsResult.data || []);
      setProgress(progressResult.data);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleCompletion() {
    try {
      if (progress?.completed) {
        const { error } = await supabase
          .from('user_progress')
          .update({ completed: false, completed_at: null })
          .eq('id', progress.id);

        if (error) throw error;
        setProgress({ ...progress, completed: false, completed_at: null });
      } else {
        if (progress) {
          const { error } = await supabase
            .from('user_progress')
            .update({ completed: true, completed_at: new Date().toISOString() })
            .eq('id', progress.id);

          if (error) throw error;
          setProgress({ ...progress, completed: true, completed_at: new Date().toISOString() });
        } else {
          const newProgress = {
            user_id: userId,
            course_id: courseId,
            completed: true,
            completed_at: new Date().toISOString()
          };

          const { data, error } = await supabase
            .from('user_progress')
            .insert(newProgress)
            .select()
            .single();

          if (error) throw error;
          setProgress(data);
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
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
        <div className="text-slate-600 text-lg">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 text-lg mb-4">Course not found</p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Back to Courses</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-80 overflow-hidden bg-slate-200">
            <img
              src={course.image_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                  {progress?.completed && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-3">
                  {course.title}
                </h1>

                <p className="text-slate-600 text-lg mb-6">
                  {course.description}
                </p>

                <div className="flex items-center gap-6 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-medium">{course.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span className="font-medium">{lessons.length} Lessons</span>
                  </div>
                </div>
              </div>

              <button
                onClick={toggleCompletion}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-md ${
                  progress?.completed
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {progress?.completed ? 'Mark as Incomplete' : 'Mark as Completed'}
              </button>
            </div>

            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Course Lessons
              </h2>

              {lessons.length === 0 ? (
                <div className="text-center py-12">
                  <Circle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No lessons available yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="bg-slate-50 rounded-lg p-5 transition-all duration-200 hover:bg-slate-100 hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            {lesson.title}
                          </h3>
                          <p className="text-slate-600">
                            {lesson.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
