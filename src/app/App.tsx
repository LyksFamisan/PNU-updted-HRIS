import { createPortal } from "react-dom";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoImg from "@/imports/image-1.png";
import {
  LayoutDashboard, Users, Wallet, Calendar, Clock, FileText, Bell,
  Settings, Search, Plus, Edit2, Eye, Download,
  CheckCircle, XCircle, AlertTriangle, LogOut, User, Shield,
  BarChart2, TrendingUp, X,
  Building2, BookOpen, ChevronLeft,
  RefreshCw, Printer, Check, Mail, Phone, Activity,
  Briefcase, CreditCard, Calculator, ClipboardList,
  ArrowRight, Info, UserCheck, ChevronRight,
  AlertCircle, Fingerprint, Timer, Lock, Key,
  Clock3, AlarmClock, CheckSquare, Sunrise, Trash2,
  MessageSquare, Send, Bot, Navigation, MapPin, Camera,
  RotateCcw, Video, VideoOff,
  Award, GraduationCap, Target, Heart,
  UserPlus
} from "lucide-react";
import type {
  AppScreen, Role, Page, Employee, DtrRecord, LeaveRequest, PayrollRun,
  NotifItem, PhotoAttendanceRecord,
  JobVacancy, Applicant, TrainingProgram, TrainingNomination, OnboardingRecord,
  PositionCompetency, EmployeeCompetency,
  PerformanceRating, PerformanceBonusForm, IndividualDevelopmentPlan, CoachingRecord,
  RewardNomination, WellnessRecord, HealthRiskAssessment, WellnessProgram, CounselingRecord,
  PdsRevision, PersonnelDocument, EmploymentHistoryRecord, EmployeeServiceRequest, HROfficeCommunication,
  FacultyProfile, UserAccount
} from "./types";
import {
  INIT_EMPLOYEES, INIT_DTR, INIT_LEAVES, INIT_PAYROLLS, INIT_NOTIFS,
  INIT_VACANCIES, INIT_APPLICANTS, INIT_TRAININGS, INIT_NOMINATIONS,
  INIT_POSITION_COMPETENCIES, INIT_EMPLOYEE_COMPETENCIES,
  INIT_IPCR, INIT_REWARDS, INIT_WELLNESS, INIT_WELLNESS_PROGRAMS, INIT_FACULTY,
  monthlyPayrollData, leaveTypePieData, PIE_COLORS, weekAttendanceData,
  fc, fd, fdLong, computePayslip, nextId, EMP_COLORS,
  DEPTS, DEPTS_FILTER, EMPTY_EMP, authenticateUser
} from "./data";
import {
  ChartArea, ChartStackedBar, ChartDonut,
  Badge, Btn, Av, Modal, StatCard, SectionHeader, Toast,
  AIAssistantWidget
} from "./shared";
import { Dashboard } from "./pages/Dashboards";
import {
  RecruitmentPage, TrainingPage, PerformancePage,
  RewardsPage, WellnessPage, FacultyPage
} from "./pages/NewModules";
import { EmployeeRecordsPage } from "./pages/EmployeeRecordsPage";
import { EmployeeSelfServicePage } from "./pages/EmployeeSelfServicePage";
import { ExternalRecruitmentPlatform } from "./pages/ExternalRecruitmentPlatform";
import { externalRecruitmentApi } from "./externalRecruitmentApi";

function readRecruitmentStorage<T>(key:string, fallback:T):T {
  const saved=localStorage.getItem(key);
  return saved?JSON.parse(saved) as T:fallback;
}
function readExternalVacancies():JobVacancy[] {
  const saved=readRecruitmentStorage("pnu-recruitment-vacancies",INIT_VACANCIES);
  return saved.map(vacancy=>{
    const seed=INIT_VACANCIES.find(item=>item.id===vacancy.id);
    if(seed&&vacancy.publicationDate?.startsWith("2024-")&&vacancy.deadline?.startsWith("2024-")&&seed.publicationDate?.startsWith("2026-")) {
      return {...vacancy,publicationDate:seed.publicationDate,deadline:seed.deadline,requiredDocuments:vacancy.requiredDocuments||seed.requiredDocuments};
    }
    return vacancy;
  });
}

// ── HOME SCREEN ───────────────────────────────────────────
function HomeScreen({ onEnter }: { onEnter: () => void }) {
  const [counter, setCounter] = useState({ emp:0, years:0 });

  useEffect(() => {
    const steps = 60, dur = 2200;
    const interval = setInterval(() => {
      setCounter(prev => ({
        emp: prev.emp >= 3000 ? 3000 : Math.min(prev.emp + Math.ceil(3000/steps), 3000),
        years: prev.years >= 123 ? 123 : Math.min(prev.years + Math.ceil(123/steps), 123),
      }));
    }, dur/steps);
    const stop = setTimeout(() => clearInterval(interval), dur + 200);
    return () => { clearInterval(interval); clearTimeout(stop); };
  }, []);

  const features = [
    { icon:Users, title:"Employee Records", desc:"Complete 201 files and personnel database" },
    { icon:Wallet, title:"Payroll Processing", desc:"Automated with BIR TRAIN Law brackets" },
    { icon:Calendar, title:"Leave Management", desc:"Online filing and approval workflows" },
    { icon:Clock, title:"Attendance & DTR", desc:"BIO-TIME biometric integration" },
    { icon:BarChart2, title:"Reports & Analytics", desc:"Real-time dashboards and GSIS/PhilHealth reports" },
    { icon:Shield, title:"Audit & Compliance", desc:"Complete trail for COA readiness" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background:"linear-gradient(135deg, #0D1F3C 0%, #1B3A6B 55%, #0F2A52 100%)", fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(18)].map((_,i)=>(
          <div key={i} className="absolute rounded-full opacity-[0.04]" style={{
            width:`${40+i*30}px`, height:`${40+i*30}px`,
            top:`${(i*73)%100}%`, left:`${(i*41+13)%100}%`,
            backgroundColor:"white", transform:"translate(-50%,-50%)"
          }}/>
        ))}
      </div>
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <ImageWithFallback src={logoImg} alt="PNU Seal" className="w-10 h-10 object-contain drop-shadow-lg"/>
          <div>
            <p className="text-white font-bold text-sm leading-tight">PNU HRIS &amp; Payroll</p>
            <p className="text-white/40 text-xs">Philippine Normal University</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-white/40 border border-white/10 rounded-full px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>ISO 9001:2015
          </span>
          <button onClick={onEnter} className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-lg" style={{ backgroundColor:"#C8A84B", color:"#1A2744" }}>
            Sign In
          </button>
        </div>
      </nav>
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
        <div className="mb-8 relative">
          <div className="w-36 h-36 flex items-center justify-center">
            <ImageWithFallback src={logoImg} alt="Philippine Normal University Official Seal" className="w-full h-full object-contain drop-shadow-2xl"/>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20" style={{ backgroundColor:"#C8A84B" }}>
            <Check className="w-4 h-4" style={{ color:"#1A2744" }}/>
          </div>
        </div>
        <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-3">Integrated</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
          Human Resource &amp; Payroll<br/>Management System
        </h1>
        <p className="font-semibold text-base mb-1" style={{ color:"#C8A84B" }}>Philippine Normal University</p>
        <p className="text-white/40 text-sm mb-10">The National Center for Teacher Education · Est. 1901 · Manila</p>
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          <div className="text-center">
            <p className="text-4xl font-bold text-white font-mono">{counter.emp.toLocaleString()}</p>
            <p className="text-white/40 text-xs mt-1 uppercase tracking-wide">Employees</p>
          </div>
          <div className="w-px bg-white/10 self-stretch hidden sm:block"/>
          <div className="text-center">
            <p className="text-4xl font-bold text-white font-mono">{counter.years}</p>
            <p className="text-white/40 text-xs mt-1 uppercase tracking-wide">Years of Excellence</p>
          </div>
        </div>
        <button onClick={onEnter}
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base transition-all hover:scale-105 active:scale-95 shadow-xl mb-12"
          style={{ backgroundColor:"#C8A84B", color:"#1A2744" }}>
          Access HR System <ArrowRight className="w-5 h-5"/>
        </button>
        <a href="/apply" className="text-sm text-white/70 hover:text-white underline underline-offset-4 mb-8">External applicants: Apply online</a>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl w-full">
          {features.map(f => (
            <div key={f.title} className="rounded-xl p-4 text-left border border-white/10 hover:border-white/20 transition-colors" style={{ backgroundColor:"rgba(255,255,255,0.04)" }}>
              <f.icon className="w-5 h-5 mb-2.5" style={{ color:"#C8A84B" }}/>
              <p className="text-white text-sm font-semibold mb-0.5">{f.title}</p>
              <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10 text-center py-4 border-t border-white/10">
        <p className="text-white/25 text-xs">© 2024 Philippine Normal University · Taft Avenue, Malate, Manila 1000 · All Rights Reserved</p>
      </div>
    </div>
  );
}

// ── PORTAL + LOGIN SYSTEM ─────────────────────────────────
const PORTAL_CARDS: Array<{
  role:Role; title:string; shortTitle:string; desc:string;
  icon:React.ElementType; color:string; gradient:string; modules:string[]; audience:string;
}> = [
  { role:"admin", title:"System Administrator Portal", shortTitle:"System Administrator", desc:"Central administration of all HRIPS modules, users, roles, permissions, system settings and audit trails", icon:Shield, color:"#C8A84B", gradient:"linear-gradient(135deg,#102747,#385B85)", modules:["All 11 HRIPS Modules","Users & Roles","Audit & Settings"], audience:"Authorized PNU System Administrators" },
  { role:"recruitment", title:"Recruitment Staff", shortTitle:"Recruitment", desc:"Manage job vacancies, screen applicants, and facilitate the full hiring pipeline", icon:UserPlus, color:"#7C3AED", gradient:"linear-gradient(135deg,#4C1D95,#7C3AED)", modules:["Vacancies","Applicants","Placement"], audience:"HRDO Recruitment Unit" },
  { role:"training", title:"Training Staff", shortTitle:"Training Staff", desc:"Coordinate learning and development programs, nominations, and staff certification tracking", icon:GraduationCap, color:"#D97706", gradient:"linear-gradient(135deg,#78350F,#D97706)", modules:["L&D Programs","Nominations","Certificates"], audience:"HRDO Training Unit" },
  { role:"performance", title:"Performance Management Staff", shortTitle:"Performance", desc:"Facilitate IPCR/OPCR rating, evaluation forms, and performance reporting", icon:Target, color:"#DC2626", gradient:"linear-gradient(135deg,#7F1D1D,#DC2626)", modules:["IPCR","OPCR","Ratings"], audience:"HRDO Performance Unit" },
  { role:"rewards", title:"Rewards and Recognition Staff", shortTitle:"Rewards & Recognition", desc:"Coordinate employee awards, recognition programs, and reward nominations", icon:Award, color:"#B45309", gradient:"linear-gradient(135deg,#78350F,#B45309)", modules:["Rewards","Recognition","Nominations"], audience:"HRDO Rewards Unit" },
  { role:"wellness", title:"Health and Wellness Staff", shortTitle:"Health & Wellness", desc:"Manage employee wellness programs, health services, and wellness records", icon:Heart, color:"#DB2777", gradient:"linear-gradient(135deg,#831843,#DB2777)", modules:["Health Services","Wellness Programs"], audience:"Health & Wellness Office" },
  { role:"hr_records", title:"HR Records Staff", shortTitle:"HR Records", desc:"Maintain employee information, personnel records, and workforce data", icon:Users, color:"#2563EB", gradient:"linear-gradient(135deg,#1E3A8A,#3B82F6)", modules:["Employee Information","Personnel Records"], audience:"HR Records Office" },
  { role:"timekeeping", title:"Timekeeping Staff", shortTitle:"Timekeeping", desc:"Monitor attendance, maintain DTR records, and manage timekeeping workflows", icon:Clock, color:"#0891B2", gradient:"linear-gradient(135deg,#164E63,#0891B2)", modules:["Attendance","DTR","Timekeeping"], audience:"Timekeeping Office" },
  { role:"leave_management", title:"Leave Management Staff", shortTitle:"Leave Management", desc:"Review leave applications and manage leave balances and approval workflows", icon:Calendar, color:"#4F46E5", gradient:"linear-gradient(135deg,#312E81,#4F46E5)", modules:["Leave Applications","Approvals","Balances"], audience:"Leave Management Office" },
  { role:"payroll", title:"Payroll Staff", shortTitle:"Payroll Staff", desc:"Process payroll, generate payslips, and manage government deduction remittances", icon:Wallet, color:"#059669", gradient:"linear-gradient(135deg,#064E3B,#059669)", modules:["Payroll","Payslips","Gov. Deductions"], audience:"Budget & Finance" },
  { role:"employee", title:"Employee Self-Service", shortTitle:"Employee / Faculty", desc:"Employees and faculty can view payslips, file leave applications, and monitor attendance", icon:User, color:"#0F766E", gradient:"linear-gradient(135deg,#134E4A,#0F766E)", modules:["Payslip","Leave","My DTR"], audience:"All Employees & Faculty" },
  { role:"faculty_management", title:"Faculty Management Staff", shortTitle:"Faculty Management", desc:"Manage faculty profiles, teaching loads, academic records, and evaluations", icon:BookOpen, color:"#0369A1", gradient:"linear-gradient(135deg,#0C4A6E,#0369A1)", modules:["Faculty Profiles","Teaching Load","Research"], audience:"Faculty Management Office" },
];

const DEMO_CREDS: Record<Role,{username:string;password:string}> = {
  admin:{username:"admin",password:"pnu@2024"},
  hr_records:{username:"hrmo",password:"hrmo@2024"},
  payroll:{username:"payroll",password:"payroll@2024"},
  recruitment:{username:"recruitment",password:"recruit@2024"},
  training:{username:"training",password:"train@2024"},
  performance:{username:"performance",password:"perf@2024"},
  rewards:{username:"rewards",password:"rewards@2024"},
  wellness:{username:"wellness",password:"wellness@2024"},
  timekeeping:{username:"timekeeping",password:"time@2024"},
  leave_management:{username:"leave",password:"leave@2024"},
  management:{username:"exec",password:"exec@2024"},
  employee:{username:"employee1",password:"emp@2024"},
  faculty_management:{username:"facultyadmin",password:"faculty@2024"},
};

const ROLE_FEATURES: Record<Role,string[]> = {
  admin:["Complete employee lifecycle management","System configuration & user access","Payroll processing & government deductions","Comprehensive audit trail & COA compliance"],
  hr_records:["Employee records & 201 file management","Maintain employee information and personnel data","Workforce records and reporting"],
  payroll:["Payroll computation & disbursement","Payslip generation & distribution","GSIS, PhilHealth & Pag-IBIG remittances","BIR TRAIN Law withholding tax computation"],
  recruitment:["Job vacancy posting & management","Applicant screening & shortlisting","Examination & interview scheduling","Placement tracking & onboarding"],
  training:["Training program coordination","Nomination & approval workflow","Training calendar & scheduling","Completion certificates & tracking"],
  performance:["IPCR/OPCR form management","Performance rating computation","360-degree evaluation facilitation","Performance analytics & reports"],
  rewards:["Employee award and recognition programs","Reward nomination and review","Recognition history and reporting"],
  wellness:["Employee health and wellness programs","Wellness service coordination","Health and wellness record tracking"],
  timekeeping:["Attendance and DTR monitoring","Timekeeping record maintenance","Attendance reports"],
  leave_management:["Leave application review","Leave approval workflows","Leave balance management"],
  management:["Executive dashboard & KPI monitoring","Strategic analytics & trend reports","Department performance overview","Decision-support data visualization"],
  employee:["View payslips & pay history","Online leave application & filing","Attendance & DTR self-monitoring","Personal IPCR & training records"],
  faculty_management:["Faculty profile and academic portfolio management","Teaching load and class schedule","Research, extension, and publication records","Faculty evaluation"],
};

// ── PORTAL SCREEN ─────────────────────────────────────────
function PortalScreen({ onBack, onSelectRole }: { onBack:()=>void; onSelectRole:(r:Role)=>void }) {
  return (
    <div className="min-h-screen flex flex-col" style={{background:"linear-gradient(135deg,#0D1F3C 0%,#1B3A6B 60%,#0F2A52 100%)",fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(16)].map((_,i)=>(
          <div key={i} className="absolute rounded-full" style={{
            width:`${50+i*32}px`, height:`${50+i*32}px`,
            top:`${(i*71+13)%100}%`, left:`${(i*43+7)%100}%`,
            backgroundColor:"white", opacity:0.025, transform:"translate(-50%,-50%)"
          }}/>
        ))}
      </div>
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-10 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <ImageWithFallback src={logoImg} alt="PNU" className="w-10 h-10 object-contain drop-shadow-lg"/>
          <div>
            <p className="text-white font-bold text-sm leading-tight">PNU HRIPS Enterprise Portal</p>
            <p className="text-white/40 text-xs">Philippine Normal University · Select Your Access Type</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-white/40 border border-white/10 rounded-full px-3 py-1">
            <Shield className="w-3 h-3"/>Centralized Auth
          </span>
          <button onClick={onBack} className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs transition-colors border border-white/20 rounded-xl px-4 py-2 hover:border-white/40">
            <ChevronLeft className="w-3.5 h-3.5"/>Back to Home
          </button>
        </div>
      </nav>

      <div className="relative z-10 flex-1 px-4 lg:px-10 py-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
              <span className="text-white/60 text-xs font-medium">One Centralized Authentication System · One User Database</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">Select Your Access Portal</h1>
            <p className="text-white/50 text-base">11 dedicated portals — each with role-specific modules, tailored dashboards, and focused workflows</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PORTAL_CARDS.map(card=>(
              <button key={card.role} onClick={()=>onSelectRole(card.role)}
                className="group bg-white rounded-2xl overflow-hidden text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl shadow-lg">
                <div className="h-28 flex flex-col items-center justify-center relative overflow-hidden" style={{background:card.gradient}}>
                  <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:"radial-gradient(circle at 75% 25%, rgba(255,255,255,0.12) 0%, transparent 60%)"}}/>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/15 backdrop-blur mb-2 group-hover:bg-white/20 transition-colors">
                    <card.icon className="w-7 h-7 text-white"/>
                  </div>
                  <span className="text-white/60 text-[11px] font-medium">{card.audience}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground text-sm mb-1.5 leading-tight">{card.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{card.desc}</p>
                  <div className="flex flex-wrap gap-1 mb-3.5">
                    {card.modules.map(m=>(
                      <span key={m} className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white" style={{backgroundColor:card.color+"CC"}}>{m}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs font-semibold" style={{color:card.color}}>Access Portal</span>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform" style={{backgroundColor:card.color+"18"}}>
                      <ArrowRight className="w-3.5 h-3.5" style={{color:card.color}}/>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 text-center space-y-1">
            <p className="text-white/25 text-xs">All portals share one centralized employee database · Authentication is role-verified · PNU HRIPS v2024.08</p>
            <p className="text-white/15 text-xs">© 2024 Philippine Normal University · Taft Avenue, Malate, Manila 1000 · All Rights Reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ROLE-THEMED LOGIN SCREEN ──────────────────────────────
function LoginScreen({ role, onBack, onLogin }: {
  role:Role; onBack:()=>void; onLogin:(account:UserAccount)=>void;
}) {
  const card = PORTAL_CARDS.find(c=>c.role===role) || PORTAL_CARDS[0];
  const creds = DEMO_CREDS[role];
  const features = ROLE_FEATURES[role];
  const [username, setUsername] = useState(creds.username);
  const [password, setPassword] = useState(creds.password);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleLogin = () => {
    setAuthError("");
    setLoading(true);
    setTimeout(() => {
      const account = authenticateUser(username, password, role);
      setLoading(false);
      if (account) { onLogin(account); }
      else { setAuthError("Invalid credentials. Check username and password for this portal."); }
    }, 900);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — role-themed panel */}
      <div className="hidden lg:flex w-[400px] xl:w-[440px] shrink-0 flex-col" style={{background:card.gradient}}>
        <div className="p-8 flex-1 flex flex-col">
          <button onClick={onBack} className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition-colors mb-8 w-fit">
            <ChevronLeft className="w-3.5 h-3.5"/>Back to Portal Selection
          </button>
          <div className="flex items-center gap-3 mb-8">
            <ImageWithFallback src={logoImg} alt="PNU" className="w-9 h-9 object-contain"/>
            <div>
              <p className="text-white font-bold text-sm leading-tight">PNU HRIPS</p>
              <p className="text-white/40 text-xs">Enterprise Portal System</p>
            </div>
          </div>
          <div className="flex-1">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-white/15 mb-6">
              <card.icon className="w-10 h-10 text-white"/>
            </div>
            <h2 className="text-2xl xl:text-3xl font-bold text-white leading-tight mb-1">{card.title}</h2>
            <p className="text-white/40 text-sm mb-7">Dedicated Portal</p>
            <div className="space-y-3 mb-8">
              {features.map((f,i)=>(
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center bg-white/20 shrink-0 mt-0.5">
                    <CheckCircle className="w-2.5 h-2.5 text-white"/>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed">{f}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {card.modules.map(m=>(
                <span key={m} className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/15 text-white/70">{m}</span>
              ))}
            </div>
          </div>
          <p className="text-white/20 text-xs mt-6">© 2024 Philippine Normal University</p>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto" style={{backgroundColor:"#F4F6FA"}}>
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <ImageWithFallback src={logoImg} alt="PNU" className="w-10 h-10 object-contain"/>
            <div><p className="font-bold text-foreground">PNU HRIPS</p><p className="text-xs text-muted-foreground">Philippine Normal University</p></div>
          </div>
          <button onClick={onBack} className="lg:hidden flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs transition-colors mb-5">
            <ChevronLeft className="w-3.5 h-3.5"/>Back to Portal Selection
          </button>

          {/* Role identity badge */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl mb-6 border" style={{backgroundColor:card.color+"08",borderColor:card.color+"30"}}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{backgroundColor:card.color+"20"}}>
              <card.icon className="w-5 h-5" style={{color:card.color}}/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Signing in to</p>
              <p className="text-sm font-bold text-foreground truncate">{card.title}</p>
            </div>
            <span className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full text-white" style={{backgroundColor:card.color}}>{card.audience.split(" ")[0]}</span>
          </div>

          <div className="mb-5">
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your {card.shortTitle} portal</p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-4">
            <div className="space-y-4">
              {authError&&(
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5"/>
                  <p className="text-xs text-red-600 leading-relaxed">{authError}</p>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                  <input value={username} onChange={e=>{setUsername(e.target.value);setAuthError("");}}
                    onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                    className="w-full border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none bg-muted/30 focus:border-[var(--rc)]"
                    style={{"--rc":card.color+"60"} as React.CSSProperties}
                    placeholder="username"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                  <input type={showPw?"text":"password"} value={password}
                    onChange={e=>{setPassword(e.target.value);setAuthError("");}}
                    onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                    className="w-full border border-border rounded-xl pl-9 pr-9 py-2.5 text-sm focus:outline-none bg-muted/30"/>
                  <button onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <Eye className="w-4 h-4"/>
                  </button>
                </div>
              </div>
              <button onClick={handleLogin} disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-70 flex items-center justify-center gap-2 hover:opacity-90 shadow-md"
                style={{backgroundColor:card.color}}>
                {loading?<><RefreshCw className="w-4 h-4 animate-spin"/>Authenticating...</>:<><Key className="w-4 h-4"/>Sign In</>}
              </button>
            </div>
          </div>

          {/* Demo credentials card */}
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{backgroundColor:card.color+"20"}}>
                <Info className="w-2.5 h-2.5" style={{color:card.color}}/>
              </div>
              <p className="text-xs font-semibold text-foreground">Demo Credentials</p>
              <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium ml-auto">Demo Mode</span>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-xl" style={{backgroundColor:card.color+"08"}}>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Username</p>
                <p className="text-sm font-mono font-bold text-foreground">{creds.username}</p>
              </div>
              <div className="w-px h-8 bg-border"/>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Password</p>
                <p className="text-sm font-mono font-bold text-foreground">{creds.password}</p>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">Authorized personnel only · PNU HRIPS Centralized Auth · v2024.08</p>
        </div>
      </div>
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────
type NavItem = { icon: React.ElementType; label: string; page: Page; group?: string };

const NAV: Record<string, NavItem[]> = {
  admin: [
    { icon:LayoutDashboard, label:"Dashboard", page:"dashboard" },
    { icon:Key, label:"Access Control Center", page:"access-control", group:"Administration" },
    { icon:Users, label:"Employee Management", page:"employees", group:"Workforce" },
    { icon:UserPlus, label:"Recruitment", page:"recruitment", group:"Workforce" },
    { icon:BookOpen, label:"Faculty Management", page:"faculty", group:"Workforce" },
    { icon:Wallet, label:"Payroll Processing", page:"payroll", group:"Payroll" },
    { icon:Calendar, label:"Leave Management", page:"leave", group:"Time & Leave" },
    { icon:Clock, label:"Attendance & DTR", page:"attendance", group:"Time & Leave" },
    { icon:GraduationCap, label:"Learning & Development", page:"training", group:"Development" },
    { icon:Target, label:"Performance Management", page:"performance", group:"Development" },
    { icon:Award, label:"Rewards & Recognition", page:"rewards", group:"Development" },
    { icon:Heart, label:"Health & Wellness", page:"wellness", group:"Development" },
    { icon:BarChart2, label:"Reports", page:"reports", group:"Analytics" },
    { icon:Shield, label:"Audit Trail", page:"audit", group:"Analytics" },
    { icon:Bell, label:"Notifications", page:"notifications" },
    { icon:Settings, label:"Settings", page:"settings" },
  ],
  hr_records: [
    { icon:LayoutDashboard, label:"Dashboard", page:"dashboard" },
    { icon:Users, label:"Employee Management", page:"employees", group:"Records" },
    { icon:FileText, label:"PDS & Personnel Records", page:"hr-records", group:"Records" },
    { icon:BarChart2, label:"Reports", page:"reports", group:"Records" },
    { icon:Bell, label:"Notifications", page:"notifications" },
    { icon:Settings, label:"Settings", page:"settings" },
  ],
  payroll: [
    { icon:LayoutDashboard, label:"Dashboard", page:"dashboard" },
    { icon:Wallet, label:"Payroll Processing", page:"payroll", group:"Payroll" },
    { icon:FileText, label:"Payslip Viewer", page:"payslip", group:"Payroll" },
    { icon:Clock, label:"Attendance", page:"attendance", group:"Time & Leave" },
    { icon:BarChart2, label:"Reports", page:"reports", group:"Analytics" },
    { icon:Bell, label:"Notifications", page:"notifications" },
    { icon:Settings, label:"Settings", page:"settings" },
  ],
  recruitment: [
    { icon:LayoutDashboard, label:"Dashboard", page:"dashboard" },
    { icon:UserPlus, label:"Recruitment", page:"recruitment", group:"Recruitment" },
    { icon:Users, label:"Employee Records", page:"employees", group:"Recruitment" },
    { icon:BarChart2, label:"Reports", page:"reports", group:"Analytics" },
    { icon:Bell, label:"Notifications", page:"notifications" },
    { icon:Settings, label:"Settings", page:"settings" },
  ],
  training: [
    { icon:LayoutDashboard, label:"Dashboard", page:"dashboard" },
    { icon:GraduationCap, label:"L&D Programs", page:"training", group:"Development" },
    { icon:Users, label:"Employee Records", page:"employees", group:"Development" },
    { icon:BarChart2, label:"Reports", page:"reports", group:"Analytics" },
    { icon:Bell, label:"Notifications", page:"notifications" },
    { icon:Settings, label:"Settings", page:"settings" },
  ],
  performance: [
    { icon:LayoutDashboard, label:"Dashboard", page:"dashboard" },
    { icon:Target, label:"Performance (IPCR/OPCR)", page:"performance", group:"Performance" },
    { icon:Users, label:"Employee Records", page:"employees", group:"Performance" },
    { icon:BarChart2, label:"Reports", page:"reports", group:"Analytics" },
    { icon:Bell, label:"Notifications", page:"notifications" },
    { icon:Settings, label:"Settings", page:"settings" },
  ],
  rewards: [
    { icon:LayoutDashboard, label:"Dashboard", page:"dashboard" },
    { icon:Award, label:"Rewards & Recognition", page:"rewards", group:"Rewards" },
    { icon:BarChart2, label:"Reports", page:"reports", group:"Rewards" },
    { icon:Bell, label:"Notifications", page:"notifications" },
    { icon:Settings, label:"Settings", page:"settings" },
  ],
  wellness: [
    { icon:LayoutDashboard, label:"Dashboard", page:"dashboard" },
    { icon:Heart, label:"Health & Wellness", page:"wellness", group:"Wellness" },
    { icon:Bell, label:"Notifications", page:"notifications" },
    { icon:Settings, label:"Settings", page:"settings" },
  ],
  timekeeping: [
    { icon:LayoutDashboard, label:"Dashboard", page:"dashboard" },
    { icon:Clock, label:"Scheduling & Timekeeping", page:"attendance", group:"Timekeeping" },
    { icon:BarChart2, label:"Reports", page:"reports", group:"Timekeeping" },
    { icon:Bell, label:"Notifications", page:"notifications" },
    { icon:Settings, label:"Settings", page:"settings" },
  ],
  leave_management: [
    { icon:LayoutDashboard, label:"Dashboard", page:"dashboard" },
    { icon:Calendar, label:"Leave Management", page:"leave", group:"Leave" },
    { icon:BarChart2, label:"Reports", page:"reports", group:"Leave" },
    { icon:Bell, label:"Notifications", page:"notifications" },
    { icon:Settings, label:"Settings", page:"settings" },
  ],
  management: [
    { icon:LayoutDashboard, label:"Executive Dashboard", page:"dashboard" },
    { icon:BarChart2, label:"Reports & Analytics", page:"reports", group:"Analytics" },
    { icon:Shield, label:"Audit Trail", page:"audit", group:"Analytics" },
    { icon:Users, label:"Employee Overview", page:"employees", group:"Operations" },
    { icon:Calendar, label:"Leave Management", page:"leave", group:"Operations" },
    { icon:Target, label:"Performance", page:"performance", group:"Operations" },
    { icon:Bell, label:"Notifications", page:"notifications" },
  ],
  employee: [
    { icon:LayoutDashboard, label:"My Dashboard", page:"dashboard" },
    { icon:User, label:"My PDS", page:"profile", group:"My Information" },
    { icon:Wallet, label:"Payslip & Contributions", page:"payslip", group:"Pay & Time" },
    { icon:Clock, label:"Schedule & DTR", page:"attendance", group:"Pay & Time" },
    { icon:Calendar, label:"Leave & Requests", page:"leave", group:"Pay & Time" },
    { icon:Briefcase, label:"Job Vacancies", page:"recruitment", group:"Applications" },
    { icon:Target, label:"Development & IPCR", page:"performance", group:"Applications" },
    { icon:GraduationCap, label:"Training & Seminars", page:"training", group:"Applications" },
    { icon:Send, label:"Other Applications", page:"wellness", group:"Applications" },
    { icon:Bell, label:"Memos & Alerts", page:"notifications", group:"Updates" },
  ],
  faculty_management: [
    { icon:LayoutDashboard, label:"Dashboard", page:"dashboard" },
    { icon:Users, label:"Employee Records", page:"employees", group:"Faculty" },
    { icon:BookOpen, label:"Faculty Profile", page:"faculty", group:"Academic" },
    { icon:BarChart2, label:"Reports", page:"reports", group:"Academic" },
    { icon:Bell, label:"Notifications", page:"notifications" },
    { icon:Settings, label:"Settings", page:"settings" },
  ],
};

const ROLE_LABELS: Record<Role,string> = {
  admin:"System Administrator",
  hr_records:"HR Records Staff",
  timekeeping:"Timekeeping Staff",
  leave_management:"Leave Management Staff",
  payroll:"Payroll Staff",
  recruitment:"Recruitment Staff",
  training:"Training Staff",
  performance:"Performance Management Staff",
  rewards:"Rewards and Recognition Staff",
  wellness:"Health and Wellness Staff",
  management:"Management / Executive",
  employee:"Employee / Faculty",
  faculty_management:"Faculty Management Staff",
};

function Sidebar({ currentPage, setCurrentPage, role, collapsed, setCollapsed, currentUser }: {
  currentPage:Page; setCurrentPage:(p:Page)=>void; role:Role; collapsed:boolean; setCollapsed:(v:boolean)=>void;
  currentUser: UserAccount | null;
}) {
  const items = NAV[role] || NAV.admin;
  const card = PORTAL_CARDS.find(c=>c.role===role);
  const roleColor = card?.color || "#1B3A6B";

  return (
    <div className={`${collapsed?"w-16":"w-64"} shrink-0 flex flex-col h-screen border-r border-border transition-all duration-200 bg-sidebar`}>
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
        <div className="w-8 h-8 shrink-0 flex items-center justify-center">
          <ImageWithFallback src={logoImg} alt="PNU" className="w-8 h-8 object-contain"/>
        </div>
        {!collapsed && <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-xs leading-tight truncate">PNU HRIPS</p>
          <p className="text-white/40 text-[10px] truncate">v2024.08 · Enterprise</p>
        </div>}
        <button onClick={()=>setCollapsed(!collapsed)} className="text-white/40 hover:text-white transition-colors shrink-0">
          <ChevronRight className={`w-4 h-4 transition-transform ${collapsed?"":"rotate-180"}`}/>
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && card && (
        <div className="mx-3 my-2 px-3 py-2 rounded-xl flex items-center gap-2.5" style={{backgroundColor:roleColor+"25",border:`1px solid ${roleColor}40`}}>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor:roleColor+"30"}}>
            <card.icon className="w-3.5 h-3.5 text-white"/>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-[10px] font-bold truncate leading-tight">{ROLE_LABELS[role]}</p>
            <p className="text-white/40 text-[10px] truncate">Portal Access</p>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {items.map((item, idx) => {
          const prevItem = items[idx-1];
          const showGroup = item.group && item.group !== prevItem?.group;
          return (
            <div key={`${item.page}-${idx}`}>
              {showGroup && !collapsed && (
                <p className="text-white/25 text-[10px] font-semibold uppercase tracking-widest px-3 mt-3.5 mb-1">{item.group}</p>
              )}
              <button onClick={()=>setCurrentPage(item.page)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${currentPage===item.page?"text-white shadow-sm":"text-white/50 hover:text-white hover:bg-white/10"}`}
                style={currentPage===item.page?{ backgroundColor:"rgba(200,168,75,0.2)", color:"#C8A84B" }:{}}
                title={collapsed?item.label:undefined}>
                <item.icon className="w-4 h-4 shrink-0"/>
                {!collapsed && <span className="truncate text-xs">{item.label}</span>}
              </button>
            </div>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor:roleColor+"40" }}>
              {(currentUser?.fullName||ROLE_LABELS[role]).split(" ").filter(w=>/^[A-Z]/.test(w)).slice(0,2).map(w=>w[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{currentUser?.fullName||ROLE_LABELS[role]}</p>
              <p className="text-white/30 text-[10px] truncate">{currentUser?.email||"pnu@pnu.edu.ph"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TopBar({ role, currentPage, unreadCount, onNotifClick, onLogout, currentUser }: {
  role:Role; currentPage:Page; unreadCount:number; onNotifClick:()=>void; onLogout:()=>void;
  currentUser: UserAccount | null;
}) {
  const titles: Record<Page,string> = {
    dashboard:"Dashboard", employees:"Employee Management", "hr-records":"PDS & Personnel Records", "employee-detail":"Employee Profile",
    payroll:"Payroll Processing", payslip:"Payslip Viewer", leave:"Leave Management",
    attendance:"Attendance & DTR", reports:"Reports & Analytics", notifications:"Notifications",
    settings:"Settings", audit:"Audit Trail", profile:"My Profile",
    recruitment:"Recruitment, Selection & Placement",
    training:"Learning & Development",
    performance:"Performance Management (IPCR / OPCR)",
    rewards:"Rewards & Recognition",
    wellness:"Health & Wellness",
    faculty:"Faculty Management",
  };
  const card = PORTAL_CARDS.find(c=>c.role===role);
  const initials = (currentUser?.fullName||ROLE_LABELS[role]).split(" ").filter(w=>/^[A-Z]/.test(w)).slice(0,2).map(w=>w[0]).join("");
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-white/90 backdrop-blur shrink-0">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{titles[currentPage]||"Dashboard"}</h2>
        <p className="text-xs text-muted-foreground">Philippine Normal University · {ROLE_LABELS[role]}</p>
      </div>
      <div className="flex items-center gap-1">
        {card && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border mr-2" style={{backgroundColor:card.color+"08",borderColor:card.color+"25"}}>
            <card.icon className="w-3 h-3" style={{color:card.color}}/>
            <span className="text-[11px] font-medium" style={{color:card.color}}>{card.shortTitle}</span>
          </div>
        )}
        <button onClick={onNotifClick} className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell style={{width:17,height:17}} className="text-foreground"/>
          {unreadCount>0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold leading-none">{unreadCount}</span>}
        </button>
        <button onClick={onLogout} className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 text-muted-foreground transition-colors" title="Sign out">
          <LogOut className="w-4 h-4"/>
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-white text-xs font-bold ml-1" style={{ backgroundColor: card?.color || "#1B3A6B" }}>
          {initials||"U"}
        </div>
      </div>
    </div>
  );
}

// ── EMPLOYEE FORM ─────────────────────────────────────────
function EmployeeForm({ initial, onSave, onClose }: {
  initial?: Partial<Employee>;
  onSave: (f: Partial<Employee>) => void;
  onClose: () => void;
}) {
  const [f, setF] = useState<Partial<Employee>>(initial || EMPTY_EMP);
  const set = (k: keyof Employee, v: string | number) => setF(prev => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">Last Name *</label><input value={f.lastName||""} onChange={e=>set("lastName",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">First Name *</label><input value={f.firstName||""} onChange={e=>set("firstName",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">Middle Name</label><input value={f.middleName||""} onChange={e=>set("middleName",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">Gender</label>
          <select value={f.gender||"Female"} onChange={e=>set("gender",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50">
            <option>Female</option><option>Male</option>
          </select>
        </div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">Birth Date</label><input type="date" value={f.birthDate||""} onChange={e=>set("birthDate",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">Date Hired</label><input type="date" value={f.dateHired||""} onChange={e=>set("dateHired",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div className="col-span-2"><label className="block text-xs font-medium text-muted-foreground mb-1">Position *</label><input value={f.position||""} onChange={e=>set("position",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div className="col-span-2"><label className="block text-xs font-medium text-muted-foreground mb-1">Rank / Item</label><input value={f.rank||""} onChange={e=>set("rank",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div className="col-span-2"><label className="block text-xs font-medium text-muted-foreground mb-1">Department / College</label>
          <select value={f.department||DEPTS[0]} onChange={e=>set("department",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50">
            {DEPTS.map(d=><option key={d}>{d}</option>)}
          </select>
        </div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">Employment Type</label>
          <select value={f.employmentType||"Permanent"} onChange={e=>set("employmentType",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50">
            <option>Permanent</option><option>Temporary</option><option>Casual</option><option>Contractual</option><option>Job Order</option><option>COS</option><option>Part-time</option>
          </select>
        </div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
          <select value={f.status||"Active"} onChange={e=>set("status",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50">
            <option>Active</option><option>Inactive</option><option>On Leave</option><option>Suspended</option><option>Retired</option>
          </select>
        </div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">Salary Grade (1-33)</label><input type="number" min={1} max={33} value={f.salaryGrade||1} onChange={e=>set("salaryGrade",parseInt(e.target.value)||1)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">Step (1-8)</label><input type="number" min={1} max={8} value={f.step||1} onChange={e=>set("step",parseInt(e.target.value)||1)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">Monthly Salary (₱)</label><input type="number" value={f.monthlySalary||0} onChange={e=>set("monthlySalary",parseFloat(e.target.value)||0)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">Email</label><input type="email" value={f.email||""} onChange={e=>set("email",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">Phone</label><input value={f.phone||""} onChange={e=>set("phone",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div className="col-span-2"><label className="block text-xs font-medium text-muted-foreground mb-1">Home Address</label><input value={f.address||""} onChange={e=>set("address",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div className="col-span-2"><label className="block text-xs font-medium text-muted-foreground mb-1">Education</label><input value={f.education||""} onChange={e=>set("education",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">Eligibility</label><input value={f.eligibility||""} onChange={e=>set("eligibility",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">Work Experience</label><input value={f.workExperience||""} onChange={e=>set("workExperience",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">TIN</label><input value={f.tin||""} onChange={e=>set("tin",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">GSIS No.</label><input value={f.gsis||""} onChange={e=>set("gsis",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">PhilHealth No.</label><input value={f.philhealth||""} onChange={e=>set("philhealth",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">Pag-IBIG No.</label><input value={f.pagibig||""} onChange={e=>set("pagibig",e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">Vacation Leave (days)</label><input type="number" value={f.vacationLeave||0} onChange={e=>set("vacationLeave",parseInt(e.target.value)||0)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
        <div><label className="block text-xs font-medium text-muted-foreground mb-1">Sick Leave (days)</label><input type="number" value={f.sickLeave||0} onChange={e=>set("sickLeave",parseInt(e.target.value)||0)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"/></div>
      </div>
      <div className="flex justify-end gap-2 pt-2 border-t border-border">
        <Btn variant="outline" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => {
          if (!f.lastName?.trim() || !f.firstName?.trim() || !f.position?.trim()) {
            alert("Please fill in Last Name, First Name, and Position."); return;
          }
          onSave(f);
        }}>Save Employee</Btn>
      </div>
    </div>
  );
}

// ── EMPLOYEE LIST ─────────────────────────────────────────
function EmployeeList({ setPage, setSelEmp, employees, onAdd, onEdit, onDelete, canDelete=true }: {
  setPage:(p:Page)=>void; setSelEmp:(e:Employee)=>void;
  employees:Employee[];
  onAdd:(f:Partial<Employee>)=>void;
  onEdit:(updated:Employee)=>void;
  onDelete:(id:string)=>void;
  canDelete?:boolean;
}) {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All Departments");
  const [statusF, setStatusF] = useState("All");
  const [typeF, setTypeF] = useState("All");
  const [pg, setPg] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [editEmp, setEditEmp] = useState<Employee|null>(null);
  const [deleteEmp, setDeleteEmp] = useState<Employee|null>(null);
  const PER=8;

  const filtered=useMemo(()=>employees.filter(e=>{
    const q=search.toLowerCase();
    return (!q||e.fullName.toLowerCase().includes(q)||e.employeeNo.toLowerCase().includes(q)||e.position.toLowerCase().includes(q))
      &&(dept==="All Departments"||e.department===dept)
      &&(statusF==="All"||e.status===statusF)
      &&(typeF==="All"||e.employmentType===typeF);
  }),[employees,search,dept,statusF,typeF]);

  const total=Math.ceil(filtered.length/PER)||1;
  const paged=filtered.slice((pg-1)*PER,pg*PER);

  return (
    <div>
      <SectionHeader title="Employee Management" subtitle={`${employees.length} total employees · Philippine Normal University`}
        action={<Btn onClick={()=>setShowAdd(true)}><Plus className="w-4 h-4"/>Add Employee</Btn>}/>
      <div className="bg-card rounded-xl border border-border p-4 mb-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground"/>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPg(1);}} placeholder="Search name, employee no., position..."
              className="w-full bg-muted/50 rounded-lg pl-8 pr-3 py-2 text-sm border border-transparent focus:border-primary/20 focus:outline-none"/>
          </div>
          <select value={dept} onChange={e=>{setDept(e.target.value);setPg(1);}} className="bg-muted/50 rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/20 focus:outline-none text-foreground">
            {DEPTS_FILTER.slice(0,8).map(d=><option key={d}>{d}</option>)}
          </select>
          <select value={statusF} onChange={e=>{setStatusF(e.target.value);setPg(1);}} className="bg-muted/50 rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/20 focus:outline-none">
            {["All","Active","On Leave","Inactive","Retired"].map(s=><option key={s}>{s}</option>)}
          </select>
          <select value={typeF} onChange={e=>{setTypeF(e.target.value);setPg(1);}} className="bg-muted/50 rounded-lg px-3 py-2 text-sm border border-transparent focus:border-primary/20 focus:outline-none">
            {["All","Permanent","Temporary","Casual","Contractual","Job Order","COS","Part-time"].map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        {(search||dept!=="All Departments"||statusF!=="All"||typeF!=="All")&&(
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">{filtered.length} result{filtered.length!==1?"s":""} found</span>
            <button onClick={()=>{setSearch("");setDept("All Departments");setStatusF("All");setTypeF("All");setPg(1);}} className="text-xs hover:underline" style={{color:"#C8A84B"}}>Clear filters</button>
          </div>
        )}
      </div>
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Department</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">SG / Salary</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paged.map(e=>(
                <tr key={e.id} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={()=>{setSelEmp(e);setPage("employee-detail");}}>
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><Av name={e.fullName} color={e.color} size="sm"/><div className="min-w-0"><p className="text-sm font-medium text-foreground truncate">{e.fullName}</p><p className="text-xs text-muted-foreground font-mono">{e.employeeNo}</p></div></div></td>
                  <td className="px-4 py-3 hidden md:table-cell"><p className="text-sm text-foreground truncate max-w-[160px]">{e.department}</p></td>
                  <td className="px-4 py-3 hidden lg:table-cell"><Badge variant={e.employmentType}>{e.employmentType}</Badge></td>
                  <td className="px-4 py-3 hidden lg:table-cell"><p className="text-sm font-mono">SG-{e.salaryGrade}/Step {e.step}</p><p className="text-xs text-muted-foreground font-mono">{fc(e.monthlySalary)}</p></td>
                  <td className="px-4 py-3"><Badge variant={e.status}>{e.status}</Badge></td>
                  <td className="px-4 py-3" onClick={ev=>ev.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={()=>{setSelEmp(e);setPage("employee-detail");}} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-[#C8A84B] transition-colors" title="View"><Eye className="w-4 h-4"/></button>
                      <button onClick={()=>setEditEmp(e)} className="p-1.5 rounded-lg hover:bg-amber-50 text-muted-foreground hover:text-amber-600 transition-colors" title="Edit"><Edit2 className="w-4 h-4"/></button>
                      {canDelete&&<button onClick={()=>setDeleteEmp(e)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors" title="Delete"><Trash2 className="w-4 h-4"/></button>}
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length===0&&<tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">No employees found.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">Showing {filtered.length===0?0:Math.min((pg-1)*PER+1,filtered.length)}–{Math.min(pg*PER,filtered.length)} of {filtered.length}</p>
          <div className="flex items-center gap-1">
            <button onClick={()=>setPg(p=>Math.max(1,p-1))} disabled={pg===1} className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-40"><ChevronLeft className="w-4 h-4"/></button>
            {Array.from({length:Math.min(total,5)},(_,i)=>i+1).map(n=>(
              <button key={n} onClick={()=>setPg(n)} className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${n===pg?"text-white":"hover:bg-muted text-muted-foreground"}`} style={n===pg?{backgroundColor:"#C8A84B",color:"#0B1120"}:{}}>{n}</button>
            ))}
            <button onClick={()=>setPg(p=>Math.min(total,p+1))} disabled={pg===total} className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-40"><ChevronRight className="w-4 h-4"/></button>
          </div>
        </div>
      </div>
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add New Employee" size="lg">
        <EmployeeForm onSave={f=>{onAdd(f);setShowAdd(false);}} onClose={()=>setShowAdd(false)}/>
      </Modal>
      <Modal open={!!editEmp} onClose={()=>setEditEmp(null)} title={`Edit — ${editEmp?.fullName||""}`} size="lg">
        {editEmp&&<EmployeeForm initial={editEmp} onSave={f=>{onEdit({...editEmp,...f} as Employee);setEditEmp(null);}} onClose={()=>setEditEmp(null)}/>}
      </Modal>
      <Modal open={!!deleteEmp} onClose={()=>setDeleteEmp(null)} title="Confirm Delete" size="sm">
        {deleteEmp&&(
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5"/>
              <div>
                <p className="text-sm font-semibold text-foreground">Delete employee record?</p>
                <p className="text-xs text-muted-foreground mt-1">{deleteEmp.fullName} ({deleteEmp.employeeNo}) will be permanently removed from the system.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Btn variant="outline" onClick={()=>setDeleteEmp(null)}>Cancel</Btn>
              <Btn variant="destructive" onClick={()=>{onDelete(deleteEmp.id);setDeleteEmp(null);}}>
                <Trash2 className="w-4 h-4"/>Delete
              </Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ── EMPLOYEE DETAIL ───────────────────────────────────────
function EmployeeDetail({ employee, setPage, leaves, dtr, onEdit }: {
  employee:Employee; setPage:(p:Page)=>void;
  leaves:LeaveRequest[]; dtr:DtrRecord[];
  onEdit:(updated:Employee)=>void;
}) {
  const [tab, setTab] = useState("personal");
  const [showEdit, setShowEdit] = useState(false);
  const ps=computePayslip(employee.monthlySalary);
  const empLeaves=leaves.filter(l=>l.employeeId===employee.id);
  const empAtt=dtr.filter(a=>a.employeeId===employee.id);
  const tabs=[{id:"personal",label:"Personal Info"},{id:"employment",label:"Employment"},{id:"training",label:"Training & Onboarding"},{id:"payroll",label:"Payroll"},{id:"leave",label:"Leave Credits"},{id:"attendance",label:"Attendance"}];

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={()=>setPage("employees")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#C8A84B] transition-colors"><ChevronLeft className="w-4 h-4"/>Back to Employees</button>
        <div className="ml-auto"><Btn size="sm" onClick={()=>setShowEdit(true)}><Edit2 className="w-3.5 h-3.5"/>Edit Profile</Btn></div>
      </div>
      <div className="bg-card rounded-xl border border-border p-6 mb-4 shadow-sm">
        <div className="flex items-start gap-5 flex-wrap">
          <Av name={employee.fullName} color={employee.color} size="xl"/>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-xl font-bold text-foreground">{employee.fullName}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{employee.position}</p>
                <p className="text-sm text-muted-foreground">{employee.department}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant={employee.status}>{employee.status}</Badge>
                <Badge variant={employee.employmentType}>{employee.employmentType}</Badge>
                <Badge variant="gold">SG-{employee.salaryGrade} Step {employee.step}</Badge>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="w-3.5 h-3.5"/>{employee.email||"—"}</div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="w-3.5 h-3.5"/>{employee.phone||"—"}</div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Briefcase className="w-3.5 h-3.5"/>Since {fd(employee.dateHired)}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-1 mb-4 bg-muted/40 p-1 rounded-xl border border-border overflow-x-auto">
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${tab===t.id?"bg-muted/60 text-[#C8A84B] shadow-sm":"text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        {tab==="personal"&&(
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {[["Employee No.",employee.employeeNo],["Full Name",employee.fullName],["Gender",employee.gender],["Birth Date",fdLong(employee.birthDate)],["TIN",employee.tin||"—"],["GSIS No.",employee.gsis||"—"],["PhilHealth No.",employee.philhealth||"—"],["Pag-IBIG No.",employee.pagibig||"—"]].map(([label,val])=>(
              <div key={label} className="border-b border-border/50 pb-3"><p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p><p className="text-sm font-medium text-foreground font-mono">{val}</p></div>
            ))}
          </div>
        )}
        {tab==="employment"&&(
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {[["Position",employee.position],["Rank",employee.rank],["Department",employee.department],["Employment Type",employee.employmentType],["Salary Grade",`SG-${employee.salaryGrade}`],["Step",String(employee.step)],["Monthly Salary",fc(employee.monthlySalary)],["Date Hired",fdLong(employee.dateHired)],["Onboarding Status",employee.onboardingStatus||"Not Started"]].map(([label,val])=>(
              <div key={label} className="border-b border-border/50 pb-3"><p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p><p className="text-sm font-medium">{val}</p></div>
            ))}
          </div>
        )}
        {tab==="training"&&(
          <div className="space-y-4">
            <div><h3 className="text-sm font-semibold">Training Records in Personal Data Sheet</h3><p className="text-xs text-muted-foreground mt-1">Approved training nominations and completed onboarding trainings are synchronized to this employee record.</p></div>
            {employee.trainingRecords?.length?<ul className="list-disc pl-5 space-y-2">{employee.trainingRecords.map((record,index)=><li key={`${record}-${index}`} className="text-sm">{record}</li>)}</ul>:<p className="text-xs text-muted-foreground">No approved training records have been synchronized.</p>}
            <div className="border-t border-border pt-3"><p className="text-xs text-muted-foreground">Onboarding status: <strong className="text-foreground">{employee.onboardingStatus||"Not Started"}</strong></p></div>
          </div>
        )}
        {tab==="payroll"&&(
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Gross Pay" value={fc(ps.grossPay)} icon={Wallet} color="blue"/>
              <StatCard label="Net Pay" value={fc(ps.netPay)} icon={CreditCard} color="green"/>
              <StatCard label="Total Deductions" value={fc(ps.totalDeductions)} icon={Calculator} color="red"/>
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full">
                <thead><tr className="bg-muted/40"><th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Deduction</th><th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">Basis</th><th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Amount</th></tr></thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="px-4 py-3 text-sm">GSIS</td><td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">9% of Gross</td><td className="px-4 py-3 text-sm font-mono text-right text-red-600">{fc(ps.gsis)}</td></tr>
                  <tr><td className="px-4 py-3 text-sm">PhilHealth</td><td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">2% of Gross, max ₱1,800</td><td className="px-4 py-3 text-sm font-mono text-right text-red-600">{fc(ps.philhealth)}</td></tr>
                  <tr><td className="px-4 py-3 text-sm">Pag-IBIG</td><td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">Fixed ₱100.00</td><td className="px-4 py-3 text-sm font-mono text-right text-red-600">{fc(ps.pagibig)}</td></tr>
                  <tr><td className="px-4 py-3 text-sm">Withholding Tax</td><td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">TRAIN Law brackets</td><td className="px-4 py-3 text-sm font-mono text-right text-red-600">{fc(ps.tax)}</td></tr>
                  <tr className="bg-muted/30 font-bold"><td className="px-4 py-3 text-sm" colSpan={2}>Net Pay</td><td className="px-4 py-3 text-base font-mono text-right text-green-600">{fc(ps.netPay)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tab==="leave"&&(
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Vacation Leave" value={`${employee.vacationLeave} days`} icon={Calendar} color="blue"/>
              <StatCard label="Sick Leave" value={`${employee.sickLeave} days`} icon={Clock} color="green"/>
              <StatCard label="Used VL (YTD)" value="5 days" icon={CheckCircle} color="gold"/>
              <StatCard label="Used SL (YTD)" value="3 days" icon={CheckCircle} color="purple"/>
            </div>
            {empLeaves.length===0?<div className="text-center py-8 text-sm text-muted-foreground bg-muted/20 rounded-xl border border-border">No leave records found.</div>:(
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full">
                  <thead><tr className="bg-muted/40"><th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Type</th><th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Period</th><th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Days</th><th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Status</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    {empLeaves.map(lr=><tr key={lr.id}><td className="px-4 py-3 text-sm">{lr.leaveType}</td><td className="px-4 py-3 text-xs text-muted-foreground">{fd(lr.startDate)} – {fd(lr.endDate)}</td><td className="px-4 py-3 text-sm font-mono">{lr.days}</td><td className="px-4 py-3"><Badge variant={lr.status}>{lr.status}</Badge></td></tr>)}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {tab==="attendance"&&(
          <div>
            <h3 className="text-sm font-semibold mb-4">Attendance — Week of Aug 12–16, 2024</h3>
            {empAtt.length===0?<div className="text-center py-8 text-sm text-muted-foreground bg-muted/20 rounded-xl border border-border">No attendance records found.</div>:(
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full">
                  <thead><tr className="bg-muted/40"><th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Date</th><th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Time In</th><th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Time Out</th><th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">OT (min)</th><th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Status</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    {empAtt.map((a,i)=>(
                      <tr key={i} className="hover:bg-muted/20">
                        <td className="px-4 py-3 text-sm font-mono">{fd(a.date)}</td>
                        <td className="px-4 py-3 text-sm font-mono">{a.timeIn||"—"}</td>
                        <td className="px-4 py-3 text-sm font-mono">{a.timeOut||"—"}</td>
                        <td className="px-4 py-3 text-sm font-mono">{a.overtime>0?a.overtime:"—"}</td>
                        <td className="px-4 py-3"><Badge variant={a.status}>{a.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      <Modal open={showEdit} onClose={()=>setShowEdit(false)} title={`Edit — ${employee.fullName}`} size="lg">
        <EmployeeForm initial={employee} onSave={f=>{onEdit({...employee,...f} as Employee);setShowEdit(false);}} onClose={()=>setShowEdit(false)}/>
      </Modal>
    </div>
  );
}

function PayrollDatabaseStatus(){
 const [status,setStatus]=useState<{connected?:boolean;schemaReady?:boolean;message?:string;checkedAt?:string}|null>(null);
 useEffect(()=>{let active=true;void fetch("/api/database-status",{cache:"no-store"}).then(async r=>{const data=await r.json();if(active)setStatus(data);}).catch(()=>{if(active)setStatus({connected:false,message:"Unable to check database connection"});});return()=>{active=false;};},[]);
 return <div className="mb-4 rounded-xl border border-border bg-card px-4 py-3 text-xs"><div className="flex flex-wrap items-center justify-between gap-2"><span className="font-semibold">Neon PostgreSQL database</span><span className={status?.connected&&status?.schemaReady?"text-green-700":"text-amber-700"}>{!status?"Checking connection…":status.connected&&status.schemaReady?"Connected · schema ready":"Connection or schema needs attention"}</span></div><p className="text-muted-foreground mt-1">Actual PNU employee and payroll data have not been imported. This screen uses local storage for payroll changes; use the secure payroll workspace for database-backed periods and employee records. Payroll calculations and release are not yet enabled.</p></div>;
}

function ScholarshipPayrollDraft() {
  const [month, setMonth] = useState("");
  const [student, setStudent] = useState("");
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");
  const [rows, setRows] = useState<{id: number; student: string; reference: string; cents: number}[]>([]);
  const nextId = useRef(0);
  const report = useRef<HTMLDivElement>(null);
  const [printError, setPrintError] = useState("");
  const total = rows.reduce((sum, row) => sum + row.cents, 0);
  const pesos = (cents: number) => (cents / 100).toLocaleString("en-PH", {style:"currency", currency:"PHP"});
  const canPrint = Boolean(month && rows.length);

  function addPayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cents = Math.round(Number(amount) * 100);
    if (!student.trim() || !reference.trim() || !Number.isSafeInteger(cents + total) || cents <= 0) return;
    const id = ++nextId.current;
    setRows(current => [...current, {id, student:student.trim(), reference:reference.trim(), cents}]);
    setStudent("");
    setReference("");
    setAmount("");
  }

  function printDraft() {
    if (!canPrint || !report.current) return;
    const preview = window.open("", "_blank");
    if (!preview) {
      setPrintError("Allow pop-ups for this site, then try printing again.");
      return;
    }
    setPrintError("");
    preview.opener = null;
    preview.document.title = "PNU Student Scholarship Payroll Draft";
    const style = preview.document.createElement("style");
    style.textContent = "body{font:11pt Arial,sans-serif;margin:20mm;color:black}table{width:100%;border-collapse:collapse}th,td{border:1px solid black;padding:8px;text-align:left}th:last-child,td:last-child{text-align:right}td:last-child{white-space:nowrap}tr{break-inside:avoid}@media print{.draft-actions{display:none}}";
    preview.document.head.append(style);
    const copy = preview.document.importNode(report.current, true);
    copy.querySelectorAll(".draft-actions").forEach(cell => cell.remove());
    preview.document.body.append(copy);
    preview.print();
  }

  return (
    <div className="mt-3 space-y-3">
      <p className="text-muted-foreground">Enter approved scholarship amounts and their award references. Keep this page open until you print or save the draft as PDF.</p>
      <label className="grid gap-1">Payroll month
        <input type="month" value={month} onChange={event => setMonth(event.target.value)} className="rounded border border-border bg-card p-2" />
      </label>
      <form onSubmit={addPayment} className="grid gap-2">
        <label className="grid gap-1">Student name or ID
          <input required maxLength={120} value={student} onChange={event => setStudent(event.target.value)} className="rounded border border-border bg-card p-2" />
        </label>
        <label className="grid gap-1">Scholarship or award reference
          <input required maxLength={120} value={reference} onChange={event => setReference(event.target.value)} className="rounded border border-border bg-card p-2" />
        </label>
        <label className="grid gap-1">Approved amount (PHP)
          <input required type="number" min="0.01" max="999999999.99" step="0.01" value={amount} onChange={event => setAmount(event.target.value)} className="rounded border border-border bg-card p-2" />
        </label>
        <button type="submit" className="justify-self-start rounded border border-border px-3 py-2 font-semibold">Add payment</button>
      </form>
      <div ref={report} className="overflow-x-auto">
        <h4 className="font-semibold">Philippine Normal University · Student Scholarship Payroll Draft</h4>
        <p>Payroll month: {month || "Select month"}</p>
        <table className="mt-2 w-full">
          <thead><tr><th scope="col">Student</th><th scope="col">Award reference</th><th scope="col">Amount</th><th scope="col" className="draft-actions">Action</th></tr></thead>
          <tbody>{rows.map(row => (
            <tr key={row.id} className="border-t border-border">
              <td className="p-1">{row.student}</td><td className="p-1">{row.reference}</td><td className="p-1">{pesos(row.cents)}</td>
              <td className="draft-actions"><button type="button" aria-label={`Remove payment for ${row.student}`} onClick={() => setRows(current => current.filter(item => item.id !== row.id))} className="p-1 underline">Remove</button></td>
            </tr>
          ))}</tbody>
          <tfoot><tr><th scope="row" colSpan={2}>Total ({rows.length} payments)</th><td>{pesos(total)}</td><td className="draft-actions"/></tr></tfoot>
        </table>
      </div>
      <button type="button" disabled={!canPrint} onClick={printDraft} className="rounded border border-border px-3 py-2 font-semibold disabled:opacity-50">Print scholarship draft</button>
      {printError && <p role="alert">{printError}</p>}
    </div>
  );
}

function PayrollRequirementsReference(){
 const groups:Record<string,string[]>={"Payroll processing":["Payroll period management","CSC rules, regulations and policies","Income and benefits management","Deductions management","Loans and payments management","General Payroll","COS and Part-Time Faculty Payroll","Extra-Teaching Load Payroll","Extra-Teaching Differential Payroll","Honoraria Payroll","Student Scholarship Payroll","Hazard Payment","Night Differential","Leave Monetization","Loyalty Incentive Pay","Longevity Incentive Pay","Step Increment"],"Bonuses and allowances":["Mid-year Bonus","Year-end and Cash Gift Bonus","Anniversary Incentive","Affiliation Incentive","Productivity Enhancement Incentive","Clothing Allowance","Medical Allowance","Subsistence and Laundry Allowance","Flexible Learning and Teaching Support Allowance (FLATS)","Athletic Allowance","CNA","Living Quarters Allowance","Perfect Attendance Incentive","Self-Development Incentives","Special Awards Incentive (PRAISE)"],"Review and controls":["Tax Refund and Deficit Adjustment","Review, adjustment and finalization","Payroll locking","Employee exclusion/cancellation","Payroll detail approval","Bulk Uploading of Tax Amount","Re-compute Specific Employee","Exclude Employees on Specific Week Pay","Anticipated Leave Without Pay","Threshold computation for overtime, extra teaching load and honoraria","Honorarium and overtime payment limits"],"Payroll and contribution reports":["Payslip Report","Excluded/Cancelled Employees Report","PHIC Contribution Table","BIR Tax Table","Cover Page","General Payroll Report","LBP Report","Bank Proof List","Summary of Mandatory Deductions","Summary of Salaries, Benefits and Other Allowances","Summary of Payroll","YTD Payroll Register","Hazard Payment Report","Hazard Payment Summary","Year End and Cash Gift Bonus Report","Mid-Year Bonus Report","Clothing Allowance Report","Monetization of Leave Credits Report","Contribution Reports","GSIS Contribution Report","PHIC Contribution Report","PAGIBIG Contribution Report","Tax Contribution Report","Mortuary Deduction","Union Dues","Summary of Employee Payroll Index","Provident Share Reports","Monthly Loans Report","Quarterly and Annual ROSA"],"Remittances and certificates":["Remittance Reports","Withholding Tax Monthly Remittance","PHIC Remittance","PHIC Monthly Remittance","GSIS Remittance","GSIS Monthly Remittance","SSS Remittance","SSS Monthly Remittance","PAGIBIG Remittance","PAGIBIG Monthly Remittance","Loans and Payments Report","Monthly Loan and Payment Report","Certificate of PHIC, PAGIBIG, GSIS Contributions and Loans","Certificate of Last Pay","GSIS Contribution Percentage Settings","PAGIBIG Minimum Contributions Settings","ISO Incentive Payroll and Vouchers","Mandatory Service Retiree Payroll and Vouchers","Land Bank Digital Banking Payroll File","BIR 2316","BIR 2307"]};
 const actions: Record<string, { href: string; label: string; detail: string }> = {
  "Payroll period management": {href:"/secure-payroll", label:"Open secure payroll", detail:"Authorized payroll staff can create draft payroll periods and view saved periods."},
  "CSC rules, regulations and policies": {href:"#csc-salary-calculator", label:"Open CSC salary calculator", detail:"Compute and print a monthly salary adjustment for HR-confirmed leave without pay."},
  "Deductions management": {href:"#csc-employee-deductions", label:"Enter employee deductions", detail:"Enter monthly employee deductions and print the estimated net pay. Entries are for this worksheet."},
  "Payslip Report": {href:"#payroll-run-list", label:"Choose a payroll run", detail:"Use the View button beside a payroll run to open its payslip preview."},
 };
 return (
  <section className="mb-5 rounded-xl border border-border bg-card p-4">
   <h3 className="text-sm font-semibold">PNU Payroll Technical Specifications</h3>
   <p className="mt-1 text-xs text-muted-foreground">Expand a requirement to see its status and open the available workflow.</p>
   <div className="mt-4 grid gap-2">
    {Object.entries(groups).map(([group, items]) => (
     <details key={group} className="rounded-lg border border-border">
      <summary className="cursor-pointer px-3 py-2 text-sm font-semibold">{group} ({items.length})</summary>
      <div className="grid gap-2 px-3 pb-3 md:grid-cols-2">
       {items.map(item => {
        const action = actions[item];
        const scholarship = item === "Student Scholarship Payroll";
        return (
         <details key={item} className="rounded-md border border-border p-2 text-xs">
          <summary className="cursor-pointer font-medium">{item} <span className="ml-1 text-muted-foreground">· {scholarship ? "Draft worksheet" : action ? "Available" : "Pending"}</span></summary>
          {scholarship ? <ScholarshipPayrollDraft/> : <p className="mt-2 text-muted-foreground">{action?.detail ?? "Implementation pending for this requirement."}</p>}
          {action && <a className="mt-2 inline-block font-semibold underline" href={action.href}>{action.label}</a>}
         </details>
        );
       })}
      </div>
     </details>
    ))}
   </div>
  </section>
 );
}

const salaryDeductionLabels = ["BIR withholding tax", "SSS", "GSIS", "PhilHealth", "Pag-IBIG"] as const;

function CscSalaryComputation() {
  const [salary, setSalary] = useState("");
  const [unpaidDays, setUnpaidDays] = useState("0");
  const [employeeName, setEmployeeName] = useState("");
  const [payMonth, setPayMonth] = useState("");
  const [deductions, setDeductions] = useState<Partial<Record<typeof salaryDeductionLabels[number], string>>>({});
  const deductionRows = salaryDeductionLabels.map(label => ({
    label,
    amount: Number(deductions[label] || 0),
  }));
  const totalDeductionCents = deductionRows.reduce((total, {amount}) => total + Math.round(amount * 100), 0);
  const totalDeductions = totalDeductionCents / 100;
  const validDeductions = deductionRows.every(({amount}) =>
    Number.isFinite(amount) && amount >= 0 &&
    Math.abs(amount * 100 - Math.round(amount * 100)) < 0.000001
  );
  const basicSalary = Number(salary);
  const days = Number(unpaidDays);
  const valid = salary !== "" && unpaidDays !== "" && Number.isFinite(basicSalary) &&
    basicSalary > 0 && Number.isFinite(days) && days >= 0 && days <= 22;
  const adjustedSalary = valid ? Math.round((basicSalary * (22 - days) / 22) * 100) / 100 : 0;
  const canPrint = valid && validDeductions && totalDeductionCents <= Math.round(adjustedSalary * 100);
  const netEstimate = (Math.round(adjustedSalary * 100) - totalDeductionCents) / 100;
  const formatSalary = (amount: number) => amount.toLocaleString("en-PH", {
    style: "currency", currency: "PHP",
  });

  return (
    <section id="csc-salary-calculator" className="mb-5 rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold">CSC Salary Computation — Leave Without Pay</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Use HR-confirmed unpaid days after applicable leave credits have been applied. Enter employee-share deductions for the same payroll month.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-xs font-medium">
          Employee name
          <input value={employeeName} onChange={event => setEmployeeName(event.target.value)}
            className="rounded-lg border border-border px-3 py-2" />
        </label>
        <label className="grid gap-1 text-xs font-medium">
          Payroll month
          <input type="month" value={payMonth} onChange={event => setPayMonth(event.target.value)}
            className="rounded-lg border border-border px-3 py-2" />
        </label>
        <label className="grid gap-1 text-xs font-medium">
          Monthly basic salary (PHP)
          <input type="number" min="0.01" step="0.01" value={salary}
            onChange={event => setSalary(event.target.value)} className="rounded-lg border border-border px-3 py-2" />
        </label>
        <label className="grid gap-1 text-xs font-medium">
          Confirmed unpaid days (0–22)
          <input type="number" min="0" max="22" step="any" value={unpaidDays}
            onChange={event => setUnpaidDays(event.target.value)} className="rounded-lg border border-border px-3 py-2" />
        </label>
      </div>
      <fieldset id="csc-employee-deductions" className="mt-4">
        <legend className="text-xs font-semibold">Employee deductions (PHP)</legend>
        <p className="mt-1 text-xs text-muted-foreground">Enter the recorded amounts for this month. Leave items that do not apply blank.</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {salaryDeductionLabels.map(label => (
            <label key={label} className="grid gap-1 text-xs font-medium">
              {label}
              <input type="number" min="0" step="0.01" placeholder="0.00" value={deductions[label] ?? ""}
                onChange={event => setDeductions({...deductions, [label]:event.target.value})}
                className="rounded-lg border border-border px-3 py-2" />
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-3 text-sm" aria-live="polite">
        {valid ? (
          <>
            <p>Salary deduction: <strong>{formatSalary(basicSalary - adjustedSalary)}</strong></p>
            <p>Adjusted basic salary: <strong>{formatSalary(adjustedSalary)}</strong></p>
            {canPrint ? (
              <>
                <p>Total employee deductions: <strong>{formatSalary(totalDeductions)}</strong></p>
                <p>Estimated net pay: <strong>{formatSalary(netEstimate)}</strong></p>
              </>
            ) : (
              <p className="text-red-700">Enter nonnegative amounts with up to two decimal places. Total deductions must fit within the adjusted basic salary.</p>
            )}
          </>
        ) : <p className="text-muted-foreground">Enter a positive monthly salary and 0 to 22 unpaid days.</p>}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Adjusted salary = monthly basic salary × (22 − unpaid days) ÷ 22.
        {" "}
        <a className="underline" href="https://www.csc.gov.ph/phocadownload/userupload/irmo/mc/2014/mc08%20s.%202014.pdf"
          target="_blank" rel="noreferrer">CSC MC No. 08, s. 2014</a>
      </p>
      <button type="button" disabled={!canPrint} onClick={() => window.print()}
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold disabled:opacity-50">
        <Printer className="h-4 w-4" />Print CSC Salary Computation
      </button>
      {canPrint && createPortal(
        <article id="csc-salary-print" style={{display:"none"}}>
          <style>{`@media print {
            body:has(> #csc-salary-print) > :not(#csc-salary-print) { display:none !important; }
            #csc-salary-print { display:block !important; background:white; color:black; padding:12mm; font:11pt Arial,sans-serif; }
            #csc-salary-print table { width:100%; border-collapse:collapse; margin:16px 0; }
            #csc-salary-print th, #csc-salary-print td { border:1px solid black; padding:8px; }
          }`}</style>
          <header style={{textAlign:"center"}}>
            <p>Republic of the Philippines</p>
            <p><strong>Philippine Normal University</strong></p>
            <h1 style={{fontSize:"16pt", marginTop:12}}>Salary Computation — Leave Without Pay</h1>
            <p>CSC Memorandum Circular No. 08, s. 2014</p>
          </header>
          <p style={{marginTop:16}}>Employee: {employeeName.trim() || "________________________"}</p>
          <p>Payroll month: {payMonth || "________________________"}</p>
          <table>
            <thead><tr><th scope="col">Computation details</th><th scope="col">Value</th></tr></thead>
            <tbody>
              <tr><th scope="row">Monthly basic salary</th><td>{formatSalary(basicSalary)}</td></tr>
              <tr><th scope="row">Standard days</th><td>22</td></tr>
              <tr><th scope="row">Confirmed days without pay</th><td>{days}</td></tr>
              <tr><th scope="row">Days in paid status</th><td>{(22 - days).toLocaleString("en-PH", {maximumFractionDigits: 12})}</td></tr>
              <tr><th scope="row">Salary deduction</th><td>{formatSalary(basicSalary - adjustedSalary)}</td></tr>
              <tr><th scope="row">Adjusted basic salary</th><td><strong>{formatSalary(adjustedSalary)}</strong></td></tr>
              {deductionRows.filter(({amount}) => amount > 0).map(({label, amount}) => (
                <tr key={label}><th scope="row">{label}</th><td>{formatSalary(amount)}</td></tr>
              ))}
              <tr><th scope="row">Total employee deductions</th><td>{formatSalary(totalDeductions)}</td></tr>
              <tr><th scope="row">Estimated net pay</th><td><strong>{formatSalary(netEstimate)}</strong></td></tr>
            </tbody>
          </table>
          <p>Formula: (Days in paid status ÷ 22) × Monthly basic salary</p>
          <p>Monthly estimate based on the employee deductions entered above.</p>
          <div style={{display:"flex", justifyContent:"space-between", marginTop:48}}>
            <p>Prepared by: ____________________</p>
            <p>Reviewed by: ____________________</p>
          </div>
        </article>,
        document.body,
      )}
    </section>
  );
}

// ── PAYROLL LIST ──────────────────────────────────────────
function PayrollList({ setPage, setSelPay, payrolls, onStatusChange }: {
  setPage:(p:Page)=>void; setSelPay:(p:PayrollRun)=>void;
  payrolls:PayrollRun[];
  onStatusChange:(id:string, next:PayrollRun["status"])=>void;
}) {
  const [statusF, setStatusF] = useState("All");
  const [showProcess, setShowProcess] = useState(false);
  const [confirmPay, setConfirmPay] = useState<{pr:PayrollRun;next:PayrollRun["status"]}|null>(null);
  const filtered = statusF==="All"?payrolls:payrolls.filter(p=>p.status===statusF);
  const forApproval = payrolls.filter(p=>p.status==="For Approval").length;

  const nextStatus: Partial<Record<PayrollRun["status"],PayrollRun["status"]>> = {
    "Draft":"For Approval", "For Approval":"Approved", "Approved":"Released"
  };
  const nextLabel: Partial<Record<PayrollRun["status"],string>> = {
    "Draft":"Submit for Approval", "For Approval":"Approve", "Approved":"Release"
  };

  return (
    <div>
      <SectionHeader title="Payroll Management" subtitle="Philippine Normal University — DBM Salary Schedule"
        action={<Btn onClick={()=>setShowProcess(true)}><Plus className="w-4 h-4"/>Process Payroll</Btn>}/>
      <PayrollDatabaseStatus/>
      <CscSalaryComputation/>
      <PayrollRequirementsReference/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Latest Net Pay" value="₱15.3M" sub="Jul 2024 — 1st Half" icon={CreditCard} color="blue"/>
        <StatCard label="Employees Paid" value="847" sub="Last payroll run" icon={Users} color="green"/>
        <StatCard label="For Approval" value={String(forApproval)} sub="Awaiting authorization" icon={AlertCircle} color="red"/>
        <StatCard label="YTD Payroll" value="₱214.9M" sub="January – July 2024" icon={TrendingUp} color="gold"/>
      </div>
      <div id="payroll-run-list" className="flex items-center gap-2 mb-3 flex-wrap">
        {["All","Released","Approved","For Approval","Draft"].map(s=>(
          <button key={s} onClick={()=>setStatusF(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusF===s?"text-white":"bg-card border border-border text-muted-foreground hover:bg-muted"}`}
            style={statusF===s?{backgroundColor:"#C8A84B",color:"#0B1120"}:{}}>{s}</button>
        ))}
      </div>
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-muted/40 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Period</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Cut-Off / Pay Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">Employees</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">Gross Pay</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Net Pay</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-border">
              {filtered.map(pr=>{
                const nxt = nextStatus[pr.status];
                const lbl = nextLabel[pr.status];
                return (
                  <tr key={pr.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3"><p className="text-sm font-medium">{pr.period}</p><p className="text-xs text-muted-foreground font-mono">{pr.id}</p></td>
                    <td className="px-4 py-3 hidden md:table-cell"><p className="text-xs text-muted-foreground">Cut-off: {pr.cutOff}</p><p className="text-xs text-muted-foreground">Pay: {pr.payDate}</p></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><p className="text-sm font-mono">{pr.employees.toLocaleString()}</p></td>
                    <td className="px-4 py-3 text-right hidden lg:table-cell"><p className="text-sm font-mono">{pr.grossPay>0?fc(pr.grossPay):"—"}</p></td>
                    <td className="px-4 py-3 text-right"><p className={`text-sm font-mono font-semibold ${pr.netPay>0?"text-green-600":"text-muted-foreground"}`}>{pr.netPay>0?fc(pr.netPay):"—"}</p></td>
                    <td className="px-4 py-3"><Badge variant={pr.status}>{pr.status}</Badge></td>
                    <td className="px-4 py-3"><div className="flex items-center justify-end gap-1">
                      {nxt&&lbl&&<button onClick={()=>setConfirmPay({pr,next:nxt})} className="text-xs font-medium px-2.5 py-1 rounded-lg border border-border hover:bg-muted transition-colors whitespace-nowrap">{lbl}</button>}
                      <button aria-label={`View payslip for ${pr.period}`} onClick={()=>{setSelPay(pr);setPage("payslip");}} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-[#C8A84B] transition-colors"><Eye className="w-4 h-4"/></button>
                      <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><Download className="w-4 h-4"/></button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={!!confirmPay} onClose={()=>setConfirmPay(null)} title="Confirm Action" size="sm">
        {confirmPay&&(
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-foreground">{nextLabel[confirmPay.pr.status]}</p>
              <p className="text-xs text-muted-foreground mt-1">{confirmPay.pr.period} · {confirmPay.pr.employees.toLocaleString()} employees</p>
              <p className="text-xs text-muted-foreground mt-0.5">{confirmPay.pr.status} → <strong>{confirmPay.next}</strong></p>
            </div>
            <div className="flex justify-end gap-2">
              <Btn variant="outline" onClick={()=>setConfirmPay(null)}>Cancel</Btn>
              <Btn onClick={()=>{onStatusChange(confirmPay.pr.id,confirmPay.next);setConfirmPay(null);}}>
                <CheckCircle className="w-4 h-4"/>Confirm
              </Btn>
            </div>
          </div>
        )}
      </Modal>
      <Modal open={showProcess} onClose={()=>setShowProcess(false)} title="Process New Payroll Run">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0"/>
            <p className="text-xs text-blue-700">Ensure all DTRs have been verified before generating payroll. This action will process mandatory deductions per TRAIN Law.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-muted-foreground mb-1">Payroll Period</label><select className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/40"><option>August 2024 — 2nd Half</option><option>September 2024 — 1st Half</option></select></div>
            <div><label className="block text-xs font-medium text-muted-foreground mb-1">Cut-Off Date</label><input type="date" defaultValue="2024-08-31" className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/40"/></div>
            <div><label className="block text-xs font-medium text-muted-foreground mb-1">Pay Date</label><input type="date" defaultValue="2024-09-05" className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/40"/></div>
            <div><label className="block text-xs font-medium text-muted-foreground mb-1">Include</label><select className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/40"><option>All Active Employees</option><option>Permanent Only</option></select></div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Btn variant="outline" onClick={()=>setShowProcess(false)}>Cancel</Btn>
            <Btn onClick={()=>setShowProcess(false)}>Generate Payroll</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── PAYSLIP VIEW ──────────────────────────────────────────
function PayslipView({ payroll, setPage, employees }: { payroll:PayrollRun; setPage:(p:Page)=>void; employees:Employee[] }) {
  const [selEmpId, setSelEmpId] = useState(employees[0]?.id||"");
  const emp = employees.find(e=>e.id===selEmpId) || employees[0];
  const ps = emp ? computePayslip(emp.monthlySalary) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={()=>setPage("payroll")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#C8A84B] transition-colors"><ChevronLeft className="w-4 h-4"/>Back to Payroll</button>
        <div className="flex gap-2"><Btn variant="outline" size="sm"><Download className="w-3.5 h-3.5"/>Export PDF</Btn><Btn variant="outline" size="sm"><Printer className="w-3.5 h-3.5"/>Print</Btn></div>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-xl p-4 mb-4 shadow-sm">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Select Employee</label>
          <select value={selEmpId} onChange={e=>setSelEmpId(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/40">
            {employees.map(e=><option key={e.id} value={e.id}>{e.fullName} ({e.employeeNo})</option>)}
          </select>
        </div>
        {emp&&ps&&(
          <div className="bg-card rounded-2xl border-2 shadow-lg overflow-hidden" style={{borderColor:"rgba(200,168,75,0.2)"}}>
            <div className="p-6 text-white" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl overflow-hidden flex items-center justify-center">
                  <ImageWithFallback src={logoImg} alt="PNU" className="w-12 h-12 object-contain"/>
                </div>
                <div><h2 className="font-bold text-base leading-tight">Philippine Normal University</h2><p className="text-white/60 text-xs">The National Center for Teacher Education · ISO 9001:2015</p></div>
              </div>
              <div className="border-t border-white/20 pt-4"><h1 className="text-2xl font-bold" style={{color:"#C8A84B"}}>PAYSLIP</h1><p className="text-white/60 text-sm mt-0.5">{payroll.period}</p></div>
            </div>
            <div className="p-6 border-b border-border grid grid-cols-2 gap-4">
              {[["Employee Name",emp.fullName],["Employee No.",emp.employeeNo],["Position",emp.position],["Department",emp.department],["Salary Grade / Step",`SG-${emp.salaryGrade} / Step ${emp.step}`],["Pay Date",payroll.payDate]].map(([label,val])=>(
                <div key={label}><p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p><p className="text-sm font-medium mt-0.5">{val}</p></div>
              ))}
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 pb-2 border-b border-border">Earnings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span>Basic Salary</span><span className="font-mono font-medium">{fc(emp.monthlySalary)}</span></div>
                  <div className="flex justify-between text-sm text-muted-foreground"><span>PERA Allowance</span><span className="font-mono">₱2,000.00</span></div>
                  <div className="flex justify-between text-sm text-muted-foreground"><span>ACA Allowance</span><span className="font-mono">₱500.00</span></div>
                </div>
                <div className="mt-3 pt-2 border-t border-border flex justify-between text-sm font-bold"><span>Gross Pay</span><span className="font-mono">{fc(ps.grossPay)}</span></div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 pb-2 border-b border-border">Deductions</h3>
                <div className="space-y-2">
                  {[["GSIS (9%)",ps.gsis],["PhilHealth (2%)",ps.philhealth],["Pag-IBIG",ps.pagibig],["Withholding Tax",ps.tax]].map(([label,val])=>(
                    <div key={label as string} className="flex justify-between text-sm"><span>{label as string}</span><span className="font-mono text-red-600">{fc(val as number)}</span></div>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-border flex justify-between text-sm font-bold text-red-600"><span>Total Deductions</span><span className="font-mono">{fc(ps.totalDeductions)}</span></div>
              </div>
            </div>
            <div className="mx-6 mb-6 rounded-2xl p-5 text-center text-white" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>
              <p className="text-sm text-white/60 mb-1">NET PAY</p>
              <p className="text-4xl font-bold font-mono" style={{color:"#C8A84B"}}>{fc(ps.netPay)}</p>
              <p className="text-xs text-white/40 mt-2">Deposited to LBP Account ending ****2341</p>
            </div>
            <div className="px-6 pb-6 text-center"><p className="text-xs text-muted-foreground">Computer-generated payslip. For discrepancies, contact HRDO within 5 working days.</p></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── LEAVE MANAGEMENT ──────────────────────────────────────
function LeaveManagement({ role, leaves, onUpdateLeave, onAddLeave }: {
  role:Role;
  leaves:LeaveRequest[];
  onUpdateLeave:(id:string,status:"Approved"|"Rejected",remarks:string,by:string)=>void;
  onAddLeave:(lr:Omit<LeaveRequest,"id">)=>void;
}) {
  const [statusF, setStatusF] = useState("All");
  const [showApprove, setShowApprove] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [selLeave, setSelLeave] = useState<LeaveRequest|null>(null);
  const [action, setAction] = useState<"approve"|"reject">("approve");
  const [remarks, setRemarks] = useState("");
  const [newLeave, setNewLeave] = useState({ leaveType:"Vacation Leave", startDate:"", endDate:"", reason:"" });
  const filtered = statusF==="All"?leaves:leaves.filter(l=>l.status===statusF);
  const canApprove = role==="admin"||role==="leave_management"||role==="management";

  const handleApproval = () => {
    if (selLeave) onUpdateLeave(selLeave.id, action==="approve"?"Approved":"Rejected", remarks, "Dr. Jose Antonio B. Reyes");
    setShowApprove(false); setRemarks("");
  };

  const handleSubmitLeave = () => {
    if (!newLeave.startDate || !newLeave.endDate) { alert("Please fill in dates."); return; }
    const start = new Date(newLeave.startDate), end = new Date(newLeave.endDate);
    const days = Math.max(1, Math.round((end.getTime()-start.getTime())/86400000)+1);
    onAddLeave({
      employeeId:"EMP005", employeeName:"Asst. Prof. Jennifer Rose M. Dela Torre",
      department:"College of Teacher Education", leaveType:newLeave.leaveType,
      startDate:newLeave.startDate, endDate:newLeave.endDate, days,
      reason:newLeave.reason, status:"Pending", appliedDate:new Date().toISOString().slice(0,10),
    });
    setShowSubmit(false); setNewLeave({ leaveType:"Vacation Leave", startDate:"", endDate:"", reason:"" });
  };

  return (
    <div>
      <SectionHeader title="Leave Management" subtitle="Leave applications and approval workflow"
        action={role==="employee"?<Btn onClick={()=>setShowSubmit(true)}><Plus className="w-4 h-4"/>Apply for Leave</Btn>:undefined}/>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {["All","Pending","Approved","Rejected","Cancelled"].map(s=>{
          const count=s==="All"?leaves.length:leaves.filter(l=>l.status===s).length;
          return (<button key={s} onClick={()=>setStatusF(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${statusF===s?"text-white":"bg-card border border-border text-muted-foreground hover:bg-muted"}`}
            style={statusF===s?{backgroundColor:"#C8A84B",color:"#0B1120"}:{}}>
            {s}<span className={`rounded-full px-1.5 text-xs ${statusF===s?"bg-white/20":"bg-muted-foreground/10"}`}>{count}</span>
          </button>);
        })}
      </div>
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-muted/40 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Employee</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Leave Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">Period</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">Days</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-border">
              {filtered.map(lr=>(
                <tr key={lr.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3"><div className="flex items-center gap-2.5"><Av name={lr.employeeName} size="sm"/><div className="min-w-0"><p className="text-sm font-medium truncate">{lr.employeeName}</p><p className="text-xs text-muted-foreground">{lr.department}</p></div></div></td>
                  <td className="px-4 py-3 hidden md:table-cell"><p className="text-sm">{lr.leaveType}</p><p className="text-xs text-muted-foreground">Filed: {fd(lr.appliedDate)}</p></td>
                  <td className="px-4 py-3 hidden lg:table-cell"><p className="text-xs font-mono">{fd(lr.startDate)} – {fd(lr.endDate)}</p>{lr.approvedBy&&<p className="text-xs text-muted-foreground mt-0.5">By: {lr.approvedBy}</p>}</td>
                  <td className="px-4 py-3 hidden lg:table-cell"><span className="font-mono font-semibold">{lr.days}</span><span className="text-xs text-muted-foreground ml-1">day{lr.days!==1?"s":""}</span></td>
                  <td className="px-4 py-3"><Badge variant={lr.status}>{lr.status}</Badge></td>
                  <td className="px-4 py-3"><div className="flex items-center justify-end gap-1">
                    {lr.status==="Pending"&&canApprove&&(<>
                      <button onClick={()=>{setSelLeave(lr);setAction("approve");setShowApprove(true);}} className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Approve"><CheckCircle className="w-4 h-4"/></button>
                      <button onClick={()=>{setSelLeave(lr);setAction("reject");setShowApprove(true);}} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Reject"><XCircle className="w-4 h-4"/></button>
                    </>)}
                    <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><Eye className="w-4 h-4"/></button>
                  </div></td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">No leave requests found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={showApprove} onClose={()=>setShowApprove(false)} title={action==="approve"?"Approve Leave Request":"Reject Leave Request"}>
        {selLeave&&(<div className="space-y-4">
          <div className={`p-4 rounded-xl border ${action==="approve"?"bg-green-50 border-green-100":"bg-red-50 border-red-100"}`}>
            <p className="text-sm font-semibold">{selLeave.employeeName}</p>
            <p className="text-xs text-muted-foreground mt-1">{selLeave.leaveType} · {selLeave.days} days · {fd(selLeave.startDate)} – {fd(selLeave.endDate)}</p>
            <p className="text-xs text-muted-foreground mt-0.5 italic">{selLeave.reason}</p>
          </div>
          <div><label className="block text-xs font-medium text-muted-foreground mb-1">{action==="approve"?"Remarks (optional)":"Reason for Rejection"}</label>
            <textarea rows={3} value={remarks} onChange={e=>setRemarks(e.target.value)} placeholder={action==="approve"?"Add remarks...":"State reason for rejection..."} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/40 resize-none"/>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Btn variant="outline" onClick={()=>setShowApprove(false)}>Cancel</Btn>
            <Btn variant={action==="approve"?"primary":"destructive"} onClick={handleApproval}>
              {action==="approve"?<><CheckCircle className="w-4 h-4"/>Approve</>:<><XCircle className="w-4 h-4"/>Reject</>}
            </Btn>
          </div>
        </div>)}
      </Modal>
      <Modal open={showSubmit} onClose={()=>setShowSubmit(false)} title="Apply for Leave">
        <div className="space-y-4">
          <div><label className="block text-xs font-medium text-muted-foreground mb-1">Leave Type</label>
            <select value={newLeave.leaveType} onChange={e=>setNewLeave(p=>({...p,leaveType:e.target.value}))} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/40">
              {["Vacation Leave","Sick Leave","Maternity Leave","Paternity Leave","Study Leave","Special Leave"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-muted-foreground mb-1">Start Date</label><input type="date" value={newLeave.startDate} onChange={e=>setNewLeave(p=>({...p,startDate:e.target.value}))} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/40"/></div>
            <div><label className="block text-xs font-medium text-muted-foreground mb-1">End Date</label><input type="date" value={newLeave.endDate} onChange={e=>setNewLeave(p=>({...p,endDate:e.target.value}))} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/40"/></div>
          </div>
          <div><label className="block text-xs font-medium text-muted-foreground mb-1">Reason / Purpose</label><textarea rows={3} value={newLeave.reason} onChange={e=>setNewLeave(p=>({...p,reason:e.target.value}))} placeholder="State purpose of leave..." className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/40 resize-none"/></div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0"/>
            <p className="text-xs text-blue-700">Submit at least 5 working days in advance. Medical certificate required for sick leave exceeding 3 days.</p>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Btn variant="outline" onClick={()=>setShowSubmit(false)}>Cancel</Btn>
            <Btn onClick={handleSubmitLeave}>Submit Application</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── ATTENDANCE PAGE ───────────────────────────────────────
function AttendancePage({ role, dtr, employees, onEditDtr, photoRecords, onAddPhotoRecord }: {
  role:Role; dtr:DtrRecord[]; employees:Employee[];
  onEditDtr:(rec:DtrRecord)=>void;
  photoRecords:PhotoAttendanceRecord[];
  onAddPhotoRecord:(rec:Omit<PhotoAttendanceRecord,"id">)=>void;
}) {
  const [viewMode, setViewMode] = useState<"camera"|"dtr"|"summary"|"biometric">("camera");
  const [selEmpCamera, setSelEmpCamera] = useState<Employee|null>(null);
  const [selEmpAtt, setSelEmpAtt] = useState<{emp:Employee;rec:DtrRecord}|null>(null);
  const [deptF, setDeptF] = useState("All");
  const [dateF, setDateF] = useState("2024-08-14");
  const [editForm, setEditForm] = useState<DtrRecord|null>(null);

  const depts=["All","College of Teacher Education","College of Arts and Sciences","Human Resource Development Office","Budget and Finance Office","Office of the Registrar"];
  const filtered = employees.filter(e=>deptF==="All"||e.department===deptF);
  const todayStr = new Date(dateF).toLocaleDateString("en-PH",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
  const getDtr = (empId:string) => dtr.find(d=>d.employeeId===empId&&d.date===dateF);

  const stats = {
    present: filtered.filter(e=>{ const r=getDtr(e.id); return r?.status==="Present"; }).length,
    late: filtered.filter(e=>{ const r=getDtr(e.id); return r?.status==="Late"; }).length,
    absent: filtered.filter(e=>{ const r=getDtr(e.id); return r?.status==="Absent"; }).length,
    onLeave: filtered.filter(e=>{ const r=getDtr(e.id); return r?.status==="On Leave"; }).length,
  };

  return (
    <div>
      <SectionHeader title="Attendance & Daily Time Record" subtitle="Biometric integration · BIO-TIME System"
        action={<div className="flex gap-2">
          {role!=="employee"&&<Btn variant="outline" size="sm"><Download className="w-3.5 h-3.5"/>Export DTR</Btn>}
          {role!=="employee"&&<Btn variant="outline" size="sm"><RefreshCw className="w-3.5 h-3.5"/>Sync Biometric</Btn>}
        </div>}/>
      <div className="mb-5 rounded-xl p-4 border flex items-center gap-4" style={{backgroundColor:"rgba(255,255,255,0.03)",borderColor:"rgba(255,255,255,0.08)"}}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:"rgba(255,255,255,0.05)"}}>
          <Fingerprint className="w-5 h-5" style={{color:"#C8A84B"}}/>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2"><p className="text-sm font-semibold text-foreground">BIO-TIME Biometric System</p><div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>Online</div></div>
          <p className="text-xs text-muted-foreground mt-0.5">Last sync: Aug 14, 2024 08:00 AM · 849 records imported · 6 terminal devices active</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-muted-foreground">Selected Date</p>
          <p className="text-sm font-semibold text-foreground">{todayStr}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Present Today" value={String(stats.present)} sub="Biometric verified" icon={UserCheck} color="green"/>
        <StatCard label="Late Arrivals" value={String(stats.late)} sub="Past 8:00 AM" icon={Clock3} color="gold"/>
        <StatCard label="Absent / AWOL" value={String(stats.absent)} sub="Unexcused" icon={XCircle} color="red"/>
        <StatCard label="On Approved Leave" value={String(stats.onLeave)} sub="Linked from leave module" icon={Calendar} color="blue"/>
      </div>
      <div className="flex gap-1 mb-4 bg-muted/40 p-1 rounded-xl border border-border flex-wrap w-fit">
        {(["camera","dtr","summary","biometric"] as const).map(id=>(
          <button key={id} onClick={()=>setViewMode(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode===id?"bg-muted/60 text-[#C8A84B] shadow-sm":"text-muted-foreground hover:text-foreground"}`}>
            {id==="camera"?"📷 Camera Attendance":id==="dtr"?"DTR Table":id==="summary"?"Weekly Summary":"Biometric Logs"}
          </button>
        ))}
      </div>
      {viewMode==="dtr"&&(
        <>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <select value={deptF} onChange={e=>setDeptF(e.target.value)} className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/20">
              {depts.map(d=><option key={d}>{d}</option>)}
            </select>
            <input type="date" value={dateF} onChange={e=>setDateF(e.target.value)} className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/20"/>
            <span className="text-xs text-muted-foreground">{filtered.length} employees</span>
          </div>
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="bg-muted/40 border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Employee</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Department</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Time In</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">Time Out</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">OT</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                  {role!=="employee"&&<th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>}
                </tr></thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(e=>{
                    const rec = getDtr(e.id);
                    const tin = rec?.timeIn || "—";
                    const tout = rec?.timeOut || "—";
                    const status = rec?.status || "Absent";
                    const ot = rec?.overtime || 0;
                    return (
                      <tr key={e.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5"><div className="flex items-center gap-2"><Av name={e.fullName} color={e.color} size="sm"/><div><p className="text-sm font-medium truncate max-w-[130px]">{e.fullName}</p><p className="text-xs text-muted-foreground font-mono">{e.employeeNo}</p></div></div></td>
                        <td className="px-4 py-2.5 hidden md:table-cell"><p className="text-xs text-muted-foreground truncate max-w-[140px]">{e.department}</p></td>
                        <td className="px-4 py-2.5"><span className={`text-sm font-mono font-medium ${status==="On Leave"?"text-muted-foreground":status==="Absent"?"text-red-500":status==="Late"?"text-amber-600":"text-green-600"}`}>{tin}</span></td>
                        <td className="px-4 py-2.5 hidden lg:table-cell"><span className="text-sm font-mono text-muted-foreground">{tout}</span></td>
                        <td className="px-4 py-2.5 hidden lg:table-cell"><span className="text-xs text-muted-foreground font-mono">{ot>0?`${ot}m`:"—"}</span></td>
                        <td className="px-4 py-2.5"><Badge variant={status}>{status}</Badge></td>
                        {role!=="employee"&&<td className="px-4 py-2.5 text-right">
                          <button onClick={()=>{
                            const r = rec||{employeeId:e.id,date:dateF,timeIn:null,timeOut:null,status:"Absent" as const,overtime:0};
                            setSelEmpAtt({emp:e,rec:r}); setEditForm({...r});
                          }} className="text-xs font-medium px-2 py-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-[#C8A84B]">Edit DTR</button>
                        </td>}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {viewMode==="summary"&&(
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-4">Weekly Attendance — Aug 12–16, 2024</h3>
            <div style={{height:200}}><ChartStackedBar data={weekAttendanceData}/></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <h3 className="text-sm font-semibold mb-3">Daily Breakdown</h3>
              <div className="space-y-2">
                {weekAttendanceData.map(d=>(
                  <div key={d.day} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground w-8">{d.day}</span>
                    <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden flex">
                      <div className="h-full" style={{width:`${(d.present/849*100).toFixed(1)}%`,backgroundColor:"#C8A84B"}}/>
                      <div className="h-full" style={{width:`${(d.late/849*100).toFixed(1)}%`,backgroundColor:"#F59E0B"}}/>
                      <div className="h-full" style={{width:`${(d.absent/849*100).toFixed(1)}%`,backgroundColor:"#EF4444"}}/>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground w-10 text-right">{((d.present+d.late)/849*100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <h3 className="text-sm font-semibold mb-3">Overtime Summary — This Week</h3>
              <div className="space-y-2">
                {employees.slice(0,6).map((e,i)=>(
                  <div key={e.id} className="flex items-center gap-3 py-1 border-b border-border/50">
                    <Av name={e.fullName} color={e.color} size="sm"/>
                    <div className="flex-1 min-w-0"><p className="text-xs font-medium truncate">{e.fullName}</p><p className="text-xs text-muted-foreground">{e.department.split(" ").slice(-1)[0]}</p></div>
                    <span className="text-xs font-mono font-semibold text-[#C8A84B]">{(i+1)*30}m OT</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {viewMode==="biometric"&&(
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold">Biometric Transaction Logs</h3>
              <span className="text-xs text-muted-foreground">Aug 14, 2024 · 849 records</span>
            </div>
            <div className="divide-y divide-border">
              {employees.slice(0,8).map((e,i)=>{
                const rec = dtr.find(d=>d.employeeId===e.id&&d.date==="2024-08-14");
                return (
                  <div key={e.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{backgroundColor:"rgba(255,255,255,0.05)"}}>
                      <Fingerprint className="w-3.5 h-3.5" style={{color:"#C8A84B"}}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{e.fullName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{e.employeeNo} · Terminal T{(i%3)+1} · Taft Gate</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-medium">{rec?.timeIn||"—"}</p>
                      <p className="text-xs text-muted-foreground">Finger {i%5+1} · Verified</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${rec?.timeIn?"bg-green-400":"bg-red-400"}`}/>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[{terminal:"Terminal T1",location:"Taft Gate — Main Entrance",records:287},{terminal:"Terminal T2",location:"Administration Building",records:203},{terminal:"Terminal T3",location:"COTE Building",records:187}].map(t=>(
              <div key={t.terminal} className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold">{t.terminal}</p>
                  <div className="flex items-center gap-1 text-xs text-green-600"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>Online</div>
                </div>
                <p className="text-xs text-muted-foreground">{t.location}</p>
                <p className="text-xl font-bold font-mono mt-2 text-foreground">{t.records}</p>
                <p className="text-xs text-muted-foreground">Records today</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {viewMode==="camera"&&(
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-3">
              {(role==="admin"||role==="timekeeping")&&(
                <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                  <label className="block text-xs font-medium text-muted-foreground mb-2">Select Faculty / Staff</label>
                  <select value={selEmpCamera?.id||employees[0]?.id||""} onChange={e=>setSelEmpCamera(employees.find(emp=>emp.id===e.target.value)||null)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/30 bg-card">
                    {employees.map(e=><option key={e.id} value={e.id}>{e.fullName}</option>)}
                  </select>
                </div>
              )}
              <FacultyAttendanceCard
                employee={selEmpCamera||employees[0]||null}
                records={photoRecords}
                onAddRecord={onAddPhotoRecord}/>
            </div>
            <div className="lg:col-span-2">
              <CameraAttendanceHistory records={photoRecords}/>
            </div>
          </div>
          {(role==="admin"||role==="timekeeping")&&(
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Navigation className="w-4 h-4 text-[#C8A84B]"/>Admin — Faculty Attendance Map</h3>
              <AdminFacultyMapView records={photoRecords} employees={employees}/>
            </div>
          )}
        </div>
      )}
      <Modal open={!!selEmpAtt} onClose={()=>{setSelEmpAtt(null);setEditForm(null);}} title={`Edit DTR — ${selEmpAtt?.emp.fullName||""}`}>
        {editForm&&(
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0"/>
              <p className="text-xs text-amber-700">Changes to DTR require authorization. Ensure accuracy before saving. All modifications are logged.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium text-muted-foreground mb-1">Date</label><input type="date" value={editForm.date} onChange={e=>setEditForm(p=>p?{...p,date:e.target.value}:null)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/40"/></div>
              <div><label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
                <select value={editForm.status} onChange={e=>setEditForm(p=>p?{...p,status:e.target.value as DtrRecord["status"]}:null)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/40">
                  <option value="Present">Present</option><option value="Late">Late</option>
                  <option value="Absent">Absent</option><option value="On Leave">On Leave</option><option value="Holiday">Holiday</option>
                </select>
              </div>
              <div><label className="block text-xs font-medium text-muted-foreground mb-1">Time In</label><input value={editForm.timeIn||""} onChange={e=>setEditForm(p=>p?{...p,timeIn:e.target.value||null}:null)} placeholder="e.g. 08:00 AM" className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/40"/></div>
              <div><label className="block text-xs font-medium text-muted-foreground mb-1">Time Out</label><input value={editForm.timeOut||""} onChange={e=>setEditForm(p=>p?{...p,timeOut:e.target.value||null}:null)} placeholder="e.g. 05:00 PM" className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/40"/></div>
              <div><label className="block text-xs font-medium text-muted-foreground mb-1">Overtime (minutes)</label><input type="number" min={0} value={editForm.overtime} onChange={e=>setEditForm(p=>p?{...p,overtime:parseInt(e.target.value)||0}:null)} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/40"/></div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Btn variant="outline" onClick={()=>{setSelEmpAtt(null);setEditForm(null);}}>Cancel</Btn>
              <Btn onClick={()=>{onEditDtr(editForm);setSelEmpAtt(null);setEditForm(null);}}>
                <Check className="w-4 h-4"/>Save DTR
              </Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ── REPORTS ───────────────────────────────────────────────
function Reports({ employees, payrolls, leaves }: { employees:Employee[]; payrolls:PayrollRun[]; leaves:LeaveRequest[] }) {
  const [activeRpt, setActiveRpt] = useState("payroll");
  const reports = [
    {id:"payroll",label:"Payroll Summary",icon:Wallet},
    {id:"leave",label:"Leave Report",icon:Calendar},
    {id:"workforce",label:"Workforce Statistics",icon:Users},
    {id:"deductions",label:"Government Deductions",icon:Calculator},
  ];
  const released = payrolls.filter(p=>p.status==="Released");
  const totalReleased = released.reduce((s,p)=>s+p.netPay,0);
  const pendingLeaves = leaves.filter(l=>l.status==="Pending").length;
  const byDept: Record<string,number> = {};
  employees.forEach(e=>{ byDept[e.department]=(byDept[e.department]||0)+1; });

  return (
    <div>
      <SectionHeader title="Reports & Analytics" subtitle="Government-standard reports for DBM, COA, GSIS, PhilHealth, Pag-IBIG"/>
      <div className="flex gap-2 mb-5 flex-wrap">
        {reports.map(r=>(
          <button key={r.id} onClick={()=>setActiveRpt(r.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${activeRpt===r.id?"text-white border-transparent shadow-sm":"bg-card border-border text-muted-foreground hover:bg-muted"}`}
            style={activeRpt===r.id?{backgroundColor:"#C8A84B",color:"#0B1120"}:{}}>
            <r.icon className="w-4 h-4"/>{r.label}
          </button>
        ))}
      </div>
      {activeRpt==="payroll"&&(
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Payroll Runs (YTD)" value={String(payrolls.length)} sub="All periods" icon={FileText} color="blue"/>
            <StatCard label="Released Payrolls" value={String(released.length)} sub="Completed disbursements" icon={CheckCircle} color="green"/>
            <StatCard label="Total Released (Net)" value={`₱${(totalReleased/1e6).toFixed(1)}M`} sub="YTD disbursements" icon={CreditCard} color="gold"/>
            <StatCard label="For Approval" value={String(payrolls.filter(p=>p.status==="For Approval").length)} sub="Pending action" icon={AlertCircle} color="red"/>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold">Monthly Payroll Trend</h3><Btn variant="outline" size="sm"><Download className="w-3.5 h-3.5"/>Export CSV</Btn></div>
            <div style={{height:200}}><ChartArea data={monthlyPayrollData} k1="gross" k2="net" c1="#3B82F6" c2="#C8A84B" l1="Gross Pay" l2="Net Pay"/></div>
          </div>
        </div>
      )}
      {activeRpt==="leave"&&(
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Requests" value={String(leaves.length)} icon={Calendar} color="blue"/>
            <StatCard label="Approved" value={String(leaves.filter(l=>l.status==="Approved").length)} icon={CheckCircle} color="green"/>
            <StatCard label="Pending" value={String(pendingLeaves)} icon={AlertTriangle} color="gold"/>
            <StatCard label="Rejected" value={String(leaves.filter(l=>l.status==="Rejected").length)} icon={XCircle} color="red"/>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold">Leave Type Distribution</h3><Btn variant="outline" size="sm"><Download className="w-3.5 h-3.5"/>Export CSV</Btn></div>
            <div className="flex justify-center mb-4" style={{height:180}}><ChartDonut data={leaveTypePieData} colors={PIE_COLORS} ir={45} or={70}/></div>
          </div>
        </div>
      )}
      {activeRpt==="workforce"&&(
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Employees" value={String(employees.length)} icon={Users} color="blue"/>
            <StatCard label="Active" value={String(employees.filter(e=>e.status==="Active").length)} icon={CheckCircle} color="green"/>
            <StatCard label="On Leave" value={String(employees.filter(e=>e.status==="On Leave").length)} icon={Clock} color="gold"/>
            <StatCard label="Departments" value={String(Object.keys(byDept).length)} icon={Building2} color="purple"/>
          </div>
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border"><h3 className="text-sm font-semibold">Staff by Department</h3></div>
            <div className="divide-y divide-border">
              {Object.entries(byDept).sort((a,b)=>b[1]-a[1]).map(([dept,count])=>(
                <div key={dept} className="flex items-center gap-4 px-5 py-3">
                  <Building2 className="w-4 h-4 text-muted-foreground shrink-0"/>
                  <p className="text-sm flex-1 text-foreground truncate">{dept}</p>
                  <div className="flex items-center gap-2"><div className="w-24 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${(count/employees.length*100).toFixed(0)}%`,backgroundColor:"#C8A84B"}}/></div><span className="text-sm font-mono font-semibold w-6 text-right">{count}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeRpt==="deductions"&&(
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[{label:"GSIS Remittance",desc:"9% employee share · Government Service Insurance System",icon:Shield,color:"blue"},
              {label:"PhilHealth Premium",desc:"2% employee share · Philippine Health Insurance",icon:Activity,color:"green"},
              {label:"Pag-IBIG Fund",desc:"Fixed ₱100 · Home Development Mutual Fund",icon:Building2,color:"gold"}].map(d=>(
              <div key={d.label} className="bg-card rounded-xl border border-border p-5 shadow-sm">
                <StatCard label={d.label} value={d.label==="GSIS Remittance"?"₱1.6M":d.label==="PhilHealth Premium"?"₱381K":"₱84.7K"} sub={d.desc} icon={d.icon} color={d.color}/>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold">BIR Withholding Tax — TRAIN Law Brackets</h3><Badge variant="gold">Republic Act 10963</Badge></div>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full">
                <thead><tr className="bg-muted/40"><th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Taxable Income</th><th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Rate</th><th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Base Tax</th></tr></thead>
                <tbody className="divide-y divide-border text-sm">
                  <tr><td className="px-4 py-3">₱0 – ₱250,000</td><td className="px-4 py-3 font-semibold text-green-600">0%</td><td className="px-4 py-3 font-mono">₱0</td></tr>
                  <tr><td className="px-4 py-3">₱250,001 – ₱400,000</td><td className="px-4 py-3 font-semibold">15%</td><td className="px-4 py-3 font-mono">₱0 + 15% excess of ₱250K</td></tr>
                  <tr><td className="px-4 py-3">₱400,001 – ₱800,000</td><td className="px-4 py-3 font-semibold">20%</td><td className="px-4 py-3 font-mono">₱22,500 + 20% excess of ₱400K</td></tr>
                  <tr><td className="px-4 py-3">₱800,001 – ₱2,000,000</td><td className="px-4 py-3 font-semibold">25%</td><td className="px-4 py-3 font-mono">₱102,500 + 25% excess of ₱800K</td></tr>
                  <tr><td className="px-4 py-3">₱2,000,001 – ₱8,000,000</td><td className="px-4 py-3 font-semibold">30%</td><td className="px-4 py-3 font-mono">₱402,500 + 30% excess of ₱2M</td></tr>
                  <tr><td className="px-4 py-3">Over ₱8,000,000</td><td className="px-4 py-3 font-semibold text-red-600">35%</td><td className="px-4 py-3 font-mono">₱2,202,500 + 35% excess of ₱8M</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── NOTIFICATIONS ─────────────────────────────────────────
function NotificationsPage({ notifs, onMarkRead, onMarkAllRead }: {
  notifs:NotifItem[];
  onMarkRead:(id:string)=>void;
  onMarkAllRead:()=>void;
}) {
  const unread = notifs.filter(n=>!n.read).length;
  const IC: Record<string,React.ElementType> = { info:Info, success:CheckCircle, warning:AlertTriangle, error:XCircle };
  const CC: Record<string,string> = { info:"text-blue-500 bg-blue-50 border-blue-100", success:"text-green-500 bg-green-50 border-green-100", warning:"text-amber-500 bg-amber-50 border-amber-100", error:"text-red-500 bg-red-50 border-red-100" };
  return (
    <div>
      <SectionHeader title="Notifications" subtitle="System alerts and reminders"
        action={unread>0?<Btn variant="outline" size="sm" onClick={onMarkAllRead}><Check className="w-3.5 h-3.5"/>Mark All Read</Btn>:undefined}/>
      {unread>0&&<div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500 shrink-0"/><p className="text-sm text-amber-700 font-medium">{unread} unread notification{unread!==1?"s":""}</p></div>}
      <div className="space-y-2">
        {notifs.map(n=>{
          const Ic=IC[n.type]||Info;
          return (
            <div key={n.id} onClick={()=>!n.read&&onMarkRead(n.id)}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${n.read?"bg-card border-border":"bg-blue-50/50 border-blue-100 hover:bg-white/5"}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${CC[n.type]}`}><Ic className="w-4 h-4"/></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${n.read?"text-foreground":"text-[#C8A84B]"}`}>{n.title}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    {!n.read&&<div className="w-2 h-2 rounded-full bg-blue-500"/>}
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── AUDIT PAGE ────────────────────────────────────────────
function AuditPage() {
  const logs = [
    { action:"LOGIN", sev:"info", detail:"System Administrator signed in from 192.168.1.5", user:"admin", time:"Aug 14, 2024 07:30 AM" },
    { action:"PAYROLL_APPROVED", sev:"success", detail:"PR-2024-07-B approved — July 2024 2nd Half · ₱15.3M net disbursement", user:"admin", time:"Aug 14, 2024 09:15 AM" },
    { action:"RECORD_MODIFIED", sev:"warning", detail:"Employee EMP-010 status changed: Active → On Leave", user:"Patricia Ann M. Flores", time:"Aug 13, 2024 02:30 PM" },
    { action:"DTR_EDITED", sev:"warning", detail:"DTR record modified for EMP-006 on Aug 13, 2024", user:"Carlo David R. Hernandez", time:"Aug 13, 2024 04:00 PM" },
    { action:"LEAVE_APPROVED", sev:"success", detail:"LR-2024-005 approved — Maribel Santos Torres Maternity Leave 105 days", user:"admin", time:"Aug 12, 2024 10:45 AM" },
    { action:"PAYROLL_RELEASED", sev:"success", detail:"PR-2024-07-A released — July 2024 1st Half · 847 employees · ₱15.3M net", user:"admin", time:"Aug 5, 2024 08:00 AM" },
    { action:"DEDUCTION_OVERRIDE", sev:"error", detail:"GSIS exemption applied for EMP-003 without proper authorization code", user:"Benjamin Roque T. Castillo", time:"July 12, 2024 02:30 PM" },
    { action:"BULK_IMPORT", sev:"info", detail:"DTR import: Aug 2024 1st Half — 849 records imported from BIO-TIME", user:"admin", time:"Aug 1, 2024 07:30 AM" },
  ];
  const sc: Record<string,string> = { info:"bg-blue-100 text-blue-700", success:"bg-green-100 text-green-700", warning:"bg-amber-100 text-amber-700", error:"bg-red-100 text-red-600" };
  return (
    <div>
      <SectionHeader title="Audit Trail" subtitle="Complete system activity log · COA-compliant record keeping"
        action={<Btn variant="outline" size="sm"><Download className="w-3.5 h-3.5"/>Export Log</Btn>}/>
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">System Activity Log</h3>
          <span className="text-xs text-muted-foreground">{logs.length} entries · Aug 2024</span>
        </div>
        <div className="divide-y divide-border">
          {logs.map((log,i)=>(
            <div key={i} className="flex items-start gap-4 px-5 py-3 hover:bg-muted/20 transition-colors">
              <span className={`text-xs font-bold font-mono px-2 py-1 rounded whitespace-nowrap uppercase ${sc[log.sev]}`}>{log.action.replace(/_/g," ")}</span>
              <div className="flex-1 min-w-0"><p className="text-sm text-foreground">{log.detail}</p><p className="text-xs text-muted-foreground mt-0.5">By: {log.user}</p></div>
              <p className="text-xs text-muted-foreground font-mono whitespace-nowrap shrink-0 hidden sm:block">{log.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SETTINGS ──────────────────────────────────────────────
function SettingsPage({ role }: { role:Role }) {
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <SectionHeader title="Settings & Profile" subtitle="Manage account preferences and system configuration"/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>{ROLE_LABELS[role].split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
          <h3 className="text-base font-semibold">{ROLE_LABELS[role]}</h3>
          <p className="text-xs text-muted-foreground">pnu-system@pnu.edu.ph</p>
          <div className="flex justify-center mt-2"><Badge variant="gold">{ROLE_LABELS[role]}</Badge></div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-4">Account Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {[["Full Name","System Administrator"],["Username","admin"],["Email","admin@pnu.edu.ph"]].map(([label,val])=>(
                <div key={label}><label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label><input defaultValue={val} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/40"/></div>
              ))}
              <div><label className="block text-xs font-medium text-muted-foreground mb-1">Role</label><input readOnly value={ROLE_LABELS[role]} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-muted/40 text-muted-foreground"/></div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-4">Notification Preferences</h3>
            <div className="space-y-3">
              {["Payroll deadlines and reminders","Leave request notifications","Attendance alerts and late arrivals","System maintenance alerts","DBM circulars and policy updates"].map(pref=>(
                <label key={pref} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" style={{accentColor:"#C8A84B"}}/>
                  <span className="text-sm">{pref}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end"><Btn onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),3000);}}>
            {saved?<><Check className="w-4 h-4"/>Saved!</>:"Save Changes"}
          </Btn></div>
        </div>
      </div>
    </div>
  );
}

// ── GPS UTILITIES ─────────────────────────────────────────
const PNU_CAMPUS = { lat:14.5547, lng:120.9924, name:"Philippine Normal University", address:"Taft Avenue, Malate, Manila 1004", radius:100 };

function haversineDistance(lat1:number,lng1:number,lat2:number,lng2:number):number {
  const R=6371000;
  const φ1=lat1*Math.PI/180, φ2=lat2*Math.PI/180;
  const Δφ=(lat2-lat1)*Math.PI/180, Δλ=(lng2-lng1)*Math.PI/180;
  const a=Math.sin(Δφ/2)**2+Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function GPSMapVisualization({ facultyLat, facultyLng }: { facultyLat:number; facultyLng:number }) {
  const W=380,H=200,CX=190,CY=100,SCALE=50000;
  const fx=Math.min(370,Math.max(10,CX+(facultyLng-PNU_CAMPUS.lng)*SCALE));
  const fy=Math.min(190,Math.max(10,CY-(facultyLat-PNU_CAMPUS.lat)*SCALE));
  const gfR=Math.round((PNU_CAMPUS.radius/111000)*SCALE);
  const dist=Math.round(haversineDistance(facultyLat,facultyLng,PNU_CAMPUS.lat,PNU_CAMPUS.lng));
  const inside=dist<=PNU_CAMPUS.radius;
  const blocks:number[][]=[
    [10,10,30,18],[55,10,45,18],[115,10,45,18],[175,10,45,18],[235,10,45,18],[295,10,45,18],[345,10,25,18],
    [10,38,30,25],[55,38,45,25],[115,38,45,25],[175,38,45,25],[235,38,45,25],[295,38,45,25],[345,38,25,25],
    [10,78,30,25],[55,78,45,25],[115,78,45,25],[175,78,45,25],[235,78,45,25],[295,78,45,25],[345,78,25,25],
    [10,118,30,25],[55,118,45,25],[115,118,45,25],[175,118,45,25],[235,118,45,25],[295,118,45,25],[345,118,25,25],
    [10,158,30,25],[55,158,45,25],[115,158,45,25],[175,158,45,25],[235,158,45,25],[295,158,45,25],[345,158,25,25],
  ];
  return (
    <div className="rounded-xl overflow-hidden border border-border">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{height:200,backgroundColor:"#EEF1F5"}}>
        {[50,110,170,230,290,350].map(x=><line key={x} x1={x} y1={0} x2={x} y2={H} stroke="white" strokeWidth={8}/>)}
        {[30,70,110,150,190].map(y=><line key={y} x1={0} y1={y} x2={W} y2={y} stroke="white" strokeWidth={6}/>)}
        {blocks.map(([x,y,w,h],i)=>(
          <rect key={i} x={x} y={y} width={w} height={h} rx={3} fill={i%7===0?"#D1FAE5":i%5===0?"#DBEAFE":i%3===0?"#FEF3C7":"#F1F5F9"}/>
        ))}
        <circle cx={CX} cy={CY} r={gfR} fill={inside?"#3B82F6":"#EF4444"} fillOpacity={0.1} stroke={inside?"#3B82F6":"#EF4444"} strokeWidth={1.5} strokeDasharray="5,4"/>
        <line x1={CX} y1={CY} x2={fx} y2={fy} stroke="#94A3B8" strokeWidth={1} strokeDasharray="3,3" opacity={0.7}/>
        <circle cx={CX} cy={CY} r={14} fill="#3B82F6" opacity={0.2}/>
        <circle cx={CX} cy={CY} r={8} fill="#3B82F6"/>
        <circle cx={CX} cy={CY} r={3.5} fill="white"/>
        <circle cx={fx} cy={fy} r={10} fill={inside?"#22C55E":"#EF4444"}/>
        <circle cx={fx} cy={fy} r={4.5} fill="white"/>
        <text x={CX+12} y={CY-12} fontSize={8} fill="#3B82F6" fontWeight="bold">PNU Campus</text>
        <text x={Math.min(fx+12,320)} y={Math.min(fy-10,185)} fontSize={8} fill={inside?"#16A34A":"#DC2626"} fontWeight="bold">You</text>
        <text x={8} y={H-4} fontSize={7} fill="#94A3B8">100m Geofence</text>
        <text x={W-68} y={H-4} fontSize={7} fill={inside?"#16A34A":"#DC2626"}>{dist}m from campus</text>
      </svg>
      <div className="flex items-center justify-between px-3 py-2 bg-card text-xs border-t border-border">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#3B82F6]"/>Authorized</span>
          <span className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-full ${inside?"bg-green-500":"bg-red-500"}`}/>You ({dist}m)</span>
        </div>
        <span className={`font-semibold ${inside?"text-green-700":"text-red-600"}`}>{inside?"✓ Within Geofence":"✗ Outside Geofence"}</span>
      </div>
    </div>
  );
}

// ── CAMERA ATTENDANCE MODAL ───────────────────────────────
function CameraAttendanceModal({ open, type, employee, onClose, onCapture }: {
  open:boolean; type:"TimeIn"|"TimeOut"; employee:Employee|null;
  onClose:()=>void; onCapture:(rec:Omit<PhotoAttendanceRecord,"id">)=>void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream|null>(null);
  const gpsQueriedRef = useRef(false);
  const [cameraKey, setCameraKey] = useState(0);
  const [step, setStep] = useState<"camera"|"confirm">("camera");
  const [photoData, setPhotoData] = useState<string|null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<"acquiring"|"found"|"denied">("acquiring");
  const [coords, setCoords] = useState<{lat:number;lng:number;accuracy:number}|null>(null);
  const [address, setAddress] = useState("Acquiring location...");
  const [nowTime, setNowTime] = useState(new Date());

  const dist = coords ? Math.round(haversineDistance(coords.lat,coords.lng,PNU_CAMPUS.lat,PNU_CAMPUS.lng)) : 0;
  const inside = dist <= PNU_CAMPUS.radius;
  const cleanup = () => { streamRef.current?.getTracks().forEach(t=>t.stop()); streamRef.current=null; };

  useEffect(() => {
    if (!open) {
      cleanup(); gpsQueriedRef.current=false;
      setStep("camera"); setPhotoData(null); setCameraReady(false); setCameraError(false);
      setGpsStatus("acquiring"); setCoords(null); return;
    }
    setCameraReady(false); setCameraError(false);
    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video:{facingMode:"user",width:{ideal:640},height:{ideal:480}}, audio:false })
        .then(s => {
          streamRef.current=s; setCameraReady(true);
          if (videoRef.current) { videoRef.current.srcObject=s; videoRef.current.play().catch(()=>{}); }
        })
        .catch(() => setCameraError(true));
    } else { setCameraError(true); }
    if (!gpsQueriedRef.current) {
      gpsQueriedRef.current=true; setGpsStatus("acquiring");
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          pos => { setCoords({lat:pos.coords.latitude,lng:pos.coords.longitude,accuracy:pos.coords.accuracy}); setGpsStatus("found"); setAddress("Taft Avenue, Malate, Manila 1004"); },
          () => {
            const o=(Math.random()-0.5)*0.0004;
            setCoords({lat:PNU_CAMPUS.lat+o,lng:PNU_CAMPUS.lng+o,accuracy:8+Math.round(Math.random()*12)});
            setGpsStatus("found"); setAddress(PNU_CAMPUS.address);
          },
          {enableHighAccuracy:true,timeout:10000,maximumAge:0}
        );
      } else { setGpsStatus("denied"); }
    }
    const t=setInterval(()=>setNowTime(new Date()),1000);
    return () => { clearInterval(t); cleanup(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, cameraKey]);

  const takePhoto = () => {
    if (cameraReady && videoRef.current && canvasRef.current) {
      const v=videoRef.current, c=canvasRef.current;
      c.width=v.videoWidth||640; c.height=v.videoHeight||480;
      c.getContext("2d")?.drawImage(v,0,0);
      setPhotoData(c.toDataURL("image/jpeg",0.85));
    } else { setPhotoData("placeholder"); }
    cleanup(); setStep("confirm");
  };

  const handleRetake = () => { setPhotoData(null); setStep("camera"); setCameraKey(k=>k+1); };

  const confirmCapture = () => {
    if (!employee) return;
    const now=new Date();
    const isLate=type==="TimeIn"&&(now.getHours()>8||(now.getHours()===8&&now.getMinutes()>0));
    onCapture({
      employeeId:employee.id, employeeName:employee.fullName, employeeNo:employee.employeeNo,
      date:now.toISOString().slice(0,10),
      time:now.toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit",second:"2-digit"}),
      type, photo:photoData,
      lat:coords?.lat||null, lng:coords?.lng||null, accuracy:coords?.accuracy||null,
      address, distanceFromAuth:dist, withinGeofence:inside,
      status:!inside?"Outside Location":isLate?"Late":"Present",
    });
  };

  if (!open) return null;
  const dateStr=nowTime.toLocaleDateString("en-PH",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
  const timeStr=nowTime.toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit",second:"2-digit"});

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[420px] max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border text-white" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4" style={{color:"#C8A84B"}}/>
            <h2 className="text-sm font-semibold">Attendance Verification — {type==="TimeIn"?"Clock In":"Clock Out"}</h2>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white p-1 rounded-lg"><X className="w-4 h-4"/></button>
        </div>
        {step==="camera"&&(
          <div className="p-4 space-y-3.5">
            <div className="relative rounded-xl overflow-hidden bg-gray-900" style={{aspectRatio:"4/3"}}>
              {cameraReady
                ? <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" style={{transform:"scaleX(-1)"}}/>
                : cameraError
                  ? <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <VideoOff className="w-10 h-10 text-white/30"/>
                      <p className="text-white/50 text-sm font-medium">Camera Unavailable</p>
                      <p className="text-white/30 text-xs">Camera preview is simulated</p>
                    </div>
                  : <div className="w-full h-full flex items-center justify-center"><RefreshCw className="w-8 h-8 text-white/30 animate-spin"/></div>
              }
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-36 h-44 rounded-[50%] border-2 border-dashed border-white/40"/>
              </div>
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white" style={{backgroundColor:type==="TimeIn"?"#3B82F6":"#EF4444"}}>
                {type==="TimeIn"?"● CLOCK IN":"● CLOCK OUT"}
              </div>
              {cameraReady&&<div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-green-600/80 text-white text-xs px-2 py-1 rounded-full"><div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"/>Live</div>}
            </div>
            <canvas ref={canvasRef} className="hidden"/>
            <div className="grid grid-cols-2 gap-2.5">
              <div className={`rounded-xl p-2.5 border ${cameraReady?"border-green-200 bg-green-50":cameraError?"border-amber-200 bg-amber-50":"border-border bg-muted/30"}`}>
                <div className="flex items-center gap-1.5 mb-1"><Video className={`w-3.5 h-3.5 ${cameraReady?"text-green-600":cameraError?"text-amber-600":"text-muted-foreground"}`}/><span className="text-xs text-muted-foreground">Camera</span></div>
                <p className={`text-xs font-semibold ${cameraReady?"text-green-700":cameraError?"text-amber-700":"text-muted-foreground"}`}>{cameraReady?"Ready":cameraError?"Camera unavailable":"Starting..."}</p>
              </div>
              <div className={`rounded-xl p-2.5 border ${gpsStatus==="found"?"border-green-200 bg-green-50":gpsStatus==="denied"?"border-red-200 bg-red-50":"border-border bg-muted/30"}`}>
                <div className="flex items-center gap-1.5 mb-1"><Navigation className={`w-3.5 h-3.5 ${gpsStatus==="found"?"text-green-600":gpsStatus==="denied"?"text-red-500":"text-muted-foreground"}`}/><span className="text-xs text-muted-foreground">GPS</span></div>
                <p className={`text-xs font-semibold ${gpsStatus==="found"?"text-green-700":gpsStatus==="denied"?"text-red-600":"text-muted-foreground"}`}>{gpsStatus==="found"?"Location Found":gpsStatus==="denied"?"Permission Denied":"Acquiring..."}</p>
              </div>
            </div>
            {gpsStatus==="found"&&coords&&(
              <div className="rounded-xl p-3 border border-border bg-muted/20">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C8A84B] mt-0.5 shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{address}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</p>
                    <p className="text-xs text-muted-foreground">Accuracy: ±{Math.round(coords.accuracy)}m · Distance: {dist}m from campus</p>
                  </div>
                  <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${inside?"bg-green-100 text-green-700":"bg-red-100 text-red-600"}`}>{inside?"✓ OK":"✗ Far"}</span>
                </div>
              </div>
            )}
            <div className="text-center py-1">
              <p className="text-2xl font-bold font-mono text-foreground">{timeStr}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{dateStr}</p>
            </div>
            {gpsStatus==="found"&&!inside&&(
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5"/>
                <div><p className="text-xs font-semibold text-red-700">Outside Authorized Location</p><p className="text-xs text-red-600 mt-0.5">You are {dist}m from campus. Attendance will be flagged as Outside Location.</p></div>
              </div>
            )}
            <div className="flex gap-2.5 pt-1">
              <Btn variant="outline" onClick={onClose} className="flex-1">Cancel</Btn>
              <button onClick={takePhoto}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
                style={{backgroundColor:type==="TimeIn"?"#3B82F6":"#EF4444"}}>
                <Camera className="w-4 h-4"/>Take Photo
              </button>
            </div>
          </div>
        )}
        {step==="confirm"&&employee&&(
          <div className="p-4 space-y-3.5">
            <div className="relative rounded-xl overflow-hidden bg-gray-900" style={{aspectRatio:"4/3"}}>
              {photoData&&photoData!=="placeholder"
                ? <img src={photoData} alt="Attendance" className="w-full h-full object-cover"/>
                : <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}><User className="w-10 h-10 text-white"/></div>
                    <p className="text-white/50 text-xs">Photo Captured ✓</p>
                  </div>
              }
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-green-600/90 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                <CheckCircle className="w-3 h-3"/>Captured ✓
              </div>
            </div>
            <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
              <div className="px-3 py-2 border-b border-border bg-muted/40"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Attendance Record</p></div>
              <div className="p-3 space-y-2">
                {([
                  ["Faculty Name", employee.fullName],
                  ["Faculty ID", employee.employeeNo],
                  ["Attendance Type", type==="TimeIn"?"Time In (Clock In)":"Time Out (Clock Out)"],
                  ["Date", nowTime.toLocaleDateString("en-PH",{weekday:"short",year:"numeric",month:"long",day:"numeric"})],
                  ["Time", timeStr],
                  ["Location", address],
                  ["GPS Coordinates", coords?`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`:"N/A"],
                  ["Distance from Campus", `${dist} meters`],
                ] as [string,string][]).map(([label,val])=>(
                  <div key={label} className="flex justify-between items-start gap-2">
                    <span className="text-xs text-muted-foreground shrink-0 w-28">{label}</span>
                    <span className="text-xs font-medium text-foreground text-right flex-1">{val}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-1 border-t border-border">
                  <span className="text-xs text-muted-foreground">Location Status</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${inside?"bg-green-100 text-green-700":"bg-red-100 text-red-600"}`}>{inside?"✓ Location Verified":"✗ Outside Geofence"}</span>
                </div>
              </div>
            </div>
            {coords&&<GPSMapVisualization facultyLat={coords.lat} facultyLng={coords.lng}/>}
            <div className="flex gap-2.5 pt-1">
              <button onClick={handleRetake} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-muted flex items-center justify-center gap-2 transition-colors">
                <RotateCcw className="w-3.5 h-3.5"/>Retake
              </button>
              <button onClick={confirmCapture}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
                style={{backgroundColor:type==="TimeIn"?"#3B82F6":"#EF4444"}}>
                <CheckCircle className="w-3.5 h-3.5"/>Confirm {type==="TimeIn"?"Clock In":"Clock Out"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── FACULTY ATTENDANCE CARD ────────────────────────────────
function FacultyAttendanceCard({ employee, records, onAddRecord }: {
  employee:Employee|null;
  records:PhotoAttendanceRecord[];
  onAddRecord:(rec:Omit<PhotoAttendanceRecord,"id">)=>void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"TimeIn"|"TimeOut">("TimeIn");
  const [now, setNow] = useState(new Date());
  useEffect(()=>{ const t=setInterval(()=>setNow(new Date()),1000); return ()=>clearInterval(t); },[]);

  const today=new Date().toISOString().slice(0,10);
  const myRecs=records.filter(r=>r.date===today&&r.employeeId===(employee?.id||""));
  const timeInRec=myRecs.find(r=>r.type==="TimeIn");
  const timeOutRec=myRecs.find(r=>r.type==="TimeOut");
  const isDone=!!timeInRec&&!!timeOutRec;

  return (
    <>
      <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
        <div className="p-5 text-white" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><Fingerprint className="w-4 h-4" style={{color:"#C8A84B"}}/><span className="text-sm font-semibold">Faculty Attendance</span></div>
            <div className="flex items-center gap-1.5 text-xs text-white/40"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>Live</div>
          </div>
          <p className="text-3xl font-bold font-mono text-center leading-none" style={{color:"#C8A84B"}}>{now.toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</p>
          <p className="text-xs text-white/40 text-center mt-1.5">{now.toLocaleDateString("en-PH",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
          {employee&&<p className="text-xs text-center mt-2 text-white/50 truncate">{employee.fullName} · {employee.employeeNo}</p>}
        </div>
        <div className="bg-card p-4 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl p-3 border ${timeInRec?"border-green-200 bg-green-50":"border-border bg-muted/20"}`}>
              <div className="flex items-center gap-1.5 mb-1.5"><Sunrise className="w-3.5 h-3.5 text-green-600"/><span className="text-xs text-muted-foreground">Time In</span></div>
              <p className={`text-base font-bold font-mono leading-none ${timeInRec?"text-green-700":"text-muted-foreground"}`}>{timeInRec?.time||"—"}</p>
              {timeInRec&&(
                <div className="mt-2 flex items-center gap-1.5">
                  {timeInRec.photo&&timeInRec.photo!=="placeholder"
                    ? <img src={timeInRec.photo} alt="" className="w-8 h-8 rounded-lg object-cover border border-green-200"/>
                    : <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center border border-green-200"><User className="w-3.5 h-3.5 text-green-600"/></div>
                  }
                  <div><p className="text-[10px] text-green-700 font-medium">Photo ✓</p><p className={`text-[10px] font-medium ${timeInRec.withinGeofence?"text-green-600":"text-red-500"}`}>GPS {timeInRec.withinGeofence?"✓ OK":"✗ Far"}</p></div>
                </div>
              )}
            </div>
            <div className={`rounded-xl p-3 border ${timeOutRec?"border-red-200 bg-red-50":"border-border bg-muted/20"}`}>
              <div className="flex items-center gap-1.5 mb-1.5"><AlarmClock className="w-3.5 h-3.5 text-red-500"/><span className="text-xs text-muted-foreground">Time Out</span></div>
              <p className={`text-base font-bold font-mono leading-none ${timeOutRec?"text-red-600":"text-muted-foreground"}`}>{timeOutRec?.time||"—"}</p>
              {timeOutRec&&(
                <div className="mt-2 flex items-center gap-1.5">
                  {timeOutRec.photo&&timeOutRec.photo!=="placeholder"
                    ? <img src={timeOutRec.photo} alt="" className="w-8 h-8 rounded-lg object-cover border border-red-200"/>
                    : <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center border border-red-200"><User className="w-3.5 h-3.5 text-red-500"/></div>
                  }
                  <div><p className="text-[10px] text-red-700 font-medium">Photo ✓</p><p className={`text-[10px] font-medium ${timeOutRec.withinGeofence?"text-green-600":"text-red-500"}`}>GPS {timeOutRec.withinGeofence?"✓ OK":"✗ Far"}</p></div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-muted/20">
            <MapPin className="w-3.5 h-3.5 text-[#C8A84B] shrink-0"/>
            <div className="flex-1 min-w-0"><p className="text-xs font-medium text-foreground truncate">PNU Campus, Taft Ave, Malate, Manila</p><p className="text-xs text-muted-foreground">GPS requested only on Clock In / Clock Out</p></div>
            <div className="flex items-center gap-1 text-xs text-green-600 shrink-0"><div className="w-1.5 h-1.5 rounded-full bg-green-500"/>Active</div>
          </div>
          {isDone ? (
            <div className="py-3 rounded-xl bg-green-50 border border-green-200 text-center">
              <p className="text-sm font-semibold text-green-700 flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4"/>Attendance Complete</p>
              <p className="text-xs text-green-600 mt-0.5">In: {timeInRec?.time} · Out: {timeOutRec?.time}</p>
            </div>
          ) : !timeInRec ? (
            <button onClick={()=>{ setModalType("TimeIn"); setModalOpen(true); }}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>
              <Camera className="w-4 h-4"/>CLOCK IN
            </button>
          ) : (
            <button onClick={()=>{ setModalType("TimeOut"); setModalOpen(true); }}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{backgroundColor:"#DC2626"}}>
              <Camera className="w-4 h-4"/>CLOCK OUT
            </button>
          )}
        </div>
      </div>
      <CameraAttendanceModal open={modalOpen} type={modalType} employee={employee}
        onClose={()=>setModalOpen(false)}
        onCapture={rec=>{ onAddRecord(rec); setModalOpen(false); }}/>
    </>
  );
}

// ── CAMERA ATTENDANCE HISTORY ─────────────────────────────
function CameraAttendanceHistory({ records }: { records:PhotoAttendanceRecord[] }) {
  const grouped: Record<string,{timeIn:PhotoAttendanceRecord|null;timeOut:PhotoAttendanceRecord|null}> = {};
  records.forEach(r => {
    const k=`${r.employeeId}-${r.date}`;
    if (!grouped[k]) grouped[k]={timeIn:null,timeOut:null};
    if (r.type==="TimeIn") grouped[k].timeIn=r; else grouped[k].timeOut=r;
  });
  const entries=Object.values(grouped).sort((a,b)=>{
    const da=(a.timeIn||a.timeOut)?.date||""; const db=(b.timeIn||b.timeOut)?.date||"";
    return db.localeCompare(da);
  });
  const statusColor: Record<string,string> = {
    "Present":"bg-green-100 text-green-700","Late":"bg-amber-100 text-amber-700",
    "Incomplete":"bg-blue-100 text-blue-700","Outside Location":"bg-red-100 text-red-600",
  };
  if (entries.length===0) return (
    <div className="bg-card rounded-xl border border-border p-8 text-center shadow-sm">
      <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2"/>
      <p className="text-sm font-medium text-muted-foreground">No camera attendance records yet</p>
      <p className="text-xs text-muted-foreground mt-1">Use the Clock In button to start recording attendance</p>
    </div>
  );
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold">Camera Attendance History</h3>
        <span className="text-xs text-muted-foreground">{entries.length} day{entries.length!==1?"s":""}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr className="bg-muted/40 border-b border-border">
            {(["Date","Faculty","Time In","Time Out","Photos","Location","Status"] as string[]).map(h=>(
              <th key={h} className={`text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase ${h==="Location"?"hidden lg:table-cell":""}`}>{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-border">
            {entries.map((entry,i)=>{
              const r=entry.timeIn||entry.timeOut;
              if (!r) return null;
              const rawSt=!r.withinGeofence?"Outside Location":!entry.timeOut?"Incomplete":r.status;
              return (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3"><p className="text-xs font-mono font-medium">{fd(r.date)}</p></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><Av name={r.employeeName} size="sm"/><div className="min-w-0"><p className="text-xs font-medium truncate max-w-[90px]">{r.employeeName.split(" ").slice(-2).join(" ")}</p><p className="text-xs text-muted-foreground font-mono">{r.employeeNo}</p></div></div></td>
                  <td className="px-4 py-3"><p className="text-xs font-mono font-semibold text-green-600">{entry.timeIn?.time||"—"}</p></td>
                  <td className="px-4 py-3"><p className="text-xs font-mono font-semibold text-red-500">{entry.timeOut?.time||"—"}</p></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {[{rec:entry.timeIn,bc:"border-green-200",bg:"bg-green-50"},{rec:entry.timeOut,bc:"border-red-200",bg:"bg-red-50"}].map(({rec,bc,bg},pi)=>rec&&(
                        rec.photo&&rec.photo!=="placeholder"
                          ? <img key={pi} src={rec.photo} alt="" className={`w-7 h-7 rounded-lg object-cover border ${bc}`}/>
                          : <div key={pi} className={`w-7 h-7 rounded-lg ${bg} border ${bc} flex items-center justify-center`}><User className="w-3 h-3 text-muted-foreground"/></div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell"><p className="text-xs text-muted-foreground truncate max-w-[110px]">{r.address||"—"}</p><p className={`text-xs font-medium ${r.withinGeofence?"text-green-600":"text-red-500"}`}>{r.distanceFromAuth}m</p></td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[rawSt]||"bg-gray-100 text-gray-600"}`}>{rawSt}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── ADMIN FACULTY MAP VIEW ────────────────────────────────
function AdminFacultyMapView({ records, employees }: { records:PhotoAttendanceRecord[]; employees:Employee[] }) {
  const [selected, setSelected] = useState<PhotoAttendanceRecord|null>(null);
  const today=new Date().toISOString().slice(0,10);
  const todayRecs=records.filter(r=>r.date===today);
  const CX=200,CY=150,SCALE=50000,W=400,H=280;
  const GF_R=Math.round((PNU_CAMPUS.radius/111000)*SCALE);
  const uniqueIn=new Set(todayRecs.filter(r=>r.type==="TimeIn").map(r=>r.employeeId)).size;
  const inGeo=todayRecs.filter(r=>r.withinGeofence).length;
  const outGeo=todayRecs.filter(r=>!r.withinGeofence).length;
  const mapBlocks:number[][]=[
    [10,8,30,25],[60,8,35,25],[105,8,35,25],[155,8,35,25],[205,8,35,25],[255,8,35,25],[305,8,35,25],[355,8,35,25],
    [10,43,30,25],[60,43,35,25],[105,43,35,25],[155,43,35,25],[205,43,35,25],[255,43,35,25],[305,43,35,25],[355,43,35,25],
    [10,88,30,25],[60,88,35,25],[105,88,35,25],[155,88,35,25],[205,88,35,25],[255,88,35,25],[305,88,35,25],[355,88,35,25],
    [10,128,30,25],[60,128,35,25],[105,128,35,25],[155,128,35,25],[205,128,35,25],[255,128,35,25],[305,128,35,25],[355,128,35,25],
    [10,168,30,25],[60,168,35,25],[105,168,35,25],[155,168,35,25],[205,168,35,25],[255,168,35,25],[305,168,35,25],[355,168,35,25],
    [10,208,30,25],[60,208,35,25],[105,208,35,25],[155,208,35,25],[205,208,35,25],[255,208,35,25],[305,208,35,25],[355,208,35,25],
  ];
  const markers=todayRecs.map((r,i)=>{
    const angle=(i/Math.max(todayRecs.length,1))*2*Math.PI;
    const jitter=r.type==="TimeIn"?0:6;
    const baseLat=r.lat||PNU_CAMPUS.lat, baseLng=r.lng||PNU_CAMPUS.lng;
    const fx=Math.min(W-15,Math.max(15,CX+(baseLng-PNU_CAMPUS.lng)*SCALE+Math.cos(angle)*jitter));
    const fy=Math.min(H-15,Math.max(15,CY-(baseLat-PNU_CAMPUS.lat)*SCALE+Math.sin(angle)*jitter));
    return { rec:r, emp:employees.find(e=>e.id===r.employeeId), fx, fy };
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Faculty Clocked In" value={String(uniqueIn)} sub="Today's Time In" icon={UserCheck} color="green"/>
        <StatCard label="Within Geofence" value={String(inGeo)} sub="Location verified" icon={Navigation} color="blue"/>
        <StatCard label="Outside Geofence" value={String(outGeo)} sub="Need verification" icon={AlertTriangle} color="red"/>
        <StatCard label="Total Transactions" value={String(todayRecs.length)} sub="Clock In + Out records" icon={Camera} color="gold"/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2"><Navigation className="w-4 h-4 text-[#C8A84B]"/><h3 className="text-sm font-semibold">Faculty Attendance Map — Today</h3></div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#3B82F6]"/>Campus</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"/>In Range</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"/>Out</span>
            </div>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{height:280,backgroundColor:"#EEF1F5"}}>
            {[50,100,150,200,250,300,350].map(x=><line key={x} x1={x} y1={0} x2={x} y2={H} stroke="white" strokeWidth={8}/>)}
            {[40,80,120,160,200,240].map(y=><line key={y} x1={0} y1={y} x2={W} y2={y} stroke="white" strokeWidth={6}/>)}
            {mapBlocks.map(([x,y,w,h],i)=>(
              <rect key={i} x={x} y={y} width={w} height={h} rx={3} fill={i%9===0?"#D1FAE5":i%6===0?"#DBEAFE":i%4===0?"#FEF3C7":i%2===0?"#EDE9FE":"#F1F5F9"}/>
            ))}
            <rect x={0} y={H-20} width={W} height={20} fill="#BAE6FD" opacity={0.5}/>
            <text x={W/2} y={H-6} textAnchor="middle" fontSize={8} fill="#0369A1">Manila Bay — Taft Avenue</text>
            <circle cx={CX} cy={CY} r={GF_R} fill="#3B82F6" fillOpacity={0.08} stroke="#3B82F6" strokeWidth={1.5} strokeDasharray="6,4"/>
            <text x={CX} y={CY-GF_R-5} textAnchor="middle" fontSize={8} fill="#3B82F6">100m Geofence</text>
            <circle cx={CX} cy={CY} r={14} fill="#3B82F6" fillOpacity={0.2}/>
            <circle cx={CX} cy={CY} r={9} fill="#3B82F6"/>
            <circle cx={CX} cy={CY} r={4} fill="white"/>
            <text x={CX} y={CY+22} textAnchor="middle" fontSize={8} fill="#3B82F6" fontWeight="bold">PNU Campus</text>
            {markers.length===0&&<text x={CX} y={CY+42} textAnchor="middle" fontSize={10} fill="#94A3B8">No attendance records today — use Camera tab to Clock In</text>}
            {markers.map(({rec,emp,fx,fy},i)=>(
              <g key={i} style={{cursor:"pointer"}} onClick={()=>setSelected(selected?.id===rec.id?null:rec)}>
                <circle cx={fx} cy={fy} r={selected?.id===rec.id?14:10} fill={rec.withinGeofence?"#22C55E":"#EF4444"} opacity={0.9}/>
                <circle cx={fx} cy={fy} r={selected?.id===rec.id?5.5:4} fill="white"/>
                {selected?.id===rec.id&&<circle cx={fx} cy={fy} r={19} fill="none" stroke={rec.withinGeofence?"#22C55E":"#EF4444"} strokeWidth={2} strokeDasharray="3,3"/>}
                <text x={fx} y={fy-15} textAnchor="middle" fontSize={7} fill={rec.withinGeofence?"#16A34A":"#DC2626"} fontWeight="bold">{emp?.firstName?.split(" ")[0]||"?"}</text>
                <text x={fx} y={fy+19} textAnchor="middle" fontSize={6} fill="#64748B">{rec.type==="TimeIn"?"IN":"OUT"}</text>
              </g>
            ))}
          </svg>
        </div>
        <div className="space-y-3">
          {selected?(
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold">Faculty Details</h3>
                <button onClick={()=>setSelected(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-lg"><X className="w-4 h-4"/></button>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3"><Av name={selected.employeeName} size="md"/><div className="min-w-0"><p className="text-sm font-semibold truncate">{selected.employeeName}</p><p className="text-xs text-muted-foreground">{selected.employeeNo}</p></div></div>
                {selected.photo&&selected.photo!=="placeholder"
                  ? <img src={selected.photo} alt="" className="w-full h-28 object-cover rounded-xl border border-border"/>
                  : <div className="w-full h-20 rounded-xl bg-muted/30 border border-border flex flex-col items-center justify-center gap-1"><Camera className="w-5 h-5 text-muted-foreground"/><p className="text-xs text-muted-foreground">Photo captured</p></div>
                }
                <div className="space-y-2">
                  {([["Type",selected.type==="TimeIn"?"Time In":"Time Out"],["Time",selected.time],["Date",fd(selected.date)],["Distance",`${selected.distanceFromAuth}m from campus`]] as [string,string][]).map(([label,val])=>(
                    <div key={label} className="flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><span className="font-medium">{val}</span></div>
                  ))}
                  <div className="flex justify-between items-center text-xs"><span className="text-muted-foreground">Geofence</span><span className={`font-semibold px-2 py-0.5 rounded-full ${selected.withinGeofence?"bg-green-100 text-green-700":"bg-red-100 text-red-600"}`}>{selected.withinGeofence?"✓ Inside":"✗ Outside"}</span></div>
                </div>
              </div>
            </div>
          ):(
            <div className="bg-muted/30 rounded-xl border border-border p-5 text-center">
              <Navigation className="w-5 h-5 text-muted-foreground mx-auto mb-2"/>
              <p className="text-xs text-muted-foreground">Click a marker on the map to view faculty details</p>
            </div>
          )}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between"><h3 className="text-sm font-semibold">Today's Activity</h3><span className="text-xs text-muted-foreground">{todayRecs.length} records</span></div>
            <div className="divide-y divide-border max-h-52 overflow-y-auto">
              {todayRecs.length===0?(
                <div className="px-4 py-6 text-center text-xs text-muted-foreground">No records yet today</div>
              ):todayRecs.map((r,i)=>(
                <button key={i} onClick={()=>setSelected(r)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-muted/20 transition-colors text-left ${selected?.id===r.id?"bg-muted/30":""}`}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-[11px] font-bold" style={{backgroundColor:r.type==="TimeIn"?"#3B82F6":"#EF4444"}}>{r.type==="TimeIn"?"IN":"OUT"}</div>
                  <div className="flex-1 min-w-0"><p className="text-xs font-medium truncate">{r.employeeName.split(" ").slice(-2).join(" ")}</p><p className="text-xs text-muted-foreground">{r.time}</p></div>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${r.withinGeofence?"bg-green-500":"bg-red-500"}`}/>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Administrator access overview for the existing demonstration application.
// Actual authorization must be enforced by a secure backend before production use.
function AdminAccessCenter() {
  const modules = [
    "Employee Records & 201 Files","Recruitment & Selection","Faculty Management",
    "Payroll Management","Leave Management","Attendance & DTR",
    "Learning & Development","Performance Management","Rewards & Recognition",
    "Health & Wellness","Reports & Analytics"
  ];
  const roles = [
    ["System Administrator","All modules, configuration and audit oversight"],
    ["HR Records Staff","Employee records and personnel documents"],
    ["Recruitment Staff","Vacancies, applicants and hiring"],
    ["Payroll Staff","Payroll and deductions"],
    ["Timekeeping Staff","Attendance and DTR"],
    ["Leave Management Staff","Leave processing"],
    ["Training Staff","Learning and development"],
    ["Performance Management Staff","Performance reviews"],
    ["Rewards Staff","Recognition programs"],
    ["Wellness Staff","Health and wellness"],
    ["Faculty Management Staff","Faculty profiles"],
    ["Management / Executive","Reports and oversight"],
    ["Employee / Faculty","Self-service only"]
  ];
  return <div className="space-y-5">
    <SectionHeader title="System Administrator Portal" subtitle="Centralized overview of all HRIPS modules, roles and system administration"/>
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <strong>Administrator access overview:</strong> This overview describes intended permissions. Access to database records is enforced only in the secure workspace; other modules are not yet production-ready.
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[["11","HRIPS Modules"],["13","Defined User Roles"],["Full","Administrator Module Visibility"]].map(([value,label])=><div key={label} className="rounded-xl bg-card border border-border p-5"><p className="text-3xl font-bold text-primary">{value}</p><p className="text-sm text-muted-foreground mt-1">{label}</p></div>)}
    </div>
    <div className="rounded-xl bg-card border border-border p-5">
      <h3 className="font-semibold mb-3 flex items-center gap-2"><Shield className="w-5 h-5"/>Full Module Access — Administrator</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">{modules.map(m=><div key={m} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"><span>{m}</span><span className="text-green-700 font-semibold flex items-center gap-1"><CheckCircle className="w-4 h-4"/>Full Access</span></div>)}</div>
    </div>
    <div className="rounded-xl bg-card border border-border p-5">
      <h3 className="font-semibold mb-3 flex items-center gap-2"><Users className="w-5 h-5"/>Roles & Permission Overview</h3>
      <div className="space-y-2">{roles.map(([name,scope])=><div key={name} className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-border py-2 text-sm"><span className="font-medium">{name}</span><span className="text-muted-foreground">{scope}</span></div>)}</div>
    </div>
    <div className="rounded-xl bg-card border border-border p-5">
      <h3 className="font-semibold mb-2 flex items-center gap-2"><Settings className="w-5 h-5"/>System Administration</h3>
      <p className="text-sm text-muted-foreground">Administrator can navigate to all existing modules, Audit Trail, Reports, Notifications and Settings using the sidebar. Changes to roles and permissions are intentionally not enabled in this frontend-only prototype.</p>
    </div>
  </div>;
}

function SecurePayrollWorkspace(){
 const [setupToken,setSetupToken]=useState(new URLSearchParams(window.location.search).get("setup")||"");const [setupPassword,setSetupPassword]=useState("");const [setupMessage,setSetupMessage]=useState("");const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [user,setUser]=useState<{email:string;role:string}|null>(null);
 const [periods,setPeriods]=useState<Array<{id:string;period_label:string;period_start:string;period_end:string;status:string}>>([]);
 const [label,setLabel]=useState("");const [start,setStart]=useState("");const [end,setEnd]=useState("");const [message,setMessage]=useState("");const [notifications,setNotifications]=useState<Array<{id:string;title:string;body:string;kind:string;read_at:string|null;created_at:string}>>([]); const [hrEmployees,setHrEmployees]=useState<Array<{id:string;employee_number:string;full_name:string;department:string|null;position_title:string|null}>>([]); const [empNo,setEmpNo]=useState("");const [empName,setEmpName]=useState("");const [empDept,setEmpDept]=useState("");const [empPosition,setEmpPosition]=useState("");
 const refreshNotifications=async()=>{const r=await fetch("/api/notifications",{credentials:"same-origin"});if(r.ok){const d=await r.json();setNotifications(d.notifications||[]);}};
 const markNotifications=async(id?:string)=>{const r=await fetch("/api/notifications",{method:"PATCH",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify(id?{id}:{all:true})});if(r.ok)void refreshNotifications();};
 const refreshEmployees=async()=>{const r=await fetch("/api/hr/employees",{credentials:"same-origin"});if(r.ok){const d=await r.json();setHrEmployees(d.employees||[]);}};
 const refresh=async()=>{const r=await fetch("/api/payroll/periods",{credentials:"same-origin"});if(r.ok){const d=await r.json();setPeriods(d.periods||[]);}else setMessage("Unable to retrieve authorized payroll records");};
 useEffect(()=>{void fetch("/api/auth/me",{credentials:"same-origin"}).then(async r=>{if(r.ok){setUser(await r.json());void refresh();void refreshEmployees();void refreshNotifications();}}).catch(()=>{});},[]);
 const requestSetup=async()=>{const r=await fetch("/api/auth/request-setup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});const d=await r.json();setSetupMessage(d.message||d.error||"Unable to request setup");};
 const completeSetup=async(e:React.FormEvent)=>{e.preventDefault();const r=await fetch("/api/auth/complete-setup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:setupToken,password:setupPassword})});const d=await r.json();setSetupMessage(r.ok?"Account activated. Please sign in.":d.error||"Activation failed");if(r.ok){setSetupToken("");setSetupPassword("");window.history.replaceState(null,"","/secure-payroll");}};
 const login=async(e:React.FormEvent)=>{e.preventDefault();setMessage("");const r=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({email,password})});const d=await r.json();if(r.ok){setUser(d);setPassword("");void refresh();}else setMessage(d.error||"Login failed");};
 const create=async(e:React.FormEvent)=>{e.preventDefault();const r=await fetch("/api/payroll/periods",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({label,start,end})});const d=await r.json();setMessage(r.ok?"Payroll period saved to PostgreSQL":d.error||"Unable to create period");if(r.ok){setLabel("");void refresh();}};
 const createEmployee=async(e:React.FormEvent)=>{e.preventDefault();const r=await fetch("/api/hr/employees",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({employeeNumber:empNo,fullName:empName,department:empDept,positionTitle:empPosition})});const d=await r.json();setMessage(r.ok?"Employee record saved to PostgreSQL":d.error||"Unable to save employee");if(r.ok){setEmpNo("");setEmpName("");void refreshEmployees();void refreshNotifications();}};
 const logout=async()=>{await fetch("/api/auth/logout",{method:"POST",credentials:"same-origin"});setUser(null);setPeriods([]);setHrEmployees([]);setNotifications([]);};
 return <div className="min-h-screen bg-slate-50 p-6 text-slate-900"><div className="mx-auto max-w-3xl rounded-xl border bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-4"><div><h1 className="text-xl font-bold">PNU Secure Payroll Database</h1><p className="text-sm text-slate-600">PostgreSQL-backed payroll period management · authorized staff only</p></div><a className="text-sm underline" href="/">Back to HRIPS portal</a></div>
 {!user&&setupToken?<form onSubmit={completeSetup} className="mt-6 space-y-3 max-w-md"><h2 className="font-semibold">Activate your administrator account</h2><input aria-label="New password" type="password" minLength={14} maxLength={128} required placeholder="New password (at least 14 characters)" className="w-full border rounded p-2" value={setupPassword} onChange={e=>setSetupPassword(e.target.value)}/><button className="bg-slate-900 text-white rounded px-4 py-2">Activate account</button></form>:!user?<form onSubmit={login} className="mt-6 space-y-3 max-w-md"><p className="text-sm">Sign in with a provisioned database staff account. Only activated accounts can sign in.</p><input aria-label="Work email" className="w-full border rounded p-2" type="email" required placeholder="Work email" value={email} onChange={e=>setEmail(e.target.value)}/><input aria-label="Password" className="w-full border rounded p-2" type="password" required placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/><button className="bg-slate-900 text-white rounded px-4 py-2">Sign in</button><button type="button" className="ml-3 text-sm underline" onClick={()=>void requestSetup()}>Request account setup email</button></form>:<div className="mt-6"><div className="flex justify-between items-center"><p className="text-sm">Signed in as <strong>{user.email}</strong> ({user.role})</p><button onClick={logout} className="border rounded px-3 py-1 text-sm">Log out</button></div>{["system_admin","payroll_staff"].includes(user.role)&&<form onSubmit={create} className="mt-6 grid gap-2 sm:grid-cols-4"><input className="border rounded p-2" placeholder="Payroll period label" required value={label} onChange={e=>setLabel(e.target.value)}/><input aria-label="Period start" className="border rounded p-2" type="date" required value={start} onChange={e=>setStart(e.target.value)}/><input aria-label="Period end" className="border rounded p-2" type="date" required value={end} onChange={e=>setEnd(e.target.value)}/><button className="bg-slate-900 text-white rounded px-3 py-2">Create draft period</button></form>}<div className="mt-6 border-t pt-5"><div className="flex justify-between items-center"><h2 className="font-semibold">Notifications {notifications.filter(n=>!n.read_at).length>0?`(${notifications.filter(n=>!n.read_at).length} unread)`:""}</h2><button className="text-sm underline" onClick={()=>void markNotifications()}>Mark all read</button></div><div className="mt-2 space-y-2">{notifications.length===0?<p className="text-sm text-slate-500">No notifications yet.</p>:notifications.map(n=><div key={n.id} className={`rounded border p-3 text-sm ${n.read_at?"bg-white":"bg-blue-50"}`}><div className="flex justify-between gap-2"><strong>{n.title}</strong>{!n.read_at&&<button className="text-xs underline" onClick={()=>void markNotifications(n.id)}>Mark read</button>}</div><p className="mt-1">{n.body}</p><p className="mt-1 text-xs text-slate-500">{new Date(n.created_at).toLocaleString()}</p></div>)}</div></div><div className="mt-6 border-t pt-5"><h2 className="font-semibold">HR Employee Records (PostgreSQL)</h2><p className="text-xs text-slate-500">Only verified authorized HR staff may enter personnel records. No sample employees are imported.</p>{["system_admin","hr_admin"].includes(user.role)&&<form onSubmit={createEmployee} className="mt-3 grid gap-2 sm:grid-cols-5"><input className="border rounded p-2" placeholder="Employee number" required value={empNo} onChange={e=>setEmpNo(e.target.value)}/><input className="border rounded p-2" placeholder="Full name" required value={empName} onChange={e=>setEmpName(e.target.value)}/><input className="border rounded p-2" placeholder="Department" value={empDept} onChange={e=>setEmpDept(e.target.value)}/><input className="border rounded p-2" placeholder="Position" value={empPosition} onChange={e=>setEmpPosition(e.target.value)}/><button className="bg-slate-900 text-white rounded px-3 py-2">Save employee</button></form>}<div className="mt-3 space-y-2">{hrEmployees.length===0?<p className="text-sm text-slate-500">No authorized employee records yet.</p>:hrEmployees.map(emp=><div key={emp.id} className="border rounded p-2 text-sm"><strong>{emp.full_name}</strong> · {emp.employee_number} · {emp.department||"No department"} · {emp.position_title||"No position"}</div>)}</div></div><div className="mt-6"><h2 className="font-semibold">Saved payroll periods</h2>{periods.length===0?<p className="text-sm text-slate-600 mt-2">No payroll periods saved yet.</p>:<div className="mt-2 space-y-2">{periods.map(p=><div key={p.id} className="border rounded p-3 text-sm"><strong>{p.period_label}</strong> · {String(p.period_start).slice(0,10)} – {String(p.period_end).slice(0,10)} · {p.status}</div>)}</div>}</div></div>}
 {setupMessage&&<p role="status" className="text-sm mt-4">{setupMessage}</p>}{message&&<p role="status" className="text-sm mt-4 text-amber-800">{message}</p>}<p className="mt-6 text-xs text-slate-500">Actual PNU employee data has not been imported. Payroll computation, approval and bank remittance are not enabled in this workspace.</p></div></div>;
}

// ── MAIN APP ──────────────────────────────────────────────
export default function App() {
  if(window.location.pathname==="/secure-payroll") return <SecurePayrollWorkspace/>;
  const [screen, setScreen] = useState<AppScreen>(window.location.pathname==="/apply"?"apply":"home");
  const [loginRole, setLoginRole] = useState<Role>("admin");
  const [role, setRole] = useState<Role>("admin");
  const [currentUser, setCurrentUser] = useState<UserAccount|null>(null);
  const [page, setPage] = useState<Page>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [selEmp, setSelEmp] = useState<Employee|null>(null);
  const [selPay, setSelPay] = useState<PayrollRun|null>(null);

  const [employees, setEmployees] = useState<Employee[]>(()=>{
    const savedTrainingPds=readRecruitmentStorage<Record<string,Pick<Employee,"trainingRecords"|"onboardingStatus">>>("pnu-training-pds",{});
    const savedEmploymentHistory=readRecruitmentStorage<EmploymentHistoryRecord[]>("pnu-hr-records-employment-history",[]);
    return INIT_EMPLOYEES.map(employee=>{
      const currentEmployment=savedEmploymentHistory.filter(record=>record.employeeId===employee.id&&!record.effectiveTo)
        .sort((a,b)=>b.effectiveFrom.localeCompare(a.effectiveFrom))[0];
      return {
        ...employee,
        ...(currentEmployment?{position:currentEmployment.position,rank:currentEmployment.position,
          employmentType:currentEmployment.employmentType,status:currentEmployment.employmentStatus,
          salaryGrade:currentEmployment.salaryGrade,step:currentEmployment.step,
          personnelCategory:currentEmployment.personnelCategory}:{}),
        trainingRecords:savedTrainingPds[employee.id]?.trainingRecords||INIT_NOMINATIONS.filter(n=>n.employeeId===employee.id&&(n.status==="Approved"||n.status==="Completed"))
          .map(n=>INIT_TRAININGS.find(program=>program.id===n.programId)?.title)
          .filter((title):title is string=>Boolean(title)),
        onboardingStatus:savedTrainingPds[employee.id]?.onboardingStatus,
      };
    });
  });
  const [leaves, setLeaves] = useState<LeaveRequest[]>(()=>readRecruitmentStorage("pnu-leave-requests",INIT_LEAVES));
  const [payrolls, setPayrolls] = useState<PayrollRun[]>(INIT_PAYROLLS);
  const [dtr, setDtr] = useState<DtrRecord[]>(INIT_DTR);
  const [notifs, setNotifs] = useState<NotifItem[]>(INIT_NOTIFS);
  const [photoRecords, setPhotoRecords] = useState<PhotoAttendanceRecord[]>([]);
  const [vacancies, setVacancies] = useState<JobVacancy[]>(readExternalVacancies);
  const [applicants, setApplicants] = useState<Applicant[]>(()=>readRecruitmentStorage("pnu-recruitment-applicants",INIT_APPLICANTS));
  const [trainings, setTrainings] = useState<TrainingProgram[]>(()=>readRecruitmentStorage("pnu-training-programs",INIT_TRAININGS));
  const [nominations, setNominations] = useState<TrainingNomination[]>(()=>readRecruitmentStorage("pnu-training-nominations",INIT_NOMINATIONS));
  const [onboarding, setOnboarding] = useState<OnboardingRecord[]>(()=>readRecruitmentStorage("pnu-onboarding-records",[]));
  const [positionCompetencies, setPositionCompetencies] = useState<PositionCompetency[]>(()=>readRecruitmentStorage("pnu-position-competencies",INIT_POSITION_COMPETENCIES));
  const [employeeCompetencies, setEmployeeCompetencies] = useState<EmployeeCompetency[]>(()=>readRecruitmentStorage("pnu-employee-competencies",INIT_EMPLOYEE_COMPETENCIES));
  const [ipcr, setIpcr] = useState<PerformanceRating[]>(()=>readRecruitmentStorage("pnu-performance-ratings",INIT_IPCR));
  const [bonusForms, setBonusForms] = useState<PerformanceBonusForm[]>(()=>readRecruitmentStorage("pnu-performance-bonus-forms",[]));
  const [developmentPlans, setDevelopmentPlans] = useState<IndividualDevelopmentPlan[]>(()=>readRecruitmentStorage("pnu-individual-development-plans",[]));
  const [coachingRecords, setCoachingRecords] = useState<CoachingRecord[]>(()=>readRecruitmentStorage("pnu-performance-coaching",[]));
  const [rewards, setRewards] = useState<RewardNomination[]>(()=>readRecruitmentStorage("pnu-rewards-nominations",INIT_REWARDS));
  const [wellness, setWellness] = useState<WellnessRecord[]>(()=>readRecruitmentStorage("pnu-wellness-records",INIT_WELLNESS));
  const [healthRiskAssessments, setHealthRiskAssessments] = useState<HealthRiskAssessment[]>(()=>readRecruitmentStorage("pnu-health-risk-assessments",[]));
  const [wellnessPrograms, setWellnessPrograms] = useState<WellnessProgram[]>(()=>readRecruitmentStorage("pnu-wellness-programs",INIT_WELLNESS_PROGRAMS));
  const [counselingRecords, setCounselingRecords] = useState<CounselingRecord[]>(()=>readRecruitmentStorage("pnu-counseling-records",[]));
  const [pdsRevisions, setPdsRevisions] = useState<PdsRevision[]>(()=>readRecruitmentStorage("pnu-hr-records-pds-revisions",[]));
  const [personnelDocuments, setPersonnelDocuments] = useState<PersonnelDocument[]>(()=>readRecruitmentStorage("pnu-hr-records-documents",[]));
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentHistoryRecord[]>(()=>readRecruitmentStorage("pnu-hr-records-employment-history",[]));
  const [employeeServiceRequests, setEmployeeServiceRequests] = useState<EmployeeServiceRequest[]>(()=>readRecruitmentStorage("pnu-hr-records-service-requests",[]));
  const [hrCommunications, setHrCommunications] = useState<HROfficeCommunication[]>(()=>readRecruitmentStorage("pnu-hr-records-communications",[]));
  const [faculty] = useState<FacultyProfile[]>(INIT_FACULTY);
  const [toast, setToast] = useState("");

  useEffect(()=>{
    localStorage.setItem("pnu-recruitment-vacancies",JSON.stringify(vacancies));
  },[vacancies]);

  useEffect(()=>{
    localStorage.setItem("pnu-recruitment-applicants",JSON.stringify(applicants));
  },[applicants]);

  useEffect(()=>{localStorage.setItem("pnu-leave-requests",JSON.stringify(leaves));},[leaves]);

  useEffect(()=>{localStorage.setItem("pnu-training-programs",JSON.stringify(trainings));},[trainings]);
  useEffect(()=>{localStorage.setItem("pnu-training-nominations",JSON.stringify(nominations));},[nominations]);
  useEffect(()=>{localStorage.setItem("pnu-onboarding-records",JSON.stringify(onboarding));},[onboarding]);
  useEffect(()=>{localStorage.setItem("pnu-position-competencies",JSON.stringify(positionCompetencies));},[positionCompetencies]);
  useEffect(()=>{localStorage.setItem("pnu-employee-competencies",JSON.stringify(employeeCompetencies));},[employeeCompetencies]);
  useEffect(()=>{localStorage.setItem("pnu-performance-ratings",JSON.stringify(ipcr));},[ipcr]);
  useEffect(()=>{localStorage.setItem("pnu-performance-bonus-forms",JSON.stringify(bonusForms));},[bonusForms]);
  useEffect(()=>{localStorage.setItem("pnu-individual-development-plans",JSON.stringify(developmentPlans));},[developmentPlans]);
  useEffect(()=>{localStorage.setItem("pnu-performance-coaching",JSON.stringify(coachingRecords));},[coachingRecords]);
  useEffect(()=>{localStorage.setItem("pnu-rewards-nominations",JSON.stringify(rewards));},[rewards]);
  useEffect(()=>{localStorage.setItem("pnu-wellness-records",JSON.stringify(wellness));},[wellness]);
  useEffect(()=>{localStorage.setItem("pnu-health-risk-assessments",JSON.stringify(healthRiskAssessments));},[healthRiskAssessments]);
  useEffect(()=>{localStorage.setItem("pnu-wellness-programs",JSON.stringify(wellnessPrograms));},[wellnessPrograms]);
  useEffect(()=>{localStorage.setItem("pnu-counseling-records",JSON.stringify(counselingRecords));},[counselingRecords]);
  useEffect(()=>{localStorage.setItem("pnu-hr-records-pds-revisions",JSON.stringify(pdsRevisions));},[pdsRevisions]);
  useEffect(()=>{localStorage.setItem("pnu-hr-records-documents",JSON.stringify(personnelDocuments));},[personnelDocuments]);
  useEffect(()=>{localStorage.setItem("pnu-hr-records-employment-history",JSON.stringify(employmentHistory));},[employmentHistory]);
  useEffect(()=>{localStorage.setItem("pnu-hr-records-service-requests",JSON.stringify(employeeServiceRequests));},[employeeServiceRequests]);
  useEffect(()=>{localStorage.setItem("pnu-hr-records-communications",JSON.stringify(hrCommunications));},[hrCommunications]);
  useEffect(()=>{
    localStorage.setItem("pnu-training-pds",JSON.stringify(Object.fromEntries(employees.map(e=>[e.id,{trainingRecords:e.trainingRecords||[],onboardingStatus:e.onboardingStatus}]))));
  },[employees]);

  useEffect(()=>{
    const syncRecruitment=(event:StorageEvent)=>{
      if(event.key==="pnu-recruitment-vacancies"&&event.newValue) setVacancies(JSON.parse(event.newValue) as JobVacancy[]);
      if(event.key==="pnu-recruitment-applicants"&&event.newValue) setApplicants(JSON.parse(event.newValue) as Applicant[]);
    };
    window.addEventListener("storage",syncRecruitment);
    return ()=>window.removeEventListener("storage",syncRecruitment);
  },[]);

  const unread = notifs.filter(n=>!n.read).length;
  const showToast = (msg: string) => setToast(msg);

  const handleSelectPortal = (r: Role) => { setLoginRole(r); setScreen("login"); };
  const handleLogin = (account: UserAccount) => { setRole(account.role); setCurrentUser(account); setPage("dashboard"); setScreen("app"); };
  const handleLogout = () => { setScreen("portal"); setCurrentUser(null); setPage("dashboard"); };
  const navigate = (p: Page) => setPage(p);

  const handleAddEmployee = useCallback((f: Partial<Employee>) => {
    const id = nextId(employees,"EMP");
    const num = id.replace("EMP","");
    const color = EMP_COLORS[employees.length % EMP_COLORS.length];
    const prefix = f.gender==="Male"?"Mr.":"Ms.";
    const mid = f.middleName?f.middleName[0]+". ":"";
    const fullName = `${prefix} ${f.firstName} ${mid}${f.lastName}`;
    const emp: Employee = {
      id, employeeNo:`PNU-2024-${num}`, fullName,
      lastName:f.lastName||"", firstName:f.firstName||"", middleName:f.middleName||"",
      position:f.position||"", rank:f.rank||f.position||"",
      department:f.department||DEPTS[0], employmentType:f.employmentType||"Permanent",
      salaryGrade:f.salaryGrade||1, step:f.step||1, monthlySalary:f.monthlySalary||0,
      status:f.status||"Active", gender:f.gender||"Female",
      birthDate:f.birthDate||"1990-01-01", email:f.email||"",
      phone:f.phone||"", dateHired:f.dateHired||"2024-01-01",
      address:f.address||"", education:f.education||"", eligibility:f.eligibility||"", workExperience:f.workExperience||"",
      tin:f.tin||"", gsis:f.gsis||"", philhealth:f.philhealth||"", pagibig:f.pagibig||"",
      vacationLeave:f.vacationLeave||15, sickLeave:f.sickLeave||15, color,
    };
    setEmployees(prev=>[...prev,emp]);
    showToast(`${fullName} added successfully.`);
  }, [employees]);

  const handleEditEmployee = useCallback((updated: Employee) => {
    setEmployees(prev=>prev.map(e=>e.id===updated.id?updated:e));
    if (selEmp?.id===updated.id) setSelEmp(updated);
    showToast("Employee record updated.");
  }, [selEmp]);

  const handleDeleteEmployee = useCallback((id: string) => {
    const emp = employees.find(e=>e.id===id);
    setEmployees(prev=>prev.filter(e=>e.id!==id));
    showToast(`${emp?.fullName||"Employee"} removed from records.`);
  }, [employees]);

  const handleUpdateLeave = useCallback((id: string, status: "Approved"|"Rejected", remarksTxt: string, by: string) => {
    setLeaves(prev=>prev.map(l=>l.id===id?{...l,status,approvedBy:by,remarks:remarksTxt}:l));
    showToast(`Leave request ${status.toLowerCase()}.`);
  }, []);

  const handleAddLeave = useCallback((lr: Omit<LeaveRequest,"id">) => {
    const id = `LR-2024-${String(leaves.length+1).padStart(3,"0")}`;
    setLeaves(prev=>[...prev,{...lr,id}]);
    showToast("Leave application submitted.");
  }, [leaves.length]);

  const handlePayrollStatus = useCallback((id: string, next: PayrollRun["status"]) => {
    setPayrolls(prev=>prev.map(p=>p.id===id?{...p,status:next}:p));
    showToast(`Payroll ${next==="Released"?"released":"status updated"} successfully.`);
  }, []);

  const handleEditDtr = useCallback((rec: DtrRecord) => {
    setDtr(prev=>{
      const idx = prev.findIndex(d=>d.employeeId===rec.employeeId&&d.date===rec.date);
      if (idx>=0) { const next=[...prev]; next[idx]=rec; return next; }
      return [...prev,rec];
    });
    showToast("DTR record updated.");
  }, []);

  const handleMarkRead = useCallback((id: string) => {
    setNotifs(prev=>prev.map(n=>n.id===id?{...n,read:true}:n));
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifs(prev=>prev.map(n=>({...n,read:true})));
  }, []);

  const handleAddPhotoRecord = useCallback((rec: Omit<PhotoAttendanceRecord,"id">) => {
    const id=`PAR-${Date.now()}`;
    setPhotoRecords(prev=>[...prev,{...rec,id}]);
    showToast(`${rec.type==="TimeIn"?"Clock In":"Clock Out"} recorded for ${rec.employeeName.split(" ").slice(-1)[0]} — ${rec.withinGeofence?"Location verified ✓":"Outside geofence ✗"}`);
  }, []);

  const handleAddApplicant = useCallback((applicant: Omit<Applicant,"id"|"trackingNo">) => {
    const now=Date.now();
    const record:Applicant={...applicant,id:`APP-${now}`,trackingNo:`PNU-REC-${new Date().getFullYear()}-${String(now).slice(-6)}`};
    setApplicants(prev=>[...prev,record]);
    setVacancies(prev=>prev.map(v=>v.id===record.vacancyId?{...v,applicants:v.applicants+1}:v));
    return record;
  },[]);

  const handleHireApplicant = useCallback((applicant:Applicant) => {
    const vacancy=vacancies.find(v=>v.id===applicant.vacancyId);
    const parsedName=applicant.name.split(/\s+/);
    const employmentType:Employee["employmentType"]=vacancy?.employmentType==="Permanent"?"Permanent":vacancy?.employmentType==="COS"?"COS":vacancy?.employmentType==="Part-Time"?"Part-time":"Contractual";
    handleAddEmployee({
      firstName:applicant.firstName||parsedName[0]||"",
      middleName:applicant.middleName||"",
      lastName:applicant.lastName||parsedName.slice(1).join(" "),
      gender:applicant.gender||"Female",
      birthDate:applicant.birthDate||"1990-01-01",
      email:applicant.email,
      phone:applicant.phone||"",
      address:applicant.address||"",
      education:applicant.education||"",
      eligibility:applicant.eligibility||"",
      workExperience:applicant.experience||"",
      position:vacancy?.position||"",
      rank:vacancy?.position||"",
      department:vacancy?.department||"",
      employmentType,
      salaryGrade:vacancy?.salaryGrade||1,
      status:"Active",
      dateHired:new Date().toISOString().slice(0,10),
    });
  },[vacancies,handleAddEmployee]);

  const handleUpdateTrainingNomination = useCallback((updated:TrainingNomination) => {
    const shouldSync=updated.status==="Approved"||updated.status==="Completed";
    const nomination={...updated,pdsSynced:shouldSync||updated.pdsSynced};
    setNominations(prev=>prev.map(n=>n.id===nomination.id?nomination:n));
    if(shouldSync) {
      const employee=employees.find(e=>e.id===nomination.employeeId);
      const program=trainings.find(p=>p.id===nomination.programId);
      if(employee&&program&&!(employee.trainingRecords||[]).includes(program.title)) {
        setEmployees(prev=>prev.map(e=>e.id===employee.id?{...e,trainingRecords:[...(e.trainingRecords||[]),program.title]}:e));
      }
    }
  },[employees,trainings]);

  const handleUpdateOnboarding = useCallback((updated:OnboardingRecord) => {
    const complete=updated.orientationStatus==="Completed"&&updated.completedProgramIds.length===updated.mandatoryProgramIds.length;
    const record={...updated,status:complete?"Completed" as const:"In Progress" as const};
    setOnboarding(prev=>prev.map(o=>o.id===record.id?record:o));
    const employee=employees.find(e=>e.id===record.employeeId);
    if(employee) {
      const requiredTitles=record.completedProgramIds.map(id=>trainings.find(p=>p.id===id)?.title).filter((title):title is string=>Boolean(title));
      setEmployees(prev=>prev.map(e=>e.id===employee.id?{...e,onboardingStatus:record.status,trainingRecords:Array.from(new Set([...(e.trainingRecords||[]),...requiredTitles]))}:e));
    }
  },[employees,trainings]);

  const handleUpdateEmployeeCompetency = useCallback((updated:EmployeeCompetency) => {
    setEmployeeCompetencies(prev=>{
      const index=prev.findIndex(c=>c.employeeId===updated.employeeId&&c.competency===updated.competency);
      if(index<0)return [...prev,updated];
      return prev.map((c,i)=>i===index?updated:c);
    });
  },[]);

  const handleUpdatePerformanceRating = useCallback((updated:PerformanceRating) => {
    setIpcr(prev=>prev.map(r=>r.id===updated.id?updated:r));
  },[]);

  const renderEmployeeRecords = (selfService=false) => <EmployeeRecordsPage
    employees={employees} role={selfService?"employee":"hr_records"}
    employeeId={currentUser?.employeeId||employees[0]?.id||""}
    userName={currentUser?.fullName||ROLE_LABELS[role]}
    pdsRevisions={pdsRevisions} documents={personnelDocuments} employmentHistory={employmentHistory}
    serviceRequests={employeeServiceRequests} communications={hrCommunications}
    onAddPdsRevision={revision=>setPdsRevisions(prev=>[...prev,{...revision,id:`PDS-${Date.now()}`}])}
    onReviewPdsRevision={updated=>setPdsRevisions(prev=>prev.map(revision=>revision.id===updated.id?updated:revision))}
    onAddDocument={document=>setPersonnelDocuments(prev=>[...prev,{...document,id:`DOC-${Date.now()}`}])}
    onAddEmploymentHistory={record=>{
      setEmploymentHistory(prev=>[...prev,{...record,id:`EMP-HIST-${Date.now()}`}]);
      if(!record.effectiveTo)setEmployees(prev=>prev.map(employee=>employee.id===record.employeeId?{
        ...employee,position:record.position,rank:record.position,employmentType:record.employmentType,
        status:record.employmentStatus,salaryGrade:record.salaryGrade,step:record.step,
        personnelCategory:record.personnelCategory,
      }:employee));
    }}
    onAddServiceRequest={request=>setEmployeeServiceRequests(prev=>[...prev,{...request,id:`HR-REQ-${Date.now()}`}])}
    onReviewServiceRequest={updated=>setEmployeeServiceRequests(prev=>prev.map(request=>request.id===updated.id?updated:request))}
    onAddCommunication={communication=>setHrCommunications(prev=>[...prev,{...communication,id:`HR-COM-${Date.now()}`}])}
    onUpdateCommunication={updated=>setHrCommunications(prev=>prev.map(communication=>communication.id===updated.id?updated:communication))}
  />;

  const renderEmployeeSelfService = () => {
    const employee=currentUser?employees.find(item=>item.id===currentUser.employeeId):undefined;
    if(!employee) return <div className="rounded-xl border border-border bg-card p-5 text-sm">Your employee profile could not be matched to this account. Contact HR Records to link your employee ID.</div>;
    return <EmployeeSelfServicePage key={page} initialPage={page} employee={employee}
      payrolls={payrolls} leaves={leaves} dtr={dtr} vacancies={vacancies} applicants={applicants}
      trainings={trainings} nominations={nominations} ratings={ipcr} plans={developmentPlans}
      coachingRecords={coachingRecords} communications={hrCommunications}
      serviceRequests={employeeServiceRequests} pdsView={renderEmployeeRecords(true)}
      onAddLeave={handleAddLeave}
      onAddRequest={request=>setEmployeeServiceRequests(prev=>[...prev,{...request,id:`HR-REQ-${Date.now()}`}])}
      onApplyVacancy={vacancy=>handleAddApplicant({
        vacancyId:vacancy.id,name:employee.fullName,email:employee.email,phone:employee.phone,
        appliedDate:new Date().toISOString().slice(0,10),status:"Pending",score:null,type:"Internal",
        firstName:employee.firstName,middleName:employee.middleName,lastName:employee.lastName,
        birthDate:employee.birthDate,gender:employee.gender,address:employee.address,
        education:employee.education,eligibility:employee.eligibility,experience:employee.workExperience,
      })}
      onNominateTraining={(program,justification)=>{
        const nomination:Omit<TrainingNomination,"id">={
          programId:program.id,employeeId:employee.id,employeeName:employee.fullName,
          department:employee.department,status:"Pending",nominatedDate:new Date().toISOString().slice(0,10),justification,
        };
        setNominations(prev=>[...prev,{...nomination,id:`TN-${Date.now()}`}]);
        setTrainings(prev=>prev.map(item=>item.id===program.id?{...item,nominated:item.nominated+1}:item));
      }}
      onAddRating={rating=>setIpcr(prev=>[...prev,{...rating,id:`PM-${Date.now()}`}])}
      onAddPlan={plan=>setDevelopmentPlans(prev=>[...prev,{...plan,id:`IDP-${Date.now()}`}])}
      onAddCoaching={record=>setCoachingRecords(prev=>[...prev,{...record,id:`COACH-${Date.now()}`}])}/>;
  };

  const renderPage = () => {
    if(role==="employee") return renderEmployeeSelfService();
    switch(page) {
      case "dashboard": return <Dashboard role={role} setPage={navigate} employees={employees} payrolls={payrolls} leaves={leaves}/>;
      case "employees": return <EmployeeList setPage={navigate} setSelEmp={setSelEmp} employees={employees} onAdd={handleAddEmployee} onEdit={handleEditEmployee} onDelete={handleDeleteEmployee} canDelete={role!=="hr_records"}/>;
      case "hr-records": return role==="hr_records"?renderEmployeeRecords():<EmployeeList setPage={navigate} setSelEmp={setSelEmp} employees={employees} onAdd={handleAddEmployee} onEdit={handleEditEmployee} onDelete={handleDeleteEmployee}/>;
      case "employee-detail": return selEmp
        ? <EmployeeDetail employee={selEmp} setPage={navigate} leaves={leaves} dtr={dtr} onEdit={handleEditEmployee}/>
        : <EmployeeList setPage={navigate} setSelEmp={setSelEmp} employees={employees} onAdd={handleAddEmployee} onEdit={handleEditEmployee} onDelete={handleDeleteEmployee}/>;
      case "payroll": return <PayrollList setPage={navigate} setSelPay={setSelPay} payrolls={payrolls} onStatusChange={handlePayrollStatus}/>;
      case "payslip": return selPay
        ? <PayslipView payroll={selPay} setPage={navigate} employees={employees}/>
        : <PayrollList setPage={navigate} setSelPay={setSelPay} payrolls={payrolls} onStatusChange={handlePayrollStatus}/>;
      case "leave": return <LeaveManagement role={role} leaves={leaves} onUpdateLeave={handleUpdateLeave} onAddLeave={handleAddLeave}/>;
      case "attendance": return <AttendancePage role={role} dtr={dtr} employees={employees} onEditDtr={handleEditDtr} photoRecords={photoRecords} onAddPhotoRecord={handleAddPhotoRecord}/>;
      case "reports": return <Reports employees={employees} payrolls={payrolls} leaves={leaves}/>;
      case "notifications": return <NotificationsPage notifs={notifs} onMarkRead={handleMarkRead} onMarkAllRead={handleMarkAllRead}/>;
      case "audit": return <AuditPage/>;
      case "access-control": return role==="admin"?<AdminAccessCenter/>:<div>Access restricted to System Administrator.</div>;
      case "settings": return <SettingsPage role={role}/>;
      case "profile": return role==="employee"?renderEmployeeRecords(true):<SettingsPage role={role}/>;
      case "recruitment": return <RecruitmentPage vacancies={vacancies} applicants={applicants}
        onAddVacancy={v=>setVacancies(prev=>[...prev,{...v,id:`JV-${Date.now()}`}])}
        onUpdateVacancy={updated=>setVacancies(prev=>prev.map(v=>v.id===updated.id?updated:v))}
        onAddApplicant={handleAddApplicant}
        onUpdateApplicant={updated=>setApplicants(prev=>prev.map(a=>a.id===updated.id?updated:a))}
        onHireApplicant={applicant=>{
          if(applicant.status!=="Hired") {
            handleHireApplicant(applicant);
            showToast(`${applicant.name} added to employee information from recruitment PDS.`);
          }
        }}/>;
      case "training": return <TrainingPage programs={trainings} nominations={nominations} employees={employees}
        onboarding={onboarding} positionCompetencies={positionCompetencies} employeeCompetencies={employeeCompetencies}
        onNominate={n=>{
          setNominations(prev=>[...prev,{...n,id:`TN-${Date.now()}`}]);
          setTrainings(prev=>prev.map(program=>program.id===n.programId?{...program,nominated:program.nominated+1}:program));
        }}
        onUpdateNomination={handleUpdateTrainingNomination}
        onAddOnboarding={record=>setOnboarding(prev=>[...prev,{...record,id:`OB-${Date.now()}`}])}
        onUpdateOnboarding={handleUpdateOnboarding}
        onUpdateEmployee={updated=>setEmployees(prev=>prev.map(e=>e.id===updated.id?updated:e))}
        onAddPositionCompetency= {competency=>setPositionCompetencies(prev=>[...prev,{...competency,id:`PC-${Date.now()}`}])}
        onUpdateEmployeeCompetency={handleUpdateEmployeeCompetency}/>;
      case "performance": return <PerformancePage ratings={ipcr} employees={employees}
        bonusForms={bonusForms} developmentPlans={developmentPlans} coachingRecords={coachingRecords}
        onAddRating={rating=>setIpcr(prev=>[...prev,{...rating,id:`PM-${Date.now()}`}])}
        onUpdateRating={handleUpdatePerformanceRating}
        onAddBonusForm={form=>setBonusForms(prev=>[...prev,{...form,id:`PBB-${Date.now()}`}])}
        onUpdateBonusForm={updated=>setBonusForms(prev=>prev.map(form=>form.id===updated.id?updated:form))}
        onAddDevelopmentPlan={plan=>setDevelopmentPlans(prev=>[...prev,{...plan,id:`IDP-${Date.now()}`}])}
        onUpdateDevelopmentPlan={updated=>setDevelopmentPlans(prev=>prev.map(plan=>plan.id===updated.id?updated:plan))}
        onAddCoachingRecord={record=>setCoachingRecords(prev=>[...prev,{...record,id:`COACH-${Date.now()}`}])}
        onUpdateCoachingRecord={updated=>setCoachingRecords(prev=>prev.map(record=>record.id===updated.id?updated:record))}/>;
      case "rewards": return <RewardsPage nominations={rewards} employees={employees}
        nominatedBy={currentUser?.fullName||"Rewards and Recognition Staff"}
        onNominate={n=>setRewards(prev=>[...prev,{...n,id:`RN-${Date.now()}`}])}
        onUpdateNomination={updated=>setRewards(prev=>prev.map(n=>n.id===updated.id?updated:n))}/>;
      case "wellness": return <WellnessPage records={wellness} employees={employees}
        riskAssessments={healthRiskAssessments} programs={wellnessPrograms} counselingRecords={counselingRecords}
        onAdd={r=>setWellness(prev=>[...prev,{...r,id:`WR-${Date.now()}`}])}
        onUpdateRecord={updated=>setWellness(prev=>prev.map(record=>record.id===updated.id?updated:record))}
        onAddRiskAssessment={assessment=>setHealthRiskAssessments(prev=>[...prev,{...assessment,id:`HRA-${Date.now()}`}])}
        onAddProgram={program=>setWellnessPrograms(prev=>[...prev,{...program,id:`WP-${Date.now()}`}])}
        onUpdateProgram={updated=>setWellnessPrograms(prev=>prev.map(program=>program.id===updated.id?updated:program))}
        onAddCounseling={record=>setCounselingRecords(prev=>[...prev,{...record,id:`COUN-${Date.now()}`}])}
        onUpdateCounseling={updated=>setCounselingRecords(prev=>prev.map(record=>record.id===updated.id?updated:record))}/>;
      case "faculty": return <FacultyPage profiles={faculty} employees={employees}/>;
      default: return <Dashboard role={role} setPage={navigate} employees={employees} payrolls={payrolls} leaves={leaves}/>;
    }
  };

  if (screen==="apply") return <ExternalRecruitmentPlatform vacancies={vacancies} applicants={applicants} api={externalRecruitmentApi} onApply={handleAddApplicant}/>;
  if (screen==="home") return <HomeScreen onEnter={()=>setScreen("portal")}/>;
  if (screen==="portal") return <PortalScreen onBack={()=>setScreen("home")} onSelectRole={handleSelectPortal}/>;
  if (screen==="login") return <LoginScreen role={loginRole} onBack={()=>setScreen("portal")} onLogin={handleLogin}/>;

  return (
    <div className="flex h-screen overflow-hidden bg-background relative" style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      {/* Background circle overlay matching reference image */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:0}}>
        <div className="absolute rounded-full" style={{width:"70vh",height:"70vh",bottom:"-22vh",left:"-18vh",background:"rgba(255,255,255,0.05)"}}/>
        <div className="absolute rounded-full" style={{width:"55vh",height:"55vh",top:"-18vh",left:"2vh",background:"rgba(255,255,255,0.045)"}}/>
        <div className="absolute rounded-full" style={{width:"52vh",height:"52vh",top:"-14vh",right:"-6vh",background:"rgba(255,255,255,0.055)"}}/>
        <div className="absolute rounded-full" style={{width:"38vh",height:"38vh",top:"18vh",right:"-10vh",background:"rgba(255,255,255,0.04)"}}/>
      </div>
      <div className="relative flex w-full h-full" style={{zIndex:1}}>
        <Sidebar currentPage={page} setCurrentPage={navigate} role={role} collapsed={collapsed} setCollapsed={setCollapsed} currentUser={currentUser}/>
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <TopBar role={role} currentPage={page} unreadCount={unread} onNotifClick={()=>navigate("notifications")} onLogout={handleLogout} currentUser={currentUser}/>
          <main className="flex-1 overflow-y-auto p-5 lg:p-6">{renderPage()}</main>
        </div>
      </div>
      {toast&&<Toast msg={toast} onClose={()=>setToast("")}/>}
      <AIAssistantWidget role={role} page={page} onNavigate={navigate}/>
    </div>
  );
}
