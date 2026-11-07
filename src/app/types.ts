export type AppScreen = "home" | "portal" | "login" | "app" | "apply";
export type Role = "admin" | "hr_records" | "timekeeping" | "leave_management" | "payroll" | "recruitment" | "training" | "performance" | "rewards" | "wellness" | "management" | "employee" | "faculty_management";

export interface UserAccount {
  id: string;
  username: string;
  password: string;
  role: Role;
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
  position: string;
  lastLogin: string;
  isActive: boolean;
}
export type Page = "dashboard" | "employees" | "hr-records" | "employee-detail" | "payroll" | "payslip" | "leave" | "attendance" | "reports" | "notifications" | "settings" | "audit" | "profile" | "recruitment" | "training" | "performance" | "rewards" | "wellness" | "faculty";

export interface Employee {
  id: string; employeeNo: string; fullName: string;
  lastName: string; firstName: string; middleName: string;
  position: string; rank: string; department: string;
  employmentType: "Permanent" | "Temporary" | "Casual" | "Contractual" | "Job Order" | "COS" | "Part-time";
  salaryGrade: number; step: number; monthlySalary: number;
  status: "Active" | "Inactive" | "On Leave" | "Suspended" | "Retired";
  gender: "Male" | "Female"; birthDate: string; email: string;
  address?: string; education?: string; eligibility?: string; workExperience?: string;
  personnelCategory?: "Teaching Personnel (Faculty)" | "Non-Teaching Personnel (Administrative and Support Staff)";
  trainingRecords?: string[];
  onboardingStatus?: "Not Started" | "In Progress" | "Completed";
  phone: string; dateHired: string; tin: string; gsis: string;
  philhealth: string; pagibig: string; vacationLeave: number;
  sickLeave: number; color: string;
}

export interface DtrRecord {
  employeeId: string; date: string;
  timeIn: string | null; timeOut: string | null;
  status: "Present" | "Absent" | "Late" | "On Leave" | "Holiday";
  overtime: number;
}

export interface LeaveRequest {
  id: string; employeeId: string; employeeName: string; department: string;
  leaveType: string; startDate: string; endDate: string; days: number;
  reason: string; status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  appliedDate: string; approvedBy?: string; remarks?: string;
}

export interface PayrollRun {
  id: string; period: string; cutOff: string; payDate: string;
  employees: number; grossPay: number; totalDeductions: number;
  netPay: number; status: "Draft" | "For Approval" | "Approved" | "Released";
  createdBy: string;
}

export interface NotifItem {
  id: string; type: "info" | "success" | "warning" | "error";
  title: string; message: string; time: string; read: boolean;
}

export interface PhotoAttendanceRecord {
  id: string; employeeId: string; employeeName: string; employeeNo: string;
  date: string; time: string; type: "TimeIn" | "TimeOut"; photo: string | null;
  lat: number | null; lng: number | null; accuracy: number | null; address: string;
  distanceFromAuth: number; withinGeofence: boolean;
  status: "Present" | "Late" | "Outside Location";
}

export interface AIMessage { id: string; role: "user" | "bot"; text: string; time: string; page?: Page; pageLabel?: string; }

export interface JobVacancy {
  id: string; position: string; department: string; salaryGrade: number;
  employmentType: string; slots: number; deadline: string; status: "Open" | "Closed" | "For Approval";
  applicants: number; qualifications: string;
  classification?: "Plantilla" | "Job Order";
  publicationStatus?: "Draft" | "Published" | "Not Published";
  publicationDate?: string;
  requiredDocuments?: string[];
}
export interface Applicant {
  id: string; vacancyId: string; name: string; email: string;
  appliedDate: string; status: "Pending" | "Shortlisted" | "Examination" | "Interview" | "Passed" | "Failed" | "Hired";
  score: number | null; type: "Internal" | "External";
  trackingNo?: string; phone?: string;
  firstName?: string; middleName?: string; lastName?: string;
  birthDate?: string; gender?: "Male" | "Female"; address?: string;
  education?: string; eligibility?: string; experience?: string;
  examScore?: number | null; examResult?: "Pending" | "Passed" | "Failed";
  psbRating?: number; competencyScores?: { name: string; score: number }[];
  appointmentStatus?: "Not Started" | "Appointment Prepared" | "Transmitted" | "Issued";
  appointmentReference?: string;
  externalTrackingNo?: string;
  externalStatusHistory?: { status: string; at: string; message: string }[];
  externalDocuments?: { requirement: string; fileName: string; size: number; type: string }[];
  externalSchedule?: { type: "Examination" | "Interview"; dateTime: string; location: string; instructions: string; updatedAt?: string }[];
  externalProfileSnapshot?: Record<string, string>;
}
export interface TrainingProgram {
  id: string; title: string; organizer: string; venue: string;
  startDate: string; endDate: string; type: "Mandatory" | "Optional" | "Scholarship";
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
  slots: number; nominated: number; category: string;
  sponsoringAgency?: string; scholarshipGrant?: string; grantAmount?: number;
  mandatoryOnboarding?: boolean;
}
export interface TrainingNomination {
  id: string; programId: string; employeeId: string; employeeName: string;
  department: string; status: "Pending" | "Approved" | "Completed" | "Declined";
  nominatedDate: string;
  justification?: string;
  assessmentScore?: number; assessmentNotes?: string; invitationStatus?: "Not Sent" | "Sent" | "Accepted" | "Declined";
  pdsSynced?: boolean; completedDate?: string;
}
export interface OnboardingRecord {
  id: string; employeeId: string; employeeName: string; position: string; department: string;
  startDate: string; orientationDate: string; orientationStatus: "Scheduled" | "Completed" | "Rescheduled";
  mandatoryProgramIds: string[]; completedProgramIds: string[];
  status: "In Progress" | "Completed";
}
export interface PositionCompetency {
  id: string; position: string; competency: string; requiredLevel: number;
}
export interface EmployeeCompetency {
  employeeId: string; competency: string; currentLevel: number; assessedDate: string;
}
export interface PerformanceRating {
  id: string; employeeId: string; employeeName: string; department: string;
  period: string; type: "IPCR" | "OPCR";
  outputScore: number; efficiencyScore: number; timelinessScore: number;
  finalRating: number; adjectivalRating: string;
  status: "Draft" | "Submitted" | "Reviewed" | "Approved";
  submittedDate: string;
}
export interface PerformanceBonusForm {
  id: string; ratingId: string; employeeId: string; employeeName: string;
  period: string; finalRating: number; proposedAmount: number;
  status: "Draft" | "For Review" | "Approved" | "Not Eligible";
  notes: string; generatedDate: string;
}
export interface IndividualDevelopmentPlan {
  id: string; employeeId: string; employeeName: string; period: string;
  developmentGoals: string; competencyGaps: string; plannedActivities: string;
  targetDate: string; status: "Draft" | "In Progress" | "Completed";
}
export interface CoachingRecord {
  id: string; employeeId: string; employeeName: string; coach: string;
  coachingDate: string; discussion: string; actionItems: string;
  followUpDate: string; status: "Scheduled" | "Completed" | "Follow-up";
}
export type RewardAwardType =
  | "PRAISE Nomination"
  | "Productivity Enhancement Incentive"
  | "Special Awards"
  | "Performance Based Bonus"
  | "Loyalty Incentive Pay"
  | "Perfect Attendance Incentive"
  | "Research Awards"
  | "Extension Awards"
  | "Outstanding Teacher Award"
  | "Outstanding Employee Award"
  | "Gawad Agad Award (On-the- Spot recognition)";
export interface RewardNomination {
  id: string; awardType: RewardAwardType; nomineeId: string; nomineeName: string;
  department: string; nominatedBy: string; reason: string;
  status: "Pending" | "Endorsed" | "Approved" | "Rejected";
  period: string; dateNominated: string;
}
export interface WellnessRecord {
  id: string; employeeId: string; employeeName: string;
  type: "Medical" | "Dental" | "Mental Health" | "Wellness Program";
  description: string; date: string; provider: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}
export interface HealthRiskAssessment {
  id: string; employeeId: string; employeeName: string; assessmentDate: string;
  riskLevel: "Low" | "Moderate" | "High"; riskFactors: string;
  recommendations: string; followUpDate: string;
}
export interface WellnessProgram {
  id: string; name: string; category: string; description: string;
  targetAudience: string; startDate: string; endDate: string;
  status: "Planned" | "Active" | "Completed" | "Cancelled";
}
export interface CounselingRecord {
  id: string; employeeId: string; employeeName: string; sessionDate: string;
  counselor: string; referralSource: string; notes: string; followUpDate: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}
export interface PdsRevision {
  id: string; employeeId: string; employeeName: string; submittedBy: string;
  submittedAt: string; status: "Pending HRMO Approval" | "Approved" | "Rejected";
  data: Record<string,string>; reviewer?: string; reviewedAt?: string; remarks?: string;
}
export interface PersonnelDocument {
  id: string; employeeId: string; employeeName: string; documentType: string;
  category: "Government ID" | "201 File" | "SALN" | "BIR" | "Employment" | "Self-Assessment";
  reference: string; issueDate: string; expiryDate: string; status: "Current" | "For Review" | "Expired";
}
export interface EmploymentHistoryRecord {
  id: string; employeeId: string; employeeName: string;
  personnelCategory: "Teaching Personnel (Faculty)" | "Non-Teaching Personnel (Administrative and Support Staff)";
  employmentType: Employee["employmentType"]; appointment: string; employmentStatus: Employee["status"];
  position: string; plantillaItem: string; designation: string; salaryGrade: number;
  step: number; effectiveFrom: string; effectiveTo: string; remarks: string;
}
export interface EmployeeServiceRequest {
  id: string; employeeId: string; employeeName: string; requestType: string;
  details: string; typedSignature: string; submittedAt: string;
  status: "Pending" | "Approved" | "Rejected" | "Completed";
  reviewer?: string; reviewedAt?: string; remarks?: string;
}
export interface HROfficeCommunication {
  id: string; category: "Announcement" | "Memorandum" | "Circular" | "Order";
  title: string; body: string; publishedAt: string; status: "Draft" | "Published";
}
export interface FacultyProfile {
  employeeId: string; specialization: string; highestDegree: string;
  university: string; teachingLoad: number; researchCount: number;
  extensionCount: number; publications: number; awards: number;
  licenseNo: string; licenseExpiry: string;
  rank: "Instructor" | "Assistant Professor" | "Associate Professor" | "Professor" | "University Professor";
  evaluation: number;
}
