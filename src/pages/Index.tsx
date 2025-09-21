import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StudentForm, Student } from "@/components/StudentForm";
import { StudentTable } from "@/components/StudentTable";
import { GraduationCap, Plus, Table as TableIcon } from "lucide-react";

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentView, setCurrentView] = useState<"add" | "view">("add");
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();

  // Load students from localStorage on component mount
  useEffect(() => {
    const savedStudents = localStorage.getItem("students");
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);

  // Save students to localStorage whenever students array changes
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const handleAddStudent = (studentData: Omit<Student, "id">) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString()
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const handleEditStudent = (updatedStudent: Student) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
    setEditingStudent(undefined);
    setCurrentView("view");
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
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
        {currentView === "add" ? (
          <StudentForm
            onSubmit={editingStudent ? handleEditStudent : handleAddStudent}
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