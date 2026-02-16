"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { type StudentFormData } from "@/lib/validations/batch";

// Re-export for consumers
export type { StudentFormData } from "@/lib/validations/batch";

interface StudentFormProps {
  initialData?: StudentFormData;
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
}

export default function StudentForm({ initialData, onSubmit, onCancel }: StudentFormProps) {
  const [formData, setFormData] = useState<StudentFormData>(
    initialData || {
      studentName: "",
      enrollmentId: "",
      email: "",
      phoneNumber: "",
      gender: "",
    }
  );

  const handleChange = (field: keyof StudentFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
        {/* Student Name */}
        <div className="col-span-full sm:col-span-1">
          <Field className="gap-2">
            <FieldLabel htmlFor="studentName">
              Student Name <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              id="studentName"
              placeholder="e.g., John Doe"
              value={formData.studentName}
              onChange={(e) => handleChange("studentName", e.target.value)}
              required
            />
          </Field>
        </div>

        {/* Enrollment ID */}
        <div className="col-span-full sm:col-span-1">
          <Field className="gap-2">
            <FieldLabel htmlFor="enrollmentId">
              Enrollment ID
            </FieldLabel>
            <Input
              id="enrollmentId"
              placeholder="e.g., EN2025001"
              value={formData.enrollmentId}
              onChange={(e) => handleChange("enrollmentId", e.target.value)}
            />
          </Field>
        </div>

        {/* Email */}
        <div className="col-span-full sm:col-span-1">
          <Field className="gap-2">
            <FieldLabel htmlFor="email">
              Email <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="student@example.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </Field>
        </div>

        {/* Phone Number */}
        <div className="col-span-full sm:col-span-1">
          <Field className="gap-2">
            <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+91 XXXXX-XXXXX"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
            />
          </Field>
        </div>




        {/* Gender */}
        <div className="col-span-full sm:col-span-1">
          <Field className="gap-2">
            <FieldLabel htmlFor="gender">Gender</FieldLabel>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleChange("gender", value)}
            >
              <SelectTrigger id="gender" className="bg-white">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>


      </div>

      <Separator className="my-6" />

      <div className="flex items-center justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[#ff9e44] hover:bg-[#ff8c2e] text-white"
        >
          Save Student
        </Button>
      </div>
    </form>
  );
}
