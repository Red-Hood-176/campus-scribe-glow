import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StudentForm, Student } from "@/components/StudentForm";
import { StudentTable } from "@/components/StudentTable";
import { GraduationCap, Plus, Table as TableIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentView, setCurrentView] = useState<"add" | "view">("add");
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();
  const [loading, setLoading] = useState(true);

  // Load students from Supabase on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('Students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = () => {
    fetchStudents();
    setEditingStudent(undefined);
    setCurrentView("view");
  };

  const handleDeleteStudent = async (id: number) => {
    try {
      const { error } = await supabase
        .from('Students')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Student deleted successfully!");
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error("Failed to delete student");
    }
  };

  const handleStartEdit = (student: Student) => {
    setEditingStudent(student);
    setCurrentView("add");
  };

  const handleCancelEdit = () => {
    setEditingStudent(undefined);
    setCurrentView("view");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Student Management System</h1>
                <p className="text-muted-foreground">Manage student information efficiently</p>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <Button
                variant={currentView === "add" ? "default" : "outline"}
                onClick={() => {
                  setCurrentView("add");
                  if (editingStudent) setEditingStudent(undefined);
                }}
                className={currentView === "add" ? "bg-gradient-primary" : ""}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
              <Button
                variant={currentView === "view" ? "default" : "outline"}
                onClick={() => {
                  setCurrentView("view");
                  if (editingStudent) setEditingStudent(undefined);
                }}
                className={currentView === "view" ? "bg-gradient-primary" : ""}
              >
                <TableIcon className="h-4 w-4 mr-2" />
                View Students ({students.length})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading students...</p>
          </div>
        ) : currentView === "add" ? (
          <StudentForm
            onSubmit={handleFormSubmit}
            editingStudent={editingStudent}
            onCancel={editingStudent ? handleCancelEdit : undefined}
          />
        ) : (
          <StudentTable
            students={students}
            onEdit={handleStartEdit}
            onDelete={handleDeleteStudent}
          />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              Student Management System - Built for academic excellence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;