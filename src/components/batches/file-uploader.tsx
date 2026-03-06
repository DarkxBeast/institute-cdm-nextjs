"use client";

import { File, FileSpreadsheet, X, CheckCircle2, AlertCircle } from "lucide-react";
import { ChangeEvent, DragEvent, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type StudentFormData } from "@/lib/validations/batch";
import { useNotification } from "@/components/providers/notification-provider";

// Re-export for backward compatibility
export type ParsedStudent = StudentFormData;

interface ParseResult {
  valid: ParsedStudent[];
  errors: { row: number; message: string }[];
}

interface FileUploaderProps {
  onClose?: () => void;
  onImport?: (students: ParsedStudent[]) => void;
}

export default function FileUploader({ onClose, onImport }: FileUploaderProps) {
  const { showNotification } = useNotification();
  const [uploadState, setUploadState] = useState<{
    file: File | null;
    progress: number;
    uploading: boolean;
  }>({
    file: null,
    progress: 0,
    uploading: false,
  });
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validFileTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  // Required fields for validation
  const requiredFields = ["studentName", "email"];

  // Parse CSV content into student records
  const parseCSV = (content: string): ParseResult => {
    const lines = content.trim().split(/\r?\n/);
    if (lines.length < 2) {
      return { valid: [], errors: [{ row: 0, message: "File is empty or has no data rows" }] };
    }

    const headers = lines[0].split(",").map((h) => h.trim());
    const valid: ParsedStudent[] = [];
    const errors: { row: number; message: string }[] = [];

    // Map header names to StudentFormData keys
    const headerMap: Record<string, keyof ParsedStudent> = {
      studentname: "studentName",
      name: "studentName",
      enrollmentid: "enrollmentId",
      id: "enrollmentId",
      email: "email",
      phonenumber: "phoneNumber",
      phone: "phoneNumber",
      gender: "gender",
      sex: "gender",
    };

    const columnIndices: Partial<Record<keyof ParsedStudent, number>> = {};
    headers.forEach((header, index) => {
      const normalizedHeader = header.toLowerCase().replace(/[^a-z]/g, "");
      const mappedKey = headerMap[normalizedHeader];
      if (mappedKey) {
        columnIndices[mappedKey] = index;
      }
    });

    // Check for required columns
    const missingRequired = requiredFields.filter(
      (field) => columnIndices[field as keyof ParsedStudent] === undefined
    );
    if (missingRequired.length > 0) {
      return {
        valid: [],
        errors: [{ row: 0, message: `Missing required columns: ${missingRequired.join(", ")}` }],
      };
    }

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(",").map((v) => v.trim());

      // Validate gender is one of allowed values
      const genderValue = columnIndices.gender !== undefined ? values[columnIndices.gender] || "" : "";
      const validGenders = ["", "male", "female", "other"] as const;
      const gender = validGenders.includes(genderValue.toLowerCase() as typeof validGenders[number])
        ? genderValue.toLowerCase() as typeof validGenders[number]
        : "";

      const student: ParsedStudent = {
        studentName: values[columnIndices.studentName!] || "",
        enrollmentId: values[columnIndices.enrollmentId!] || "",
        email: values[columnIndices.email!] || "",
        phoneNumber: columnIndices.phoneNumber !== undefined ? values[columnIndices.phoneNumber] || "" : "",
        gender,
        aboutMe: "",
        skills: [],
        sectorsOfInterest: [],
        domainsOfInterest: [],
      };

      // Validate required fields
      const rowErrors: string[] = [];
      if (!student.studentName) rowErrors.push("studentName");
      // if (!student.enrollmentId) rowErrors.push("enrollmentId");
      if (!student.email) rowErrors.push("email");

      if (rowErrors.length > 0) {
        errors.push({ row: i + 1, message: `Missing: ${rowErrors.join(", ")}` });
      } else {
        valid.push(student);
      }
    }

    return { valid, errors };
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;

    // Reset parse result
    setParseResult(null);

    // Only support CSV for parsing
    const isCSV = file.type === "text/csv" || file.name.endsWith(".csv");

    if (validFileTypes.includes(file.type) || file.name.endsWith(".csv")) {
      setUploadState({ file, progress: 0, uploading: true });

      if (isCSV) {
        // Read and parse CSV
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const result = parseCSV(content);
          setParseResult(result);
          setUploadState((prev) => ({ ...prev, progress: 100, uploading: false }));
        };
        reader.onerror = () => {
          showNotification("error", "Failed to read file", "File Error");
          setUploadState((prev) => ({ ...prev, progress: 0, uploading: false }));
        };
        reader.readAsText(file);
      } else {
        // For non-CSV files, show progress animation (XLSX support not implemented)
        showNotification("warning", "Only CSV files are supported for import", "Unsupported Format");
        setUploadState({ file: null, progress: 0, uploading: false });
      }
    } else {
      showNotification("error", "Please upload a CSV file.", "Invalid File");
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  };

  const resetFile = () => {
    setUploadState({ file: null, progress: 0, uploading: false });
    setParseResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImport = () => {
    if (parseResult && parseResult.valid.length > 0 && onImport) {
      onImport(parseResult.valid);
      // Note: Success notification is handled by StudentsManager after duplicate filtering
      resetFile();
      if (onClose) onClose();
    }
  };

  const getFileIcon = () => {
    if (!uploadState.file) return <File />;

    const fileExt = uploadState.file.name.split(".").pop()?.toLowerCase() || "";
    return ["csv", "xlsx", "xls"].includes(fileExt) ? (
      <FileSpreadsheet className="h-5 w-5 text-foreground" />
    ) : (
      <File className="h-5 w-5 text-foreground" />
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const { file, progress, uploading } = uploadState;

  return (
    <div className="flex items-center justify-center p-8 w-full">
      <form className="w-full" onSubmit={(e) => e.preventDefault()}>
        <h3 className="text-balance text-lg font-semibold text-foreground">File Upload</h3>

        <div
          className="flex justify-center rounded-xl border-2 mt-4 border-dashed border-gray-300 hover:border-[#ff9e44] hover:bg-orange-50/10 transition-all duration-300 ease-in-out px-6 py-12 cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div>
            <File
              className="mx-auto h-12 w-12 text-muted-foreground"
              aria-hidden={true}
            />
            <div className="flex text-sm leading-6 text-muted-foreground">
              <p>Drag and drop or</p>
              <label
                htmlFor="file-upload-03"
                className="relative cursor-pointer rounded-sm pl-1 font-medium text-primary hover:underline hover:underline-offset-4"
              >
                <span>choose file</span>
                <input
                  id="file-upload-03"
                  name="file-upload-03"
                  type="file"
                  className="sr-only"
                  accept=".csv, .xlsx, .xls"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>
              <p className="text-pretty pl-1">to upload</p>
            </div>
          </div>
        </div>

        <p className="text-pretty mt-2 text-xs leading-5 text-muted-foreground sm:flex sm:items-center sm:justify-between">
          <span>Accepted file types: CSV files only.</span>
          <span className="pl-1 sm:pl-0">Max. size: 10MB</span>
        </p>

        {file && (
          <Card className="relative mt-8 bg-muted p-4 gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute right-1 top-1 text-muted-foreground hover:text-foreground"
              aria-label="Remove"
              onClick={resetFile}
            >
              <X className="h-5 w-5 shrink-0" aria-hidden={true} />
            </Button>

            <div className="flex items-center space-x-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-background shadow-sm ring-1 ring-inset ring-border">
                {getFileIcon()}
              </span>
              <div>
                <p className="text-pretty text-xs font-medium text-foreground">
                  {file?.name}
                </p>
                <p className="text-pretty mt-0.5 text-xs text-muted-foreground">
                  {file && formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Progress value={progress} className="h-1.5" />
              <span className="text-xs text-muted-foreground">{progress}%</span>
            </div>

            {/* Import Preview */}
            {parseResult && progress === 100 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-foreground mb-2">Import Preview</p>
                <div className="flex items-center gap-4">
                  {parseResult.valid.length > 0 && (
                    <div className="flex items-center gap-1.5 text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{parseResult.valid.length} valid students</span>
                    </div>
                  )}
                  {parseResult.errors.length > 0 && (
                    <div className="flex items-center gap-1.5 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>{parseResult.errors.length} errors</span>
                    </div>
                  )}
                </div>
                {parseResult.errors.length > 0 && (
                  <div className="mt-2 max-h-24 overflow-y-auto text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                    {parseResult.errors.slice(0, 5).map((err, idx) => (
                      <div key={idx}>Row {err.row}: {err.message}</div>
                    ))}
                    {parseResult.errors.length > 5 && (
                      <div className="text-gray-400">...and {parseResult.errors.length - 5} more errors</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        <div className="mt-8 flex items-center justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            className="whitespace-nowrap"
            onClick={() => {
              resetFile();
              if (onClose) onClose();
            }}
            disabled={!file && !onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="whitespace-nowrap bg-[#ff9e44] hover:bg-[#ff8c2e] text-white"
            disabled={!file || uploading || progress < 100 || !parseResult || parseResult.valid.length === 0}
            onClick={handleImport}
          >
            Import {parseResult?.valid.length || 0} Students
          </Button>
        </div>
      </form>
    </div>
  );
}
