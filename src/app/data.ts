import type { Employee, DtrRecord, LeaveRequest, PayrollRun, NotifItem, JobVacancy, Applicant, TrainingProgram, TrainingNomination, PositionCompetency, EmployeeCompetency, PerformanceRating, RewardNomination, WellnessRecord, WellnessProgram, FacultyProfile, UserAccount, Role } from "./types";

export const INIT_EMPLOYEES: Employee[] = [
  { id:"EMP001", employeeNo:"PNU-2024-001", fullName:"Dr. Maria Luz G. Santos", lastName:"Santos", firstName:"Maria Luz", middleName:"Garcia", position:"University President", rank:"University Professor", department:"Office of the President", employmentType:"Permanent", salaryGrade:29, step:8, monthlySalary:252789, status:"Active", gender:"Female", birthDate:"1965-03-15", email:"mlsantos@pnu.edu.ph", phone:"09171234001", dateHired:"2015-06-01", tin:"123-456-789-000", gsis:"001-234-567", philhealth:"11-234567890-1", pagibig:"1234-5678-9001", vacationLeave:25, sickLeave:30, color:"#1B3A6B" },
  { id:"EMP002", employeeNo:"PNU-2024-002", fullName:"Dr. Jose Antonio B. Reyes", lastName:"Reyes", firstName:"Jose Antonio", middleName:"Bautista", position:"VP for Academic Affairs", rank:"Professor VI", department:"Office of the VPAA", employmentType:"Permanent", salaryGrade:27, step:6, monthlySalary:184684, status:"Active", gender:"Male", birthDate:"1968-07-22", email:"jabreyes@pnu.edu.ph", phone:"09171234002", dateHired:"2010-08-01", tin:"234-567-890-001", gsis:"002-345-678", philhealth:"11-345678901-2", pagibig:"2345-6789-0012", vacationLeave:20, sickLeave:22, color:"#2563EB" },
  { id:"EMP003", employeeNo:"PNU-2024-003", fullName:"Dr. Ana Marie D. Cruz", lastName:"Cruz", firstName:"Ana Marie", middleName:"Dela", position:"Dean, College of Teacher Education", rank:"Professor V", department:"College of Teacher Education", employmentType:"Permanent", salaryGrade:26, step:4, monthlySalary:158477, status:"Active", gender:"Female", birthDate:"1972-01-10", email:"amdcruz@pnu.edu.ph", phone:"09171234003", dateHired:"2005-06-01", tin:"345-678-901-002", gsis:"003-456-789", philhealth:"11-456789012-3", pagibig:"3456-7890-1234", vacationLeave:18, sickLeave:25, color:"#7C3AED" },
  { id:"EMP004", employeeNo:"PNU-2024-004", fullName:"Prof. Ricardo Manuel O. Bautista", lastName:"Bautista", firstName:"Ricardo Manuel", middleName:"Ocampo", position:"Department Chair, Elementary Education", rank:"Professor III", department:"College of Teacher Education", employmentType:"Permanent", salaryGrade:24, step:3, monthlySalary:117066, status:"Active", gender:"Male", birthDate:"1975-09-05", email:"rmobautista@pnu.edu.ph", phone:"09171234004", dateHired:"2008-01-15", tin:"456-789-012-003", gsis:"004-567-890", philhealth:"11-567890123-4", pagibig:"4567-8901-2345", vacationLeave:15, sickLeave:20, color:"#059669" },
  { id:"EMP005", employeeNo:"PNU-2024-005", fullName:"Asst. Prof. Jennifer Rose M. Dela Torre", lastName:"Dela Torre", firstName:"Jennifer Rose", middleName:"Macaraeg", position:"Assistant Professor III", rank:"Assistant Professor III", department:"College of Teacher Education", employmentType:"Permanent", salaryGrade:17, step:2, monthlySalary:52446, status:"Active", gender:"Female", birthDate:"1985-04-18", email:"jrmdelatorre@pnu.edu.ph", phone:"09171234005", dateHired:"2014-06-01", tin:"567-890-123-004", gsis:"005-678-901", philhealth:"11-678901234-5", pagibig:"5678-9012-3456", vacationLeave:12, sickLeave:18, color:"#D97706" },
  { id:"EMP006", employeeNo:"PNU-2024-006", fullName:"Instr. Mark Anthony S. Villanueva", lastName:"Villanueva", firstName:"Mark Anthony", middleName:"Santiago", position:"Instructor II", rank:"Instructor II", department:"College of Arts and Sciences", employmentType:"Permanent", salaryGrade:13, step:1, monthlySalary:32053, status:"Active", gender:"Male", birthDate:"1992-11-25", email:"masvillanueva@pnu.edu.ph", phone:"09171234006", dateHired:"2019-08-01", tin:"678-901-234-005", gsis:"006-789-012", philhealth:"11-789012345-6", pagibig:"6789-0123-4567", vacationLeave:8, sickLeave:15, color:"#DC2626" },
  { id:"EMP007", employeeNo:"PNU-2024-007", fullName:"Mr. Carlo David R. Hernandez", lastName:"Hernandez", firstName:"Carlo David", middleName:"Rivera", position:"Administrative Officer V", rank:"Administrative Officer V", department:"Human Resource Development Office", employmentType:"Permanent", salaryGrade:18, step:5, monthlySalary:59096, status:"Active", gender:"Male", birthDate:"1982-06-30", email:"cdrhernandez@pnu.edu.ph", phone:"09171234007", dateHired:"2007-01-02", tin:"789-012-345-006", gsis:"007-890-123", philhealth:"11-890123456-7", pagibig:"7890-1234-5678", vacationLeave:20, sickLeave:30, color:"#0891B2" },
  { id:"EMP008", employeeNo:"PNU-2024-008", fullName:"Ms. Patricia Ann M. Flores", lastName:"Flores", firstName:"Patricia Ann", middleName:"Mendez", position:"HRMO III", rank:"Human Resource Management Officer III", department:"Human Resource Development Office", employmentType:"Permanent", salaryGrade:15, step:3, monthlySalary:40637, status:"Active", gender:"Female", birthDate:"1988-02-14", email:"pammflores@pnu.edu.ph", phone:"09171234008", dateHired:"2013-03-01", tin:"890-123-456-007", gsis:"008-901-234", philhealth:"11-901234567-8", pagibig:"8901-2345-6789", vacationLeave:15, sickLeave:20, color:"#BE185D" },
  { id:"EMP009", employeeNo:"PNU-2024-009", fullName:"Mr. Benjamin Roque T. Castillo", lastName:"Castillo", firstName:"Benjamin Roque", middleName:"Tolentino", position:"Accountant III", rank:"Accountant III", department:"Budget and Finance Office", employmentType:"Permanent", salaryGrade:19, step:2, monthlySalary:65319, status:"Active", gender:"Male", birthDate:"1980-08-08", email:"brtcastillo@pnu.edu.ph", phone:"09171234009", dateHired:"2009-07-01", tin:"901-234-567-008", gsis:"009-012-345", philhealth:"11-012345678-9", pagibig:"9012-3456-7890", vacationLeave:18, sickLeave:25, color:"#65A30D" },
  { id:"EMP010", employeeNo:"PNU-2024-010", fullName:"Ms. Elena Grace A. Mendoza", lastName:"Mendoza", firstName:"Elena Grace", middleName:"Aquino", position:"University Registrar", rank:"Administrative Officer V", department:"Office of the Registrar", employmentType:"Permanent", salaryGrade:18, step:7, monthlySalary:61818, status:"On Leave", gender:"Female", birthDate:"1979-12-05", email:"egamendoza@pnu.edu.ph", phone:"09171234010", dateHired:"2006-01-16", tin:"012-345-678-009", gsis:"010-123-456", philhealth:"11-123456789-0", pagibig:"0123-4567-8901", vacationLeave:5, sickLeave:12, color:"#9333EA" },
  { id:"EMP011", employeeNo:"PNU-2024-011", fullName:"Dr. Ferdinand Jose N. Ramos", lastName:"Ramos", firstName:"Ferdinand Jose", middleName:"Navarro", position:"Associate Professor IV", rank:"Associate Professor IV", department:"College of Arts and Sciences", employmentType:"Permanent", salaryGrade:22, step:5, monthlySalary:93267, status:"Active", gender:"Male", birthDate:"1971-05-20", email:"fjnramos@pnu.edu.ph", phone:"09171234011", dateHired:"2003-06-01", tin:"111-222-333-010", gsis:"011-111-222", philhealth:"11-222333444-1", pagibig:"1111-2222-3333", vacationLeave:22, sickLeave:28, color:"#0D9488" },
  { id:"EMP012", employeeNo:"PNU-2024-012", fullName:"Ms. Rosario Mylene P. Garcia", lastName:"Garcia", firstName:"Rosario Mylene", middleName:"Paglinawan", position:"Administrative Assistant II", rank:"Administrative Assistant II", department:"Office of the President", employmentType:"Permanent", salaryGrade:8, step:4, monthlySalary:19551, status:"Active", gender:"Female", birthDate:"1995-09-12", email:"rmpgarcia@pnu.edu.ph", phone:"09171234012", dateHired:"2020-02-01", tin:"222-333-444-011", gsis:"012-222-333", philhealth:"11-333444555-2", pagibig:"2222-3333-4444", vacationLeave:10, sickLeave:15, color:"#F59E0B" },
  { id:"EMP013", employeeNo:"PNU-2024-013", fullName:"Dr. Danilo Cruz T. Lim", lastName:"Lim", firstName:"Danilo Cruz", middleName:"Tan", position:"Director, RCTQ", rank:"Professor IV", department:"Research Center for Teacher Quality", employmentType:"Permanent", salaryGrade:27, step:2, monthlySalary:175793, status:"Active", gender:"Male", birthDate:"1970-03-28", email:"dctlim@pnu.edu.ph", phone:"09171234013", dateHired:"2002-01-15", tin:"333-444-555-012", gsis:"013-333-444", philhealth:"11-444555666-3", pagibig:"3333-4444-5555", vacationLeave:20, sickLeave:25, color:"#6366F1" },
  { id:"EMP014", employeeNo:"PNU-2024-014", fullName:"Asst. Prof. Maribel Santos U. Torres", lastName:"Torres", firstName:"Maribel Santos", middleName:"Uy", position:"Assistant Professor I", rank:"Assistant Professor I", department:"College of Flexible Learning and e-Technology", employmentType:"Permanent", salaryGrade:15, step:1, monthlySalary:39151, status:"Active", gender:"Female", birthDate:"1990-07-14", email:"msutorres@pnu.edu.ph", phone:"09171234014", dateHired:"2021-08-01", tin:"444-555-666-013", gsis:"014-444-555", philhealth:"11-555666777-4", pagibig:"4444-5555-6666", vacationLeave:7, sickLeave:12, color:"#EC4899" },
  { id:"EMP015", employeeNo:"PNU-2024-015", fullName:"Mr. Roberto Carlos D. Aquino", lastName:"Aquino", firstName:"Roberto Carlos", middleName:"Dizon", position:"IT Officer II", rank:"Information Technology Officer II", department:"Management Information Systems Office", employmentType:"Permanent", salaryGrade:16, step:3, monthlySalary:46036, status:"Active", gender:"Male", birthDate:"1987-11-02", email:"rcdaquino@pnu.edu.ph", phone:"09171234015", dateHired:"2016-04-01", tin:"555-666-777-014", gsis:"015-555-666", philhealth:"11-666777888-5", pagibig:"5555-6666-7777", vacationLeave:12, sickLeave:18, color:"#14B8A6" },
];

export const INIT_DTR: DtrRecord[] = [
  ...["EMP001","EMP002","EMP003","EMP004","EMP005","EMP006","EMP007","EMP008","EMP009","EMP011","EMP012","EMP013","EMP014","EMP015"].flatMap(id => [
    { employeeId:id, date:"2024-08-12", timeIn:"07:58 AM", timeOut:"05:02 PM", status:"Present" as const, overtime:0 },
    { employeeId:id, date:"2024-08-13", timeIn:"08:12 AM", timeOut:"05:10 PM", status:"Late" as const, overtime:0 },
    { employeeId:id, date:"2024-08-14", timeIn:"07:52 AM", timeOut:"06:30 PM", status:"Present" as const, overtime:90 },
    { employeeId:id, date:"2024-08-15", timeIn:"08:00 AM", timeOut:"05:00 PM", status:"Present" as const, overtime:0 },
    { employeeId:id, date:"2024-08-16", timeIn:null, timeOut:null, status:"Absent" as const, overtime:0 },
  ]),
  ...["2024-08-12","2024-08-13","2024-08-14","2024-08-15","2024-08-16"].map(date => ({
    employeeId:"EMP010", date, timeIn:null, timeOut:null, status:"On Leave" as const, overtime:0
  })),
];

export const INIT_LEAVES: LeaveRequest[] = [
  { id:"LR-2024-001", employeeId:"EMP010", employeeName:"Ms. Elena Grace A. Mendoza", department:"Office of the Registrar", leaveType:"Vacation Leave", startDate:"2024-07-15", endDate:"2024-07-19", days:5, reason:"Family vacation during semestral break", status:"Approved", appliedDate:"2024-07-01", approvedBy:"Dr. Jose Antonio B. Reyes" },
  { id:"LR-2024-002", employeeId:"EMP005", employeeName:"Asst. Prof. Jennifer Rose M. Dela Torre", department:"College of Teacher Education", leaveType:"Sick Leave", startDate:"2024-07-22", endDate:"2024-07-23", days:2, reason:"Medical consultation and recovery", status:"Pending", appliedDate:"2024-07-20" },
  { id:"LR-2024-003", employeeId:"EMP006", employeeName:"Instr. Mark Anthony S. Villanueva", department:"College of Arts and Sciences", leaveType:"Study Leave", startDate:"2024-08-01", endDate:"2024-08-31", days:23, reason:"Doctoral dissertation completion at UP Diliman", status:"Pending", appliedDate:"2024-07-10" },
  { id:"LR-2024-004", employeeId:"EMP012", employeeName:"Ms. Rosario Mylene P. Garcia", department:"Office of the President", leaveType:"Vacation Leave", startDate:"2024-08-05", endDate:"2024-08-09", days:5, reason:"Personal matters and family obligations", status:"Pending", appliedDate:"2024-07-18" },
  { id:"LR-2024-005", employeeId:"EMP014", employeeName:"Asst. Prof. Maribel Santos U. Torres", department:"CoFLeT", leaveType:"Maternity Leave", startDate:"2024-09-01", endDate:"2024-12-28", days:105, reason:"Maternity leave — first child", status:"Approved", appliedDate:"2024-07-15", approvedBy:"Dr. Ana Marie D. Cruz" },
  { id:"LR-2024-006", employeeId:"EMP011", employeeName:"Dr. Ferdinand Jose N. Ramos", department:"College of Arts and Sciences", leaveType:"Special Leave", startDate:"2024-07-25", endDate:"2024-07-26", days:2, reason:"International conference presentation in Singapore", status:"Approved", appliedDate:"2024-07-08", approvedBy:"Dr. Jose Antonio B. Reyes" },
  { id:"LR-2024-007", employeeId:"EMP007", employeeName:"Mr. Carlo David R. Hernandez", department:"Human Resource Development Office", leaveType:"Vacation Leave", startDate:"2024-08-12", endDate:"2024-08-16", days:5, reason:"Out-of-town travel for personal affairs", status:"Pending", appliedDate:"2024-07-22" },
  { id:"LR-2024-008", employeeId:"EMP009", employeeName:"Mr. Benjamin Roque T. Castillo", department:"Budget and Finance Office", leaveType:"Sick Leave", startDate:"2024-07-18", endDate:"2024-07-19", days:2, reason:"Hypertension flare-up with medical certificate", status:"Rejected", appliedDate:"2024-07-17", approvedBy:"Dr. Maria Luz G. Santos" },
];

export const INIT_PAYROLLS: PayrollRun[] = [
  { id:"PR-2024-07-A", period:"July 2024 — 1st Half", cutOff:"July 15, 2024", payDate:"July 20, 2024", employees:847, grossPay:18564230, totalDeductions:3245816, netPay:15318414, status:"Released", createdBy:"Mr. Benjamin Roque T. Castillo" },
  { id:"PR-2024-07-B", period:"July 2024 — 2nd Half", cutOff:"July 31, 2024", payDate:"August 5, 2024", employees:847, grossPay:18564230, totalDeductions:3312456, netPay:15251774, status:"Approved", createdBy:"Mr. Benjamin Roque T. Castillo" },
  { id:"PR-2024-06-A", period:"June 2024 — 1st Half", cutOff:"June 15, 2024", payDate:"June 20, 2024", employees:843, grossPay:18412780, totalDeductions:3198456, netPay:15214324, status:"Released", createdBy:"Mr. Benjamin Roque T. Castillo" },
  { id:"PR-2024-06-B", period:"June 2024 — 2nd Half", cutOff:"June 30, 2024", payDate:"July 5, 2024", employees:843, grossPay:18412780, totalDeductions:3245678, netPay:15167102, status:"Released", createdBy:"Mr. Benjamin Roque T. Castillo" },
  { id:"PR-2024-08-A", period:"August 2024 — 1st Half", cutOff:"August 15, 2024", payDate:"August 20, 2024", employees:849, grossPay:18721890, totalDeductions:3298456, netPay:15423434, status:"For Approval", createdBy:"Mr. Benjamin Roque T. Castillo" },
  { id:"PR-2024-08-B", period:"August 2024 — 2nd Half", cutOff:"August 31, 2024", payDate:"September 5, 2024", employees:849, grossPay:0, totalDeductions:0, netPay:0, status:"Draft", createdBy:"Mr. Benjamin Roque T. Castillo" },
];

export const INIT_NOTIFS: NotifItem[] = [
  { id:"N001", type:"warning", title:"Payroll Deadline Approaching", message:"August 2024 — 2nd Half payroll cut-off is August 31, 2024. All DTRs must be submitted.", time:"2 hours ago", read:false },
  { id:"N002", type:"info", title:"Leave Request Filed", message:"Mr. Carlo David Hernandez submitted a vacation leave for August 12–16.", time:"3 hours ago", read:false },
  { id:"N003", type:"success", title:"Payroll Released", message:"July 2024 — 1st Half payroll has been released to all 847 employees.", time:"1 day ago", read:false },
  { id:"N004", type:"info", title:"New Employee Onboarded", message:"Ms. Rosario Mylene P. Garcia has completed onboarding and is now active.", time:"2 days ago", read:true },
  { id:"N005", type:"warning", title:"Pending Leave Approvals", message:"3 leave requests are pending your approval. Please act within 5 working days.", time:"2 days ago", read:true },
  { id:"N006", type:"error", title:"Missing GSIS Remittance", message:"GSIS remittance for June 2024 has not been posted. Coordinate with the Budget Office.", time:"3 days ago", read:true },
  { id:"N007", type:"success", title:"IPCR Submission Completed", message:"Q2 2024 IPCR ratings have been submitted by all department heads.", time:"5 days ago", read:true },
  { id:"N008", type:"info", title:"DBM Circular No. 2024-05", message:"New DBM circular on salary adjustments for SG 1-10 effective August 2024.", time:"1 week ago", read:true },
];

export const INIT_VACANCIES: JobVacancy[] = [
  { id:"JV-2024-001", position:"Professor VI", department:"College of Teacher Education", salaryGrade:27, employmentType:"Permanent", slots:1, deadline:"2026-12-15", status:"Open", applicants:12, qualifications:"Doctorate degree; 10 years teaching experience; relevant publications", classification:"Plantilla", publicationStatus:"Published", publicationDate:"2026-10-15", requiredDocuments:["Personal Data Sheet (PDS)","Résumé / Curriculum Vitae","Doctoral degree certificate"] },
  { id:"JV-2024-002", position:"Assistant Professor II", department:"College of Arts and Sciences", salaryGrade:15, employmentType:"Permanent", slots:2, deadline:"2026-12-20", status:"Open", applicants:8, qualifications:"Master's degree; 3 years teaching experience", classification:"Plantilla", publicationStatus:"Published", publicationDate:"2026-10-20", requiredDocuments:["Personal Data Sheet (PDS)","Résumé / Curriculum Vitae","Eligibility certificate"] },
  { id:"JV-2024-003", position:"Administrative Officer III", department:"Human Resource Development Office", salaryGrade:14, employmentType:"Permanent", slots:1, deadline:"2024-08-15", status:"Closed", applicants:21, qualifications:"Bachelor's degree; eligibility; relevant experience", classification:"Plantilla", publicationStatus:"Published", publicationDate:"2024-06-15" },
  { id:"JV-2024-004", position:"IT Officer I", department:"Management Information Systems Office", salaryGrade:11, employmentType:"Permanent", slots:1, deadline:"2026-12-30", status:"Open", applicants:5, qualifications:"Bachelor's degree in CS/IT; relevant certification preferred", classification:"Plantilla", publicationStatus:"Published", publicationDate:"2026-10-28", requiredDocuments:["Personal Data Sheet (PDS)","Résumé / Curriculum Vitae","Relevant IT certifications"] },
  { id:"JV-2024-005", position:"Research Assistant", department:"Research Center for Teacher Quality", salaryGrade:10, employmentType:"Job Order", slots:3, deadline:"2024-08-20", status:"For Approval", applicants:0, qualifications:"Bachelor's degree; research background", classification:"Job Order", publicationStatus:"Draft" },
];

export const INIT_APPLICANTS: Applicant[] = [
  { id:"APP-001", vacancyId:"JV-2024-001", trackingNo:"PNU-REC-2024-0001", name:"Dr. Lorenzo Felipe R. Gonzales", email:"lfrg@gmail.com", appliedDate:"2024-07-18", status:"Interview", score:85, type:"External", examScore:85, examResult:"Passed", psbRating:85, competencyScores:[{name:"Teaching",score:90},{name:"Research",score:84},{name:"Communication",score:81}] },
  { id:"APP-002", vacancyId:"JV-2024-001", trackingNo:"PNU-REC-2024-0002", name:"Dr. Cynthia Marie O. Pante", email:"cmpante@dlsu.edu.ph", appliedDate:"2024-07-20", status:"Examination", score:79, type:"External", examScore:79, examResult:"Passed", psbRating:0 },
  { id:"APP-003", vacancyId:"JV-2024-001", trackingNo:"PNU-REC-2024-0003", name:"Asst. Prof. Ricardo Delos Santos", email:"rds@pnu.edu.ph", appliedDate:"2024-07-15", status:"Passed", score:91, type:"Internal", examScore:91, examResult:"Passed", psbRating:91 },
  { id:"APP-004", vacancyId:"JV-2024-002", trackingNo:"PNU-REC-2024-0004", name:"Ms. Grace P. Ibañez", email:"gpi@gmail.com", appliedDate:"2024-07-22", status:"Shortlisted", score:null, type:"External", examResult:"Pending" },
  { id:"APP-005", vacancyId:"JV-2024-002", trackingNo:"PNU-REC-2024-0005", name:"Mr. Kenneth Lim", email:"klim@ust.edu.ph", appliedDate:"2024-07-25", status:"Pending", score:null, type:"External", examResult:"Pending" },
  { id:"APP-006", vacancyId:"JV-2024-003", trackingNo:"PNU-REC-2024-0006", name:"Ms. Rachel Ann B. Molina", email:"rabm@gmail.com", appliedDate:"2024-07-01", status:"Hired", score:88, type:"External", examScore:88, examResult:"Passed", psbRating:88 },
  { id:"APP-007", vacancyId:"JV-2024-003", trackingNo:"PNU-REC-2024-0007", name:"Mr. Jose R. Navarro", email:"jrn@gmail.com", appliedDate:"2024-07-03", status:"Failed", score:62, type:"External", examScore:62, examResult:"Failed", psbRating:0 },
  { id:"APP-008", vacancyId:"JV-2024-004", trackingNo:"PNU-REC-2024-0008", name:"Mr. Daniel Mark C. Uy", email:"dmcu@gmail.com", appliedDate:"2024-07-28", status:"Shortlisted", score:null, type:"External", examResult:"Pending" },
];

export const INIT_TRAININGS: TrainingProgram[] = [
  { id:"TP-2024-001", title:"Strengthening Classroom Assessment Practices", organizer:"DepEd Region IV-A", venue:"PNU Manila — Multi-Purpose Hall", startDate:"2024-08-19", endDate:"2024-08-20", type:"Mandatory", status:"Upcoming", slots:40, nominated:38, category:"Pedagogy", sponsoringAgency:"DepEd Region IV-A", mandatoryOnboarding:true },
  { id:"TP-2024-002", title:"Gender and Development Orientation", organizer:"CHED NCR", venue:"CHED Central Office, Quezon City", startDate:"2024-08-12", endDate:"2024-08-12", type:"Mandatory", status:"Completed", slots:20, nominated:20, category:"Mandatory", sponsoringAgency:"CHED NCR", mandatoryOnboarding:true },
  { id:"TP-2024-003", title:"Data Privacy and Cybersecurity for HEIs", organizer:"National Privacy Commission", venue:"Online — MS Teams", startDate:"2024-08-26", endDate:"2024-08-26", type:"Optional", status:"Upcoming", slots:100, nominated:57, category:"ICT", sponsoringAgency:"National Privacy Commission" },
  { id:"TP-2024-004", title:"ASEAN Integration and Global Competency", organizer:"CHED", venue:"Century Park Hotel, Manila", startDate:"2024-07-08", endDate:"2024-07-12", type:"Scholarship", status:"Completed", slots:5, nominated:5, category:"International", sponsoringAgency:"CHED", scholarshipGrant:"CHED International Scholarship" },
  { id:"TP-2024-005", title:"Competency-Based Human Resource Management", organizer:"CSC Region NCR", venue:"CSC Central Office, Quezon City", startDate:"2024-09-04", endDate:"2024-09-06", type:"Mandatory", status:"Upcoming", slots:30, nominated:18, category:"HR Management", sponsoringAgency:"Civil Service Commission", mandatoryOnboarding:true },
];

export const INIT_NOMINATIONS: TrainingNomination[] = [
  { id:"TN-001", programId:"TP-2024-001", employeeId:"EMP005", employeeName:"Asst. Prof. Jennifer Rose M. Dela Torre", department:"CTE", status:"Approved", nominatedDate:"2024-08-01", invitationStatus:"Accepted", pdsSynced:true },
  { id:"TN-002", programId:"TP-2024-001", employeeId:"EMP004", employeeName:"Prof. Ricardo Manuel O. Bautista", department:"CTE", status:"Approved", nominatedDate:"2024-08-01", invitationStatus:"Sent", pdsSynced:true },
  { id:"TN-003", programId:"TP-2024-002", employeeId:"EMP007", employeeName:"Mr. Carlo David R. Hernandez", department:"HRDO", status:"Completed", nominatedDate:"2024-07-28", assessmentScore:92, assessmentNotes:"Completed post-training assessment", pdsSynced:true, completedDate:"2024-08-12" },
  { id:"TN-004", programId:"TP-2024-003", employeeId:"EMP015", employeeName:"Mr. Roberto Carlos D. Aquino", department:"MISO", status:"Pending", nominatedDate:"2024-08-05" },
  { id:"TN-005", programId:"TP-2024-004", employeeId:"EMP013", employeeName:"Dr. Danilo Cruz T. Lim", department:"RCTQ", status:"Completed", nominatedDate:"2024-06-15", assessmentScore:95, assessmentNotes:"Scholarship program completed", pdsSynced:true, completedDate:"2024-07-12" },
];

export const INIT_POSITION_COMPETENCIES: PositionCompetency[] = [
  { id:"PC-001",position:"Administrative Officer V",competency:"Human Resource Management",requiredLevel:4 },
  { id:"PC-002",position:"Administrative Officer V",competency:"Communication",requiredLevel:4 },
  { id:"PC-003",position:"Administrative Officer V",competency:"Digital Literacy",requiredLevel:3 },
  { id:"PC-004",position:"Assistant Professor III",competency:"Instructional Design",requiredLevel:4 },
  { id:"PC-005",position:"Assistant Professor III",competency:"Research and Publication",requiredLevel:4 },
  { id:"PC-006",position:"Assistant Professor III",competency:"Communication",requiredLevel:4 },
];

export const INIT_EMPLOYEE_COMPETENCIES: EmployeeCompetency[] = [
  { employeeId:"EMP007",competency:"Human Resource Management",currentLevel:3,assessedDate:"2024-08-01" },
  { employeeId:"EMP007",competency:"Communication",currentLevel:4,assessedDate:"2024-08-01" },
  { employeeId:"EMP007",competency:"Digital Literacy",currentLevel:2,assessedDate:"2024-08-01" },
  { employeeId:"EMP005",competency:"Instructional Design",currentLevel:3,assessedDate:"2024-08-01" },
  { employeeId:"EMP005",competency:"Research and Publication",currentLevel:4,assessedDate:"2024-08-01" },
  { employeeId:"EMP005",competency:"Communication",currentLevel:4,assessedDate:"2024-08-01" },
];

export const INIT_IPCR: PerformanceRating[] = [
  { id:"IPCR-2024-Q2-001", employeeId:"EMP001", employeeName:"Dr. Maria Luz G. Santos", department:"Office of the President", period:"Q2 2024", type:"OPCR", outputScore:4.8, efficiencyScore:4.9, timelinessScore:4.7, finalRating:4.8, adjectivalRating:"Outstanding", status:"Approved", submittedDate:"2024-07-08" },
  { id:"IPCR-2024-Q2-002", employeeId:"EMP002", employeeName:"Dr. Jose Antonio B. Reyes", department:"VPAA", period:"Q2 2024", type:"IPCR", outputScore:4.7, efficiencyScore:4.6, timelinessScore:4.5, finalRating:4.6, adjectivalRating:"Outstanding", status:"Approved", submittedDate:"2024-07-10" },
  { id:"IPCR-2024-Q2-003", employeeId:"EMP003", employeeName:"Dr. Ana Marie D. Cruz", department:"CTE", period:"Q2 2024", type:"IPCR", outputScore:4.4, efficiencyScore:4.3, timelinessScore:4.5, finalRating:4.4, adjectivalRating:"Outstanding", status:"Approved", submittedDate:"2024-07-09" },
  { id:"IPCR-2024-Q2-004", employeeId:"EMP005", employeeName:"Asst. Prof. Jennifer Rose M. Dela Torre", department:"CTE", period:"Q2 2024", type:"IPCR", outputScore:3.8, efficiencyScore:4.0, timelinessScore:3.9, finalRating:3.9, adjectivalRating:"Very Satisfactory", status:"Reviewed", submittedDate:"2024-07-11" },
  { id:"IPCR-2024-Q2-005", employeeId:"EMP007", employeeName:"Mr. Carlo David R. Hernandez", department:"HRDO", period:"Q2 2024", type:"IPCR", outputScore:4.2, efficiencyScore:4.1, timelinessScore:4.0, finalRating:4.1, adjectivalRating:"Outstanding", status:"Submitted", submittedDate:"2024-07-15" },
  { id:"IPCR-2024-Q2-006", employeeId:"EMP009", employeeName:"Mr. Benjamin Roque T. Castillo", department:"Budget and Finance", period:"Q2 2024", type:"IPCR", outputScore:3.5, efficiencyScore:3.6, timelinessScore:3.4, finalRating:3.5, adjectivalRating:"Very Satisfactory", status:"Draft", submittedDate:"" },
  { id:"IPCR-2024-Q2-007", employeeId:"EMP011", employeeName:"Dr. Ferdinand Jose N. Ramos", department:"CAS", period:"Q2 2024", type:"IPCR", outputScore:4.5, efficiencyScore:4.4, timelinessScore:4.6, finalRating:4.5, adjectivalRating:"Outstanding", status:"Approved", submittedDate:"2024-07-07" },
  { id:"IPCR-2024-Q2-008", employeeId:"EMP013", employeeName:"Dr. Danilo Cruz T. Lim", department:"RCTQ", period:"Q2 2024", type:"IPCR", outputScore:4.6, efficiencyScore:4.5, timelinessScore:4.7, finalRating:4.6, adjectivalRating:"Outstanding", status:"Approved", submittedDate:"2024-07-06" },
];

export const INIT_REWARDS: RewardNomination[] = [
  { id:"RN-2024-001", awardType:"Outstanding Employee Award", nomineeId:"EMP007", nomineeName:"Mr. Carlo David R. Hernandez", department:"HRDO", nominatedBy:"Dr. Maria Luz G. Santos", reason:"Exemplary performance in HRIS implementation and HR process improvement initiatives for AY 2023-2024", status:"Approved", period:"AY 2023-2024", dateNominated:"2024-06-15" },
  { id:"RN-2024-002", awardType:"Outstanding Teacher Award", nomineeId:"EMP003", nomineeName:"Dr. Ana Marie D. Cruz", department:"CTE", nominatedBy:"Dr. Jose Antonio B. Reyes", reason:"Exceptional contributions to teacher education, curriculum development, and student research mentoring", status:"Endorsed", period:"AY 2023-2024", dateNominated:"2024-06-20" },
  { id:"RN-2024-003", awardType:"Research Awards", nomineeId:"EMP013", nomineeName:"Dr. Danilo Cruz T. Lim", department:"RCTQ", nominatedBy:"Dr. Maria Luz G. Santos", reason:"Publication of 3 international peer-reviewed research articles and securing ₱5.2M research grant", status:"Pending", period:"AY 2023-2024", dateNominated:"2024-07-01" },
  { id:"RN-2024-004", awardType:"Perfect Attendance Incentive", nomineeId:"EMP015", nomineeName:"Mr. Roberto Carlos D. Aquino", department:"MISO", nominatedBy:"Mr. Carlo David R. Hernandez", reason:"Perfect attendance record for the entire AY 2023-2024, no absences or tardiness recorded", status:"Approved", period:"AY 2023-2024", dateNominated:"2024-06-10" },
  { id:"RN-2024-005", awardType:"Extension Awards", nomineeId:"EMP011", nomineeName:"Dr. Ferdinand Jose N. Ramos", department:"CAS", nominatedBy:"Dr. Ana Marie D. Cruz", reason:"Outstanding extension service contributions in 5 coastal communities under PNU's community engagement program", status:"Pending", period:"AY 2023-2024", dateNominated:"2024-07-05" },
  { id:"RN-2024-006", awardType:"Loyalty Incentive Pay", nomineeId:"EMP002", nomineeName:"Dr. Jose Antonio B. Reyes", department:"VPAA", nominatedBy:"Dr. Maria Luz G. Santos", reason:"25 years of dedicated service to Philippine Normal University", status:"Approved", period:"2024", dateNominated:"2024-05-28" },
];

export const INIT_WELLNESS: WellnessRecord[] = [
  { id:"WR-001", employeeId:"EMP001", employeeName:"Dr. Maria Luz G. Santos", type:"Medical", description:"Annual Executive Check-up", date:"2024-07-15", provider:"St. Luke's Medical Center", status:"Completed" },
  { id:"WR-002", employeeId:"EMP009", employeeName:"Mr. Benjamin Roque T. Castillo", type:"Medical", description:"Hypertension monitoring and blood chemistry", date:"2024-07-19", provider:"PNU Medical Clinic", status:"Completed" },
  { id:"WR-003", employeeId:"EMP005", employeeName:"Asst. Prof. Jennifer Rose M. Dela Torre", type:"Dental", description:"Prophylaxis and dental X-ray", date:"2024-08-20", provider:"PNU Dental Clinic", status:"Scheduled" },
  { id:"WR-004", employeeId:"EMP012", employeeName:"Ms. Rosario Mylene P. Garcia", type:"Mental Health", description:"Work-life balance counseling session", date:"2024-07-30", provider:"PNU Guidance and Counseling Center", status:"Completed" },
  { id:"WR-005", employeeId:"EMP006", employeeName:"Instr. Mark Anthony S. Villanueva", type:"Wellness Program", description:"Zumba / Aerobics Fitness Program (AY 2024-2025)", date:"2024-08-05", provider:"PNU Sports Center", status:"Completed" },
  { id:"WR-006", employeeId:"EMP007", employeeName:"Mr. Carlo David R. Hernandez", type:"Mental Health", description:"Stress management group session", date:"2024-08-14", provider:"PNU Guidance and Counseling Center", status:"Scheduled" },
  { id:"WR-007", employeeId:"EMP011", employeeName:"Dr. Ferdinand Jose N. Ramos", type:"Medical", description:"Pre-employment physical exam", date:"2024-08-22", provider:"PNU Medical Clinic", status:"Scheduled" },
];

export const INIT_WELLNESS_PROGRAMS: WellnessProgram[] = [
  { id:"WP-001", name:"Annual Executive Medical Check-up", category:"Medical", description:"Complete physical examination for officials and key staff.", targetAudience:"SG 20 and above", startDate:"2026-07-01", endDate:"2026-08-31", status:"Active" },
  { id:"WP-002", name:"Annual Medical Check-up (General)", category:"Medical", description:"Basic annual check-up program for employees.", targetAudience:"All employees", startDate:"2026-07-01", endDate:"2026-09-30", status:"Active" },
  { id:"WP-003", name:"Dental Care Program", category:"Dental", description:"Preventive and basic dental services by appointment.", targetAudience:"All employees", startDate:"2026-01-01", endDate:"2026-12-31", status:"Active" },
  { id:"WP-004", name:"Mental Health Awareness & Counseling", category:"Mental Health", description:"Mental health awareness, stress management, and counseling activities.", targetAudience:"All employees", startDate:"2026-01-01", endDate:"2026-12-31", status:"Active" },
  { id:"WP-005", name:"Physical Fitness & Sports Program", category:"Fitness", description:"Group fitness activities and employee sports programs.", targetAudience:"All employees", startDate:"2026-01-01", endDate:"2026-12-31", status:"Active" },
  { id:"WP-006", name:"PhilHealth Availment Facilitation", category:"Health Assistance", description:"Assistance with PhilHealth hospitalization and outpatient claims.", targetAudience:"All employees", startDate:"2026-01-01", endDate:"2026-12-31", status:"Active" },
];

export const INIT_FACULTY: FacultyProfile[] = [
  { employeeId:"EMP001", specialization:"Educational Leadership & Management", highestDegree:"Doctor of Education", university:"University of the Philippines Diliman", teachingLoad:0, researchCount:12, extensionCount:8, publications:18, awards:7, licenseNo:"0012345", licenseExpiry:"2026-08-31", rank:"University Professor", evaluation:4.9 },
  { employeeId:"EMP002", specialization:"Curriculum and Instruction", highestDegree:"Doctor of Philosophy in Education", university:"De La Salle University Manila", teachingLoad:6, researchCount:9, extensionCount:5, publications:14, awards:4, licenseNo:"0023456", licenseExpiry:"2025-06-30", rank:"Professor", evaluation:4.8 },
  { employeeId:"EMP003", specialization:"Teacher Education and Pedagogy", highestDegree:"Doctor of Education", university:"Philippine Normal University", teachingLoad:9, researchCount:7, extensionCount:6, publications:11, awards:3, licenseNo:"0034567", licenseExpiry:"2026-06-30", rank:"Professor", evaluation:4.7 },
  { employeeId:"EMP004", specialization:"Elementary Education and Mathematics", highestDegree:"Doctor of Philosophy in Education", university:"Ateneo de Manila University", teachingLoad:12, researchCount:5, extensionCount:4, publications:8, awards:2, licenseNo:"0045678", licenseExpiry:"2025-08-31", rank:"Associate Professor", evaluation:4.6 },
  { employeeId:"EMP005", specialization:"Language Education and Literacy", highestDegree:"Master of Arts in Education", university:"Philippine Normal University", teachingLoad:15, researchCount:2, extensionCount:3, publications:4, awards:1, licenseNo:"0056789", licenseExpiry:"2026-06-30", rank:"Assistant Professor", evaluation:4.3 },
  { employeeId:"EMP006", specialization:"Social Studies and Philippine History", highestDegree:"Master of Arts in History", university:"University of Santo Tomas", teachingLoad:18, researchCount:1, extensionCount:2, publications:2, awards:0, licenseNo:"0067890", licenseExpiry:"2025-06-30", rank:"Instructor", evaluation:4.1 },
  { employeeId:"EMP011", specialization:"Natural Sciences and Environmental Education", highestDegree:"Doctor of Philosophy in Biology", university:"University of the Philippines Los Baños", teachingLoad:12, researchCount:8, extensionCount:5, publications:13, awards:4, licenseNo:"0078901", licenseExpiry:"2026-08-31", rank:"Associate Professor", evaluation:4.7 },
  { employeeId:"EMP013", specialization:"Educational Research and Measurement", highestDegree:"Doctor of Philosophy in Educational Psychology", university:"University of the Philippines Diliman", teachingLoad:6, researchCount:15, extensionCount:7, publications:22, awards:5, licenseNo:"0089012", licenseExpiry:"2025-08-31", rank:"Professor", evaluation:4.8 },
  { employeeId:"EMP014", specialization:"Educational Technology and e-Learning", highestDegree:"Master of Arts in Educational Technology", university:"Philippine Normal University", teachingLoad:15, researchCount:1, extensionCount:2, publications:3, awards:0, licenseNo:"0090123", licenseExpiry:"2026-06-30", rank:"Assistant Professor", evaluation:4.2 },
];

export const monthlyPayrollData = [
  { month:"Jan", gross:36.8, net:30.4 }, { month:"Feb", gross:36.8, net:30.3 },
  { month:"Mar", gross:36.9, net:30.5 }, { month:"Apr", gross:37.1, net:30.6 },
  { month:"May", gross:36.8, net:30.4 }, { month:"Jun", gross:36.8, net:30.4 },
  { month:"Jul", gross:37.1, net:30.6 }, { month:"Aug", gross:37.4, net:30.8 },
];

export const leaveTypePieData = [
  { name:"Vacation", value:45 }, { name:"Sick", value:32 },
  { name:"Maternity/Pat.", value:12 }, { name:"Study", value:8 }, { name:"Special", value:3 },
];
export const PIE_COLORS = ["#1B3A6B","#C8A84B","#2563EB","#16A34A","#9333EA"];

export const employmentTypePieData = [
  { name:"Permanent", value:683 }, { name:"Contractual", value:98 },
  { name:"COS", value:52 }, { name:"Part-time", value:14 },
];
export const EMP_TYPE_COLORS = ["#1B3A6B","#C8A84B","#64748B","#CBD5E1"];

export const weekAttendanceData = [
  { day:"Mon", present:821, late:18, absent:8 },
  { day:"Tue", present:815, late:24, absent:10 },
  { day:"Wed", present:819, late:20, absent:10 },
  { day:"Thu", present:831, late:12, absent:6 },
  { day:"Fri", present:796, late:35, absent:18 },
];

export const fc = (n: number) => `₱${n.toLocaleString("en-PH", { minimumFractionDigits:2, maximumFractionDigits:2 })}`;
export const fd = (s: string) => s ? new Date(s).toLocaleDateString("en-PH", { year:"numeric", month:"short", day:"numeric" }) : "—";
export const fdLong = (s: string) => s ? new Date(s).toLocaleDateString("en-PH", { year:"numeric", month:"long", day:"numeric" }) : "—";
export const getInitials = (name: string) => {
  const clean = name.replace(/^(Dr\.|Prof\.|Asst\. Prof\.|Instr\.|Mr\.|Ms\.|Mrs\.)\s+/i,"");
  return clean.split(" ").slice(0,2).map((p: string) => p[0]).join("").toUpperCase();
};
export const computePayslip = (salary: number) => {
  const gsis = Math.round(salary * 0.09);
  const philhealth = Math.min(Math.round(salary * 0.02), 1800);
  const pagibig = 100;
  const taxable = salary - gsis - philhealth - pagibig;
  let tax = 0;
  if (taxable > 666667) tax = Math.round(183542 + (taxable - 666667) * 0.35);
  else if (taxable > 166667) tax = Math.round(33542 + (taxable - 166667) * 0.30);
  else if (taxable > 66667) tax = Math.round(8542 + (taxable - 66667) * 0.25);
  else if (taxable > 33333) tax = Math.round(1875 + (taxable - 33333) * 0.20);
  else if (taxable > 20833) tax = Math.round((taxable - 20833) * 0.15);
  const totalDeductions = gsis + philhealth + pagibig + tax;
  return { grossPay:salary, gsis, philhealth, pagibig, tax, totalDeductions, netPay:salary - totalDeductions };
};
export const nextId = (arr: {id:string}[], pfx: string) => {
  const nums = arr.map(i => parseInt(i.id.replace(pfx,"")) || 0);
  return `${pfx}${String(Math.max(0,...nums)+1).padStart(3,"0")}`;
};
export const EMP_COLORS = ["#1B3A6B","#2563EB","#7C3AED","#059669","#D97706","#DC2626","#0891B2","#BE185D","#65A30D","#9333EA","#0D9488","#F59E0B","#6366F1","#EC4899","#14B8A6"];

export const DEPTS = ["Office of the President","Office of the VPAA","College of Teacher Education","College of Arts and Sciences","College of Flexible Learning and e-Technology","Research Center for Teacher Quality","Human Resource Development Office","Budget and Finance Office","Office of the Registrar","Management Information Systems Office","Institute for Teaching and Learning","Office of Student Affairs"];
export const DEPTS_FILTER = ["All Departments",...DEPTS];

export const EMPTY_EMP: Partial<import("./types").Employee> = {
  firstName:"", lastName:"", middleName:"", position:"", rank:"", department:"College of Teacher Education",
  employmentType:"Permanent", salaryGrade:10, step:1, monthlySalary:25000, status:"Active",
  gender:"Female", birthDate:"1990-01-01", email:"", phone:"", dateHired:"2024-01-01",
  tin:"", gsis:"", philhealth:"", pagibig:"", vacationLeave:15, sickLeave:15,
};

// ── CENTRALIZED USER DATABASE ─────────────────────────────
export const USERS_DB: UserAccount[] = [
  { id:"U001", username:"admin", password:"pnu@2024", role:"admin", employeeId:"EMP001", fullName:"Dr. Maria Luz G. Santos", email:"admin@pnu.edu.ph", department:"Office of the President", position:"System Administrator", lastLogin:"Aug 14, 2024 07:30 AM", isActive:true },
  { id:"U002", username:"hrmo", password:"hrmo@2024", role:"hr_records", employeeId:"EMP002", fullName:"Atty. Patricia Ann M. Santos", email:"hrmo@pnu.edu.ph", department:"Human Resource Development Office", position:"HR Records Staff", lastLogin:"Aug 14, 2024 07:45 AM", isActive:true },
  { id:"U003", username:"payroll", password:"payroll@2024", role:"payroll", employeeId:"EMP003", fullName:"Benjamin Roque T. Castillo", email:"payroll@pnu.edu.ph", department:"Budget and Finance Office", position:"Payroll Staff", lastLogin:"Aug 14, 2024 08:00 AM", isActive:true },
  { id:"U004", username:"recruitment", password:"recruit@2024", role:"recruitment", employeeId:"EMP004", fullName:"Carlo David R. Hernandez", email:"recruitment@pnu.edu.ph", department:"Human Resource Development Office", position:"Recruitment Staff", lastLogin:"Aug 13, 2024 09:00 AM", isActive:true },
  { id:"U005", username:"training", password:"train@2024", role:"training", employeeId:"EMP005", fullName:"Jennifer Rose M. Dela Torre", email:"training@pnu.edu.ph", department:"Human Resource Development Office", position:"Training Staff", lastLogin:"Aug 13, 2024 09:30 AM", isActive:true },
  { id:"U006", username:"performance", password:"perf@2024", role:"performance", employeeId:"EMP006", fullName:"Maribel Santos A. Torres", email:"performance@pnu.edu.ph", department:"Human Resource Development Office", position:"Performance Management Staff", lastLogin:"Aug 12, 2024 10:00 AM", isActive:true },
  { id:"U007", username:"exec", password:"exec@2024", role:"management", employeeId:"EMP007", fullName:"Dr. Jose Antonio B. Reyes", email:"president@pnu.edu.ph", department:"Office of the President", position:"University President", lastLogin:"Aug 14, 2024 06:00 AM", isActive:true },
  { id:"U008", username:"employee1", password:"emp@2024", role:"employee", employeeId:"EMP008", fullName:"Ms. Patricia Ann M. Flores", email:"pammflores@pnu.edu.ph", department:"Human Resource Development Office", position:"HRMO III", lastLogin:"Aug 13, 2024 08:00 AM", isActive:true },
  { id:"U009", username:"faculty1", password:"fac@2024", role:"employee", employeeId:"EMP009", fullName:"Assoc. Prof. Vicente Jr. P. Guerrero", email:"vp.guerrero@pnu.edu.ph", department:"College of Arts and Sciences", position:"Associate Professor III", lastLogin:"Aug 12, 2024 07:45 AM", isActive:true },
  { id:"U010", username:"employee2", password:"emp@2024", role:"employee", employeeId:"EMP010", fullName:"Patricia Ann M. Flores", email:"pa.flores@pnu.edu.ph", department:"Office of the Registrar", position:"Administrative Officer V", lastLogin:"Aug 14, 2024 08:15 AM", isActive:true },
  { id:"U011", username:"faculty2", password:"fac@2024", role:"employee", employeeId:"EMP011", fullName:"Asst. Prof. Ana Maria T. Villanueva", email:"am.villanueva@pnu.edu.ph", department:"College of Teacher Education", position:"Assistant Professor I", lastLogin:"Aug 13, 2024 07:30 AM", isActive:true },
  { id:"U012", username:"recruit2", password:"recruit@2024", role:"recruitment", employeeId:"EMP012", fullName:"Maria Kristina R. Aguilar", email:"mk.aguilar@pnu.edu.ph", department:"Human Resource Development Office", position:"Recruitment Officer I", lastLogin:"Aug 11, 2024 09:00 AM", isActive:true },
  { id:"U013", username:"timekeeping", password:"time@2024", role:"timekeeping", employeeId:"EMP013", fullName:"Ramon A. Dizon", email:"timekeeping@pnu.edu.ph", department:"Human Resource Development Office", position:"Timekeeping Staff", lastLogin:"Aug 14, 2024 08:20 AM", isActive:true },
  { id:"U014", username:"leave", password:"leave@2024", role:"leave_management", employeeId:"EMP014", fullName:"Liza M. Bautista", email:"leave@pnu.edu.ph", department:"Human Resource Development Office", position:"Leave Management Staff", lastLogin:"Aug 14, 2024 08:25 AM", isActive:true },
  { id:"U015", username:"rewards", password:"rewards@2024", role:"rewards", employeeId:"EMP015", fullName:"Cecilia R. Mendoza", email:"rewards@pnu.edu.ph", department:"Human Resource Development Office", position:"Rewards and Recognition Staff", lastLogin:"Aug 14, 2024 08:30 AM", isActive:true },
  { id:"U016", username:"wellness", password:"wellness@2024", role:"wellness", employeeId:"EMP016", fullName:"Teresa P. Navarro", email:"wellness@pnu.edu.ph", department:"Health Services Office", position:"Health and Wellness Staff", lastLogin:"Aug 14, 2024 08:35 AM", isActive:true },
  { id:"U017", username:"facultyadmin", password:"faculty@2024", role:"faculty_management", employeeId:"EMP017", fullName:"Elena M. Villareal", email:"facultyadmin@pnu.edu.ph", department:"Academic Affairs Office", position:"Faculty Management Staff", lastLogin:"Aug 14, 2024 08:40 AM", isActive:true },
];

export function authenticateUser(username: string, password: string, role: Role): UserAccount | null {
  return USERS_DB.find(u =>
    u.username === username &&
    u.password === password &&
    u.role === role &&
    u.isActive
  ) || null;
}
