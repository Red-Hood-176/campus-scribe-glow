import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  roll_no: string;
  email: string;
  department: string;
  created_at: string;
}

interface StudentFormProps {
  onSubmit: () => void;
  editingStudent?: Student;
  onCancel?: () => void;
}

const departments = [
  "Electronics and Communication",
  "Computers",
  "Mechanical and Automation"
];

export const StudentForm = ({ onSubmit, editingStudent, onCancel }: StudentFormProps) => {
  const [formData, setFormData] = useState({
    firstName: editingStudent?.first_name || "",
    lastName: editingStudent?.last_name || "",
    rollNumber: editingStudent?.roll_no || "",
    email: editingStudent?.email || "",
    department: editingStudent?.department || ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = "Roll number is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      if (editingStudent) {
        const { error } = await supabase
          .from('Students')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            roll_no: formData.rollNumber,
            email: formData.email,
            department: formData.department
          })
          .eq('id', editingStudent.id);

        if (error) throw error;
        toast.success("Student information updated successfully!");
      } else {
        const { error } = await supabase
          .from('Students')
          .insert({
            first_name: formData.firstName,
            last_name: formData.lastName,
            roll_no: formData.rollNumber,
            email: formData.email,
            department: formData.department
          });

        if (error) throw error;
        toast.success("Student added successfully!");
      }

      onSubmit();

      // Reset form if not editing
      if (!editingStudent) {
        setFormData({
          firstName: "",
          lastName: "",
          rollNumber: "",
          email: "",
          department: ""
        });
      }
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error("Failed to save student information");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-card shadow-elegant animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {editingStudent ? "Edit Student Information" : "Add New Student"}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {editingStudent 
            ? "Update the student's information below" 
            : "Enter the student's details to add them to the system"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={errors.firstName ? "border-destructive" : ""}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={errors.lastName ? "border-destructive" : ""}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number *</Label>
              <Input
                id="rollNumber"
                type="text"
                value={formData.rollNumber}
                onChange={(e) => handleInputChange("rollNumber", e.target.value)}
                className={errors.rollNumber ? "border-destructive" : ""}
                placeholder="Enter roll number"
              />
              {errors.rollNumber && (
                <p className="text-sm text-destructive">{errors.rollNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-destructive" : ""}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => handleInputChange("department", value)}
            >
              <SelectTrigger className={errors.department ? "border-destructive" : ""}>
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && (
              <p className="text-sm text-destructive">{errors.department}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-primary hover:opacity-90 transition-smooth">
              {editingStudent ? "Update Student" : "Add Student"}
            </Button>
            {editingStudent && onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};