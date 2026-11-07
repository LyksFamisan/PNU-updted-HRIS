Develop a centralized HRIPS that manages the complete employee lifecycle:

Recruitment → Selection → Appointment → Employee Records → Onboarding → Training → Performance → Rewards → Health & Wellness → Scheduling → Attendance → Leave → Payroll → Faculty Management → Employee Self-Service → Reports → Government Compliance

The system must support both:

Teaching Personnel / Faculty
Non-Teaching Personnel / Administrative and Support Staff

Employment categories must include:

Permanent
Temporary
Casual
Contractual
Job Order
Contract of Service (COS)
Full-Time
Part-Time

The system must support both current and previous employees.

3. REQUIRED TECHNOLOGY STACK

Use the following technology architecture unless a specific requirement requires otherwise.

Backend
PHP
Laravel Framework
MVC architecture
RESTful API
Laravel authentication and authorization
Service Layer architecture
Repository pattern where appropriate
Queue/background jobs for notifications and heavy processes
Database
MySQL
Relational database design
Proper normalization
Foreign keys
Indexing
Transactions
Database migrations
Seeders
Soft deletes where appropriate
Data-at-rest encryption for sensitive information
Frontend

Use a modern responsive web interface.

Preferred:

Blade + Livewire OR
React + TypeScript

The interface must work on:

Desktop
Laptop
Tablet
Mobile browser

Use CSS-based responsive design.

Development
Git
GitHub
Environment configuration
Development environment
Staging environment
Production environment
4. SYSTEM ARCHITECTURE

Use a modular architecture.

Recommended structure:

HRIPS
│
├── Recruitment Module
├── Learning & Development Module
├── Performance Management Module
├── Rewards & Recognition Module
├── Health & Wellness Module
├── Employee Information Module
├── Scheduling & Timekeeping Module
├── Leave Management Module
├── Payroll Module
├── Employee Self-Service Module
├── System Administration Module
├── Faculty Management Module
├── Reports & Analytics Module
├── Notification Module
├── Document Management Module
├── Audit Trail Module
└── Integration/API Module

Use the Employee Master Record as the central source of employee information.

All other modules that require employee data must reference the Employee Master Record rather than creating duplicate employee records.

5. USER ROLES AND ACCESS CONTROL

Implement Role-Based Access Control (RBAC).

The system must support configurable roles such as:

System Administrator

Full system configuration and technical administration.

HRMO / HR Administrator

Access to employee records, recruitment, leave, training, performance, reports, and HR workflows.

Payroll Officer

Payroll processing, deductions, benefits, payroll reports, remittances, and payroll finalization.

Recruitment Officer

Vacancies, applicants, examinations, assessments, ranking, and appointments.

Training Officer

Training nominations, approvals, programs, scholarships, and employee development.

Faculty/Academic HR Officer

Faculty records, evaluation, workload, research, extension, and academic HR reports.

Supervisor / Approver

Approval of employee requests and performance-related workflows.

Employee

Access only to the employee's own information and authorized Employee Self-Service functions.

Management

Dashboard, reports, analytics, and authorized approvals.

Roles and permissions must be configurable.

Permission structure should support:

View
Create
Edit
Delete
Approve
Reject
Submit
Finalize
Print
Export
Download
Sign
Lock
Unlock
6. MODULE 1 – RECRUITMENT, SELECTION AND PLACEMENT

Develop a complete recruitment lifecycle.

Job Vacancy Management
Plantilla vacancies
Job Order vacancies
Vacancy creation
Position details
Salary grade
Qualification standards
Required competencies
Number of vacancies
Employment type
Publication dates
Application deadlines
Applicant Management
Internal applicants
External applicants
Applicant profile
Application history
Documents
Application status
Tracking number
Recruitment Workflow

Applicant registration
→ Application submission
→ Document screening
→ Examination
→ Examination scoring
→ Competency assessment
→ Interview
→ PSB evaluation
→ Ranking
→ Recommendation
→ Appointment
→ Hiring

Required Features
Examination management
Scores and results
PSB Rating
Application Assessment Forms
Recruitment Tracking Form
Action Sheet Report
ATAF
RAI
Publication Report
Appointment Management
Appointment Forms
Competency-based assessment
Online Recruitment Platform

Create a separate public-facing recruitment portal for external applicants.

It must support:

Online registration
Job vacancy browsing
Application submission
Document upload
Tracking number
Application status tracking
Email notifications
SMS notifications
Customized SMS sender name
SMS credits during warranty period

The online recruitment platform must synchronize with the main HRIPS.

External applicants must not have access to internal HRIPS functions.

7. MODULE 2 – LEARNING AND DEVELOPMENT

Implement:

Training programs
Invitations
Training nominations
Training approval
Training assessments
Training attendance
Sponsoring agencies
Scholarship training
Employee training history
Individual training report
Onboarding
Orientation programs
Mandatory onboarding training
Onboarding completion
Employee competency tracking

Automatically synchronize approved training records to the employee profile/PDS.

Create a competency comparison:

Employee Competencies
VS
Required Position Competencies

8. MODULE 3 – PERFORMANCE MANAGEMENT

Implement:

Performance appraisal
IPCR
OPCR
Performance Based Bonus
Strategic performance reports
Individual Learning and Development Plan
Coaching
Monitoring

Support configurable approval workflows.

Example:

Employee
→ Supervisor
→ Department
→ HR
→ Final Approval

Maintain complete audit history.

9. MODULE 4 – REWARDS AND RECOGNITION

Implement:

PRAISE nomination
Productivity Enhancement Incentive
Special Awards
Performance Based Bonus
Loyalty Incentive
Perfect Attendance Incentive
Research Awards
Extension Awards
Outstanding Teacher Award
Outstanding Employee Award
Gawad Agad Award
Other configurable institutional awards

Awards must be configurable instead of hard-coded.

10. MODULE 5 – HEALTH AND WELLNESS

Implement secure management of:

Medical information
Dental information
Health risk assessment
Mental health monitoring
Wellness programs
Counseling programs
Health reports

Health information must have restricted access and enhanced security.

11. MODULE 6 – EMPLOYEE INFORMATION

Create a centralized Employee Master Record.

Employee profile must contain:

Employee ID
Personal information
Employment information
Position
Salary Grade
Step
Employment status
Employment type
Plantilla item
Designation
Acting capacity
Effectivity dates
Bank account
Emergency contacts
Government relatives
Administrative offenses
Formal charges
Income
Deductions
Leave eligibility
Holiday eligibility
Documents

Support:

Personal Data Sheet
PDS history
Government IDs
201 Files
SALN
BIR 1902
BIR 1905
BIR 2316
Work Experience Sheet
Certificate of Employment
Service Record
NOSA
NOSI
Self-Assessment

Implement document versioning and history.

Employees may update their own PDS but changes must require HRMO approval.

12. DIGITAL WORKFLOW AND SIGNATURE

Implement digital workflows for:

Leave
CTO
Travel Authority
Pass Slip
Overtime
Change Shift
DTR Correction
Other configurable HR requests

Support:

Employee Submission
→ Reviewer
→ Approver
→ Digital Signature
→ Finalization

Maintain complete audit trails.

13. MODULE 7 – SCHEDULING AND TIMEKEEPING

Implement:

Fixed schedules
Flexible schedules
Shifting schedules
Regular shifts
Night shifts
Holidays
Employee eligibility
Schedule templates
Bulk schedule upload
Calendar attendance monitoring
Work suspension
Work-from-home attendance
Manual biometric upload
Official/exempted time entries
DTR review
DTR finalization
Attendance statuses

Display:

Perfect time entry
Missing time entry
Corrected time entry
Incomplete entry
On leave
Holiday
No schedule
Absent
Reports

Generate:

CS Form No. 48
AWOL Report
Employee Attendance Report
Habitual Tardiness
Habitual Undertime
Habitual DTR Correction
Habitual Leave
Incomplete Time Entries
Overtime
Off Duty Schedule
Perfect Attendance
Manpower Report
Monthly Attendance
Late Leave Filing
Accomplishment Report
Overtime/CTO consolidated report
Prolonged Leave
Biometric Punch Report
Tardiness and Undertime Monetary Report
Integration

Attendance must integrate with:

Employee Information
+
Biometrics
+
Leave
+
Payroll

14. BIOMETRIC INTEGRATION

Support:

Facial recognition
Fingerprint recognition
Existing HFSecurity FR05 devices
Five newly supplied biometric devices

Use the Employee ID as the primary mapping key.

Architecture:

Employee Master Record
→ Biometric Enrollment
→ Biometric Device
→ Time In/Out
→ Attendance Logs
→ DTR
→ Leave/Overtime
→ Payroll

The system must support:

Employee enrollment
Device assignment
Face registration
Fingerprint registration
Device synchronization
Log retrieval
Duplicate checking
Offline log synchronization
Device monitoring
Error handling
15. MODULE 8 – LEAVE MANAGEMENT

Implement:

Leave eligibility
Leave classifications
Leave application
Leave approval
HRMO adjustments
Late filing control
Justification letter
Leave Card/Ledger
Monthly leave earned
Leave balance history
Unauthorized Leave Report
Leave reports

Integrate with:

Attendance
→ Leave earning
→ Leave deductions
→ DTR
→ Payroll
→ Leave monetization

16. MODULE 9 – PAYROLL

Develop a configurable Philippine government/university payroll engine.

Payroll must use Employee Master information including:

Position
Salary Grade
Step
Employment Status
Employment Type
Work Type
Required hours
Basic Salary
Benefits
De Minimis
RATA
PERA
Cellphone Allowance
Quarters Allowance
Government Benefits
Applicable tax computation

Support:

General Payroll
COS Payroll
Part-Time Faculty Payroll
Extra Teaching Load
Extra Teaching Differential
Honoraria
Scholarship Payroll
Hazard Pay
Night Differential
PhilHealth Honorarium Share
Leave Monetization
Loyalty Incentive
Longevity Incentive
Step Increment
Mid-Year Bonus
Year-End Bonus
Cash Gift
Anniversary Incentive
Affiliation Incentive
PEI
Clothing Allowance
Medical Allowance
Subsistence and Laundry
FLATS
Tax Refund
Deficit Adjustment
Athletic Allowance
CNA
Living Quarters
Perfect Attendance
Self Development Incentive
PRAISE Incentive
Provident Share

Payroll must support:

Review
Adjustment
Re-computation
Approval
Finalization
Locking
Employee exclusion
Cancellation
Specific employee recomputation
Specific week exclusion
17. PAYROLL REPORTS

Generate:

Payslip
General Payroll
LBP Report
Bank Proof List
Mandatory Deduction Summary
Salary and Benefits Summary
Payroll Register
YTD Payroll Register
Hazard Payment
Bonus Reports
Leave Monetization
GSIS Contribution
PhilHealth Contribution
Pag-IBIG Contribution
Tax Contribution
Loans
Remittance Reports
Monthly Remittance Reports
Last Pay
Contribution Certificates
Payroll Index
Provident Share
Monthly Loans
BIR 2316
BIR 2307

Support generation of payroll files compatible with LandBank Digital Banking Portal.

Government rates and tables must be configurable.

Do not hard-code rates that may change.

18. MODULE 10 – EMPLOYEE SELF-SERVICE

Create an Employee Portal.

Employees can:

View PDS
Update PDS
View payslip
View contributions
View schedule
View attendance
View DTR
View overtime
Monitor leave
File CTO
File overtime
File leave
Request schedule change
Request DTR correction
Submit manual DTR
View job vacancies
View notifications
Submit inquiries
Submit feedback
Monitor training
Apply for IPCR
Apply for Magna Carta
Apply for Provident Fund
Apply for development plans
Apply for coaching
Apply for training/seminars
19. NOTIFICATION SYSTEM

Implement centralized notifications.

Support:

Email
SMS
In-system notifications

Notifications should be triggered for:

Leave status
Overtime status
CTO status
DTR correction
Recruitment status
Training nomination
Approval requests
Memo received
Announcements
Expiring licenses
Payroll availability
Important HR notices

Create configurable notification templates.

20. MODULE 11 – SYSTEM ADMINISTRATION

Implement:

User Management
Create user
Update user
Activate/deactivate
Password reset
Role assignment
Permissions
Master Data

All tables/master files must be configurable.

Examples:

Departments
Positions
Salary Grades
Steps
Employment Types
Leave Types
Benefits
Deductions
Holidays
Awards
Training Types
Competencies
Payroll parameters
Audit Trail

Record:

User
Action
Module
Record
Date/time
IP address
Old value
New value

Audit logs must not be editable by normal users.

21. MODULE 12 – FACULTY MANAGEMENT

Create a specialized Faculty Management module.

Faculty Profile

Track:

Academic qualifications
Teaching experience
Specialization
Research
Publications
Creative works
Extension activities
Licenses
Certifications
Recognitions
Academic portfolio
Faculty Evaluation

Support:

Instruction
Research
Extension
Professional Development
Documentary evidence
Department validation
FEC validation
University validation
Audit trail
Configurable scoring
Co-authorship rules
Evaluation limits
Student evaluation
Supervisor evaluation
Peer evaluation
Ranking
Reclassification
Faculty Workload

Track:

Teaching load
Research workload
Extension
Administrative designations

Generate workload reports.

Faculty Leave and Benefits

Support:

PVP
ESC
Study Leave
Sabbatical Leave
Return Service Obligation
Faculty Development

Track:

Graduate studies
Scholarships
Trainings
Seminars
Research capability
Extension participation