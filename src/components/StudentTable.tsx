import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Search, Trash2, Users } from "lucide-react";
import { Student } from "./StudentForm";
import { toast } from "sonner";

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
}

export const StudentTable = ({ students, onEdit, onDelete }: StudentTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roll_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number, studentName: string) => {
    if (confirm(`Are you sure you want to delete ${studentName}'s record?`)) {
      onDelete(id);
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Electronics and Communication":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Computers":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Mechanical and Automation":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="w-full bg-gradient-card shadow-elegant animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Student Records
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage and view all registered students ({students.length} total)
            </CardDescription>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students by name, roll number, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent>
        {students.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No students registered yet</h3>
            <p className="text-muted-foreground">Add your first student to get started!</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No students found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Roll Number</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="text-center font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">
                      {student.first_name} {student.last_name}
                    </TableCell>
                    <TableCell className="font-mono">
                      {student.roll_no}
                    </TableCell>
                    <TableCell>
                      {student.email}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getDepartmentColor(student.department)}
                      >
                        {student.department}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(student)}
                          className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(student.id, `${student.first_name} ${student.last_name}`)}
                          className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};