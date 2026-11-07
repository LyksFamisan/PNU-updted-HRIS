import { useState } from "react";
import {
  Briefcase, UserCheck, CheckCircle, Users, ChevronLeft, ChevronRight, Plus, Search,
  Star, Microscope, Activity, FileText, BookOpen, Trophy, Medal, Clock,
  GraduationCap, Target, ClipboardCheck, Stethoscope, Heart, BarChart2, Award, BookMarked,
  User, Calendar
} from "lucide-react";
import { Badge, Av, Modal, SectionHeader } from "../shared";
import { fd } from "../data";
import type {
  JobVacancy, Applicant, TrainingProgram, TrainingNomination,
  PerformanceRating, RewardNomination, RewardAwardType, WellnessRecord, HealthRiskAssessment,
  WellnessProgram, CounselingRecord, FacultyProfile, Employee,
  OnboardingRecord, PositionCompetency, EmployeeCompetency,
  PerformanceBonusForm, IndividualDevelopmentPlan, CoachingRecord
} from "../types";

export function RecruitmentPage({ vacancies, applicants, onAddVacancy, onUpdateVacancy, onAddApplicant, onUpdateApplicant, onHireApplicant }: {
  vacancies: JobVacancy[]; applicants: Applicant[];
  onAddVacancy: (v: Omit<JobVacancy,"id">) => void;
  onUpdateVacancy: (v: JobVacancy) => void;
  onAddApplicant: (a: Omit<Applicant,"id"|"trackingNo">) => Applicant;
  onUpdateApplicant: (a: Applicant) => void;
  onHireApplicant: (a: Applicant) => void;
}) {
  const [tab, setTab] = useState<"vacancies"|"applicants"|"assessments"|"reports"|"online">("vacancies");
  const [selVacancy, setSelVacancy] = useState<JobVacancy|null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showApplicant, setShowApplicant] = useState(false);
  const [form, setForm] = useState({ position:"", department:"", salaryGrade:1, employmentType:"Permanent", classification:"Plantilla" as "Plantilla"|"Job Order", slots:1, deadline:"", qualifications:"", requiredDocuments:"Personal Data Sheet (PDS), Résumé / Curriculum Vitae" });
  const [applicantForm, setApplicantForm] = useState({ vacancyId:"", firstName:"", middleName:"", lastName:"", email:"", phone:"", type:"External" as "Internal"|"External", address:"", birthDate:"", gender:"Female" as "Male"|"Female", education:"", eligibility:"", experience:"" });
  const [search, setSearch] = useState("");
  const [selectedApplicantId, setSelectedApplicantId] = useState(applicants[0]?.id||"");
  const [senderName, setSenderName] = useState(()=>localStorage.getItem("pnu-recruitment-sms-sender")||"PNU HRIPS");
  const [notice, setNotice] = useState("");
  const statusColor: Record<string,string> = {
    Open:"bg-emerald-500/15 text-emerald-400", Closed:"bg-gray-100 text-gray-500",
    "For Approval":"bg-amber-100 text-amber-700",
  };
  const appStatusColor: Record<string,string> = {
    Pending:"bg-gray-100 text-gray-500", Shortlisted:"bg-blue-100 text-blue-700",
    Examination:"bg-amber-100 text-amber-700", Interview:"bg-purple-100 text-purple-700",
    Passed:"bg-emerald-500/15 text-emerald-400", Failed:"bg-red-500/15 text-red-400", Hired:"bg-[#3B82F6]/10 text-[#C8A84B]",
  };
  const filteredApps = (selVacancy ? applicants.filter(a=>a.vacancyId===selVacancy.id) : applicants)
    .filter(a=>`${a.name} ${a.email} ${a.trackingNo||""}`.toLowerCase().includes(search.toLowerCase()));
  const selectedApplicant = applicants.find(a=>a.id===selectedApplicantId);
  const STAGES: Applicant["status"][] = ["Pending","Shortlisted","Examination","Interview","Passed","Failed","Hired"];
  const publishedVacancies = vacancies.filter(v=>v.status==="Open"&&v.publicationStatus==="Published");
  const createApplicant = (type:"Internal"|"External", vacancyId:string, values:typeof applicantForm) => {
    if (!values.firstName.trim()||!values.lastName.trim()||!values.email.trim()||!vacancyId) {
      setNotice("Complete the required name, email, and vacancy fields.");
      return;
    }
    const name = [values.firstName,values.middleName,values.lastName].filter(Boolean).join(" ");
    const record = onAddApplicant({
      vacancyId,name,email:values.email.trim(),phone:values.phone.trim(),appliedDate:new Date().toISOString().slice(0,10),
      status:"Pending",score:null,type,firstName:values.firstName.trim(),middleName:values.middleName.trim(),
      lastName:values.lastName.trim(),birthDate:values.birthDate,gender:values.gender,address:values.address,
      education:values.education,eligibility:values.eligibility,experience:values.experience,examResult:"Pending",
    });
    setSelectedApplicantId(record.id);
    setNotice(`Application recorded. Tracking no.: ${record.trackingNo}. Email/SMS delivery requires a configured gateway.`);
    setShowApplicant(false);
    setApplicantForm({ vacancyId:"",firstName:"",middleName:"",lastName:"",email:"",phone:"",type:"External",address:"",birthDate:"",gender:"Female",education:"",eligibility:"",experience:"" });
  };
  const downloadCsv = (filename:string, rows:string[][]) => {
    const csv = rows.map(row=>row.map(cell=>{
      const value=String(cell??"");
      const safeValue=/^[=+\-@]/.test(value)?`'${value}`:value;
      return `"${safeValue.replaceAll('"','""')}"`;
    }).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
    const anchor = document.createElement("a");
    anchor.href=url; anchor.download=filename; anchor.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const updateStage = (applicant:Applicant,status:Applicant["status"]) => {
    onUpdateApplicant({...applicant,status});
    if(status==="Hired"&&applicant.status!=="Hired") onHireApplicant({...applicant,status});
  };

  return (
    <div>
      <SectionHeader title="Recruitment, Selection & Placement" subtitle="Vacancies, applicant tracking, competency assessments, and appointments"/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label:"Open Vacancies", value:vacancies.filter(v=>v.status==="Open").length, icon:Briefcase, color:"#3B82F6" },
          { label:"Total Applicants", value:applicants.length, icon:Users, color:"#2563EB" },
          { label:"For Interview", value:applicants.filter(a=>a.status==="Interview").length, icon:UserCheck, color:"#7C3AED" },
          { label:"Hired", value:applicants.filter(a=>a.status==="Hired").length, icon:CheckCircle, color:"#059669" },
        ].map(s=>(
          <div key={s.label} className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:`${s.color}15`}}>
              <s.icon className="w-5 h-5" style={{color:s.color}}/>
            </div>
            <div><p className="text-xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-muted/40 p-1 rounded-xl mb-5 w-fit">
        {(["vacancies","applicants","assessments","reports","online"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab===t?"bg-muted/60 text-[#C8A84B] shadow-sm":"text-muted-foreground hover:text-foreground"}`}>
            {{vacancies:"Vacancies & Publication",applicants:"Applicants",assessments:"Exams & Competencies",reports:"Reports & Forms",online:"Online Applicant Platform"}[t]}
          </button>
        ))}
      </div>

      {tab==="vacancies"&&(
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Plantilla and Job Order Vacancies ({vacancies.length})</h3>
            <div className="flex gap-2">
              <button onClick={()=>{setApplicantForm(f=>({...f,type:"Internal",vacancyId:vacancies.find(v=>v.status==="Open")?.id||""}));setShowApplicant(true);}} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-border"><Plus className="w-3.5 h-3.5"/>Register Applicant</button>
              <button onClick={()=>setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}><Plus className="w-3.5 h-3.5"/>Post Vacancy</button>
            </div>
          </div>
          <div className="space-y-3">
            {vacancies.map(v=>(
              <div key={v.id} className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-sm font-semibold">{v.position}</h4>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusColor[v.status]}`}>{v.status}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{v.employmentType}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{v.classification||"Plantilla"}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${(v.publicationStatus||"Draft")==="Published"?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700"}`}>{v.publicationStatus||"Draft"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{v.department} · SG {v.salaryGrade} · {v.slots} slot{v.slots>1?"s":""}</p>
                    <p className="text-xs text-foreground/70 line-clamp-2">{v.qualifications}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    <p className="text-xs font-semibold">{fd(v.deadline)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{v.applicants} applicant{v.applicants!==1?"s":""}</p>
                    <button onClick={()=>{setSelVacancy(v);setTab("applicants");}}
                      className="mt-2 text-[11px] text-[#C8A84B] font-medium hover:underline">View Applicants →</button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
                  {v.status==="For Approval"&&<button onClick={()=>onUpdateVacancy({...v,status:"Open"})} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Approve Vacancy</button>}
                  <button disabled={v.status==="Closed"} onClick={()=>onUpdateVacancy({...v,publicationStatus:v.publicationStatus==="Published"?"Not Published":"Published",publicationDate:new Date().toISOString().slice(0,10)})} className="px-3 py-1.5 rounded-lg text-xs border border-border disabled:opacity-50">
                    {v.publicationStatus==="Published"?"Unpublish":"Publish Vacancy"}
                  </button>
                  <button onClick={()=>onUpdateVacancy({...v,status:v.status==="Closed"?"Open":"Closed"})} className="px-3 py-1.5 rounded-lg text-xs border border-border">{v.status==="Closed"?"Reopen":"Close Vacancy"}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="applicants"&&(
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-sm font-semibold">Applicants {selVacancy?`— ${selVacancy.position}`:""}</h3>
            <div className="flex gap-2">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or tracking no." className="border border-border rounded-lg px-3 py-1.5 text-xs"/>
              <button onClick={()=>{setApplicantForm(f=>({...f,type:"Internal",vacancyId:selVacancy?.id||vacancies.find(v=>v.status==="Open")?.id||""}));setShowApplicant(true);}} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}><Plus className="w-3 h-3 inline mr-1"/>Add Applicant</button>
              {selVacancy&&<button onClick={()=>setSelVacancy(null)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><ChevronLeft className="w-3.5 h-3.5"/>All Applicants</button>}
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                {["Applicant / Tracking No.","Type","Applied","Stage","Exam / PSB","Action"].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>)}
              </tr></thead>
              <tbody>{filteredApps.map(a=>(
                <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3"><p className="text-xs font-semibold">{a.name}</p><p className="text-xs text-muted-foreground">{a.email}</p><p className="text-[10px] text-blue-700">{a.trackingNo||"No tracking number"}</p></td>
                  <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded-full ${a.type==="Internal"?"bg-[#3B82F6]/10 text-[#C8A84B]":"bg-muted text-muted-foreground"}`}>{a.type}</span></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{fd(a.appliedDate)}</td>
                  <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${appStatusColor[a.status]}`}>{a.status}</span></td>
                  <td className="px-4 py-3 text-xs font-mono">{a.examScore!=null?`${a.examScore}/100`:"—"} / {a.psbRating??"—"}</td>
                  <td className="px-4 py-3"><select value={a.status} onChange={e=>updateStage(a,e.target.value as Applicant["status"])} className="border border-border rounded px-2 py-1 text-[11px] bg-card">{STAGES.map(s=><option key={s}>{s}</option>)}</select></td>
                </tr>
              ))}</tbody>
            </table>
            {filteredApps.length===0&&<div className="py-8 text-center text-sm text-muted-foreground">No applicants found</div>}
          </div>
        </div>
      )}

      {tab==="assessments"&&<div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <h3 className="text-sm font-semibold">Applicant Examination and Competency-Based Assessment</h3>
        <label className="block text-xs text-muted-foreground">Applicant
          <select value={selectedApplicantId} onChange={e=>setSelectedApplicantId(e.target.value)} className="block w-full md:w-96 mt-1 border border-border rounded-lg p-2 bg-card">
            {applicants.map(a=><option key={a.id} value={a.id}>{a.name} · {a.trackingNo}</option>)}
          </select>
        </label>
        {selectedApplicant? <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="block text-xs">Examination score (0-100)<input id="exam-score" type="number" min="0" max="100" defaultValue={selectedApplicant.examScore??""} className="block w-full mt-1 border border-border rounded p-2 bg-card"/></label>
            <label className="block text-xs">Examination result<select id="exam-result" defaultValue={selectedApplicant.examResult||"Pending"} className="block w-full mt-1 border border-border rounded p-2 bg-card"><option>Pending</option><option>Passed</option><option>Failed</option></select></label>
            <label className="block text-xs">PSB rating (0-100)<input id="psb-rating" type="number" min="0" max="100" defaultValue={selectedApplicant.psbRating??""} className="block w-full mt-1 border border-border rounded p-2 bg-card"/></label>
            <button onClick={()=>{
              const examScoreInput=(document.getElementById("exam-score") as HTMLInputElement).value;
              const psbRatingInput=(document.getElementById("psb-rating") as HTMLInputElement).value;
              const examScore=Number(examScoreInput);
              const examResult=(document.getElementById("exam-result") as HTMLSelectElement).value as Applicant["examResult"];
              const psbRating=Number(psbRatingInput);
              if(!examScoreInput||!psbRatingInput||!Number.isFinite(examScore)||examScore<0||examScore>100||!Number.isFinite(psbRating)||psbRating<0||psbRating>100) {
                setNotice("Examination score and PSB rating must be between 0 and 100.");
                return;
              }
              onUpdateApplicant({...selectedApplicant,examScore:Number.isFinite(examScore)?examScore:null,score:Number.isFinite(examScore)?examScore:null,examResult,psbRating:Number.isFinite(psbRating)?psbRating:0});
              setNotice("Examination result and PSB rating saved.");
            }} className="px-4 py-2 rounded-lg text-xs font-semibold" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Save Scores & Results</button>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-medium">Competency ratings (0-100)</p>
            {(selectedApplicant.competencyScores?.length?selectedApplicant.competencyScores:[{name:"Technical / Professional",score:0},{name:"Communication",score:0},{name:"Problem Solving",score:0}]).map((c,i)=><label key={c.name} className="block text-xs">{c.name}<input data-competency-index={i} type="number" min="0" max="100" defaultValue={c.score} className="block w-full mt-1 border border-border rounded p-2 bg-card"/></label>)}
            <button onClick={()=>{
              const competencyScores=(selectedApplicant.competencyScores?.length?selectedApplicant.competencyScores:[{name:"Technical / Professional",score:0},{name:"Communication",score:0},{name:"Problem Solving",score:0}]).map((c,i)=>({...c,score:Number((document.querySelector(`[data-competency-index="${i}"]`) as HTMLInputElement).value)||0}));
              if(competencyScores.some(c=>c.score<0||c.score>100)) {
                setNotice("Competency scores must be between 0 and 100.");
                return;
              }
              onUpdateApplicant({...selectedApplicant,competencyScores});
              setNotice("Competency assessment saved.");
            }} className="px-4 py-2 rounded-lg text-xs border border-border">Save Competencies</button>
          </div>
        </div>:<p className="text-sm text-muted-foreground">No applicants available for assessment.</p>}
      </div>}

      {tab==="reports"&&<div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold mb-2">Recruitment Reports and Appointment Forms</h3>
        <p className="text-xs text-muted-foreground mb-4">Generate downloadable CSV registers for review, printing, and records management.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            ["Publication Report",()=>downloadCsv("publication-report.csv",[["Vacancy","Department","Classification","Publication Status","Publication Date","Deadline"],...vacancies.map(v=>[v.position,v.department,v.classification||"Plantilla",v.publicationStatus||"Draft",v.publicationDate||"",v.deadline])])],
            ["Action Sheet Report",()=>downloadCsv("action-sheet-report.csv",[["Tracking No.","Applicant","Vacancy","Stage","Exam Result","PSB Rating"],...applicants.map(a=>[a.trackingNo||"",a.name,vacancies.find(v=>v.id===a.vacancyId)?.position||"",a.status,a.examResult||"",a.psbRating??""])])],
            ["Appointment Transmittal / ATAF / RAI",()=>downloadCsv("appointment-transmittal-ataf-rai.csv",[["Tracking No.","Applicant","Position","Department","Appointment Status","Reference No."],...applicants.filter(a=>a.status==="Hired").map(a=>[a.trackingNo||"",a.name,vacancies.find(v=>v.id===a.vacancyId)?.position||"",vacancies.find(v=>v.id===a.vacancyId)?.department||"",a.appointmentStatus||"Not Started",a.appointmentReference||""])])],
            ["Application Assessment Forms",()=>downloadCsv("application-assessment-forms.csv",[["Tracking No.","Applicant","Competency","Score"],...applicants.flatMap(a=>(a.competencyScores||[]).map(c=>[a.trackingNo||"",a.name,c.name,c.score]))])],
            ["Recruitment Tracking Form",()=>downloadCsv("recruitment-tracking-form.csv",[["Tracking No.","Applicant","Email","Type","Applied","Stage","Vacancy"],...applicants.map(a=>[a.trackingNo||"",a.name,a.email,a.type,a.appliedDate,a.status,vacancies.find(v=>v.id===a.vacancyId)?.position||""])])],
            ["Appointment Forms Register",()=>downloadCsv("appointment-forms-register.csv",[["Tracking No.","Applicant","Position","Appointment Status","Reference No."],...applicants.filter(a=>a.status==="Hired").map(a=>[a.trackingNo||"",a.name,vacancies.find(v=>v.id===a.vacancyId)?.position||"",a.appointmentStatus||"Not Started",a.appointmentReference||""])])],
          ].map(([label,action])=><button key={label as string} onClick={action as ()=>void} className="flex items-center gap-2 rounded-lg border border-border p-4 text-left text-xs font-medium hover:bg-muted/30"><FileText className="w-4 h-4 text-[#C8A84B]"/>{label as string}</button>)}
        </div>
        <div className="mt-6">
          <h4 className="text-sm font-semibold mb-3">Appointment Management</h4>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-xs">
              <thead className="bg-muted/30"><tr>{["Applicant","Position","Appointment Status","ATAF / RAI Reference"].map(h=><th key={h} className="p-3 text-left">{h}</th>)}</tr></thead>
              <tbody>{applicants.filter(a=>a.status==="Hired").map(a=><tr key={a.id} className="border-t border-border">
                <td className="p-3">{a.name}<div className="text-muted-foreground">{a.trackingNo}</div></td>
                <td className="p-3">{vacancies.find(v=>v.id===a.vacancyId)?.position||"—"}</td>
                <td className="p-3"><select value={a.appointmentStatus||"Not Started"} onChange={e=>onUpdateApplicant({...a,appointmentStatus:e.target.value as Applicant["appointmentStatus"]})} className="border border-border rounded p-1 bg-card">{["Not Started","Appointment Prepared","Transmitted","Issued"].map(s=><option key={s}>{s}</option>)}</select></td>
                <td className="p-3"><input value={a.appointmentReference||""} onChange={e=>onUpdateApplicant({...a,appointmentReference:e.target.value})} placeholder="Reference no." className="border border-border rounded p-1 bg-card"/></td>
              </tr>)}</tbody>
            </table>
            {!applicants.some(a=>a.status==="Hired")&&<p className="p-4 text-muted-foreground">No hired applicants to process.</p>}
          </div>
        </div>
      </div>}

      {tab==="online"&&<div className="space-y-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold mb-2">External Applicant Online Platform</h3>
          <p className="text-xs text-muted-foreground mb-3">External applicants can apply only to open, published vacancies using the public <code>/apply</code> page. Internal applications are recorded by Recruitment Staff.</p>
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">Email/SMS alerts, customized sender, warranty SMS credits, Philippine cloud hosting, and onsite HRIPS synchronization require a deployed backend and messaging provider. This browser-only demo records tracking numbers locally and does not send messages or synchronize across devices.</div>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <label className="text-xs">SMS sender name preview<input value={senderName} maxLength={11} onChange={e=>setSenderName(e.target.value)} className="block mt-1 border border-border rounded-lg p-2 bg-card"/></label>
            <button onClick={()=>{localStorage.setItem("pnu-recruitment-sms-sender",senderName);setNotice(`Sender name preview saved locally: ${senderName}. Configure a messaging provider to activate delivery.`);}} className="px-4 py-2 rounded-lg border border-border text-xs">Save Sender Preview</button>
            <a href="/apply" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg text-xs font-semibold" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Open External Application Page</a>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">Warranty SMS credits: not configured · Email service: not configured · Hosting/sync: local demo only</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <h4 className="text-xs font-semibold mb-3">Published vacancies available externally</h4>
          {publishedVacancies.length?publishedVacancies.map(v=><p key={v.id} className="text-xs py-2 border-b border-border/50">{v.position} · {v.classification||"Plantilla"} · Deadline {fd(v.deadline)}</p>):<p className="text-xs text-muted-foreground">No open vacancies are published yet.</p>}
        </div>
      </div>}

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Post New Job Vacancy">
        <div className="space-y-3">
          {[["Position Title","position","text"],["Department","department","text"],["Qualification Standards","qualifications","text"],["Application Deadline","deadline","date"]].map(([label,field,type])=>(
            <div key={field}><label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
            <input type={type} value={(form as any)[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/30"/></div>
          ))}
          <label className="block text-xs font-medium text-muted-foreground">Required applicant documents <span className="font-normal">(comma-separated)</span>
            <textarea rows={2} value={form.requiredDocuments} onChange={e=>setForm(f=>({...f,requiredDocuments:e.target.value}))} className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/30"/>
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-xs font-medium text-muted-foreground mb-1">Salary Grade</label>
            <input type="number" min={1} max={33} value={form.salaryGrade} onChange={e=>setForm(f=>({...f,salaryGrade:+e.target.value}))}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none"/></div>
            <div><label className="block text-xs font-medium text-muted-foreground mb-1">Slots</label>
            <input type="number" min={1} value={form.slots} onChange={e=>setForm(f=>({...f,slots:+e.target.value}))}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none"/></div>
            <div><label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
            <select value={form.employmentType} onChange={e=>setForm(f=>({...f,employmentType:e.target.value,classification:e.target.value==="Job Order"?"Job Order":f.classification}))}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
              {["Permanent","Temporary","Casual","Contractual","Job Order","COS","Part-Time"].map(t=><option key={t}>{t}</option>)}
            </select></div>
            <div><label className="block text-xs font-medium text-muted-foreground mb-1">Position Classification</label><select value={form.classification} onChange={e=>setForm(f=>({...f,classification:e.target.value as "Plantilla"|"Job Order"}))} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white"><option>Plantilla</option><option>Job Order</option></select></div>
          </div>
          <button onClick={()=>{
            if(form.position&&form.department&&form.deadline){
              onAddVacancy({...form,requiredDocuments:form.requiredDocuments.split(",").map(document=>document.trim()).filter(Boolean),status:"For Approval",applicants:0,publicationStatus:"Draft"});
              setShowAdd(false); setForm({position:"",department:"",salaryGrade:1,employmentType:"Permanent",slots:1,deadline:"",qualifications:"",requiredDocuments:"Personal Data Sheet (PDS), Résumé / Curriculum Vitae"});
            }
          }} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white mt-2" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>
            Submit for Approval
          </button>
        </div>
      </Modal>
      <Modal open={showApplicant} onClose={()=>setShowApplicant(false)} title="Register Internal / External Applicant" size="lg">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-xs">Applicant type<select value={applicantForm.type} onChange={e=>setApplicantForm(f=>({...f,type:e.target.value as "Internal"|"External"}))} className="block w-full mt-1 border border-border rounded p-2 bg-card"><option>Internal</option><option>External</option></select></label>
          <label className="text-xs">Vacancy<select value={applicantForm.vacancyId} onChange={e=>setApplicantForm(f=>({...f,vacancyId:e.target.value}))} className="block w-full mt-1 border border-border rounded p-2 bg-card"><option value="">Select vacancy</option>{vacancies.filter(v=>v.status==="Open").map(v=><option key={v.id} value={v.id}>{v.position}</option>)}</select></label>
          {([["First name","firstName"],["Middle name","middleName"],["Last name","lastName"],["Email","email"],["Phone","phone"],["Birth date","birthDate"],["Address","address"],["Education","education"],["Eligibility","eligibility"],["Relevant experience","experience"]] as const).map(([label,key])=><label key={key} className="text-xs">{label}<input type={key==="birthDate"?"date":"text"} required={["firstName","lastName","email"].includes(key)} value={applicantForm[key]} onChange={e=>setApplicantForm(f=>({...f,[key]:e.target.value}))} className="block w-full mt-1 border border-border rounded p-2 bg-card"/></label>)}
          <button onClick={()=>createApplicant(applicantForm.type,applicantForm.vacancyId,applicantForm)} className="sm:col-span-2 py-2.5 rounded-xl text-sm font-semibold" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Create Applicant Record & Tracking Number</button>
        </div>
      </Modal>
      {notice&&<div role="status" className="fixed bottom-4 right-4 z-50 max-w-md rounded-xl border border-border bg-card p-4 text-xs shadow-xl">{notice}<button onClick={()=>setNotice("")} className="ml-3 font-semibold text-[#C8A84B]">Dismiss</button></div>}
    </div>
  );
}

export function ExternalApplicationPage({ vacancies, applicants, onApply }: {
  vacancies:JobVacancy[];
  applicants:Applicant[];
  onApply:(a:Omit<Applicant,"id"|"trackingNo">)=>Applicant;
}) {
  const [form,setForm]=useState({vacancyId:"",firstName:"",middleName:"",lastName:"",email:"",phone:"",address:"",birthDate:"",gender:"Female" as "Male"|"Female",education:"",eligibility:"",experience:""});
  const [trackingNo,setTrackingNo]=useState("");
  const [trackingQuery,setTrackingQuery]=useState("");
  const [trackedApplicant,setTrackedApplicant]=useState<Applicant|null>(null);
  const available=vacancies.filter(v=>v.status==="Open"&&v.publicationStatus==="Published");
  return <main className="min-h-screen bg-slate-950 text-white p-5 md:p-10">
    <div className="max-w-3xl mx-auto">
      <p className="text-xs uppercase tracking-widest text-amber-300 mb-2">Philippine Normal University</p>
      <h1 className="text-2xl font-bold mb-2">Online Recruitment Application</h1>
      <p className="text-sm text-slate-300 mb-6">External applicant portal · Submit an application for an open published vacancy.</p>
      {trackingNo?<div className="rounded-xl border border-emerald-500/40 bg-emerald-950 p-5"><h2 className="font-semibold text-emerald-300">Application recorded</h2><p className="mt-2 text-sm">Your tracking number is <strong>{trackingNo}</strong>.</p><p className="mt-2 text-xs text-slate-300">Email/SMS delivery is not active in this demo. Keep your tracking number to follow up with Recruitment Staff.</p></div>:
      <form className="grid sm:grid-cols-2 gap-3 rounded-xl border border-white/10 bg-white/5 p-5" onSubmit={e=>{e.preventDefault();if(!form.vacancyId)return;const applicant=onApply({vacancyId:form.vacancyId,name:[form.firstName,form.middleName,form.lastName].filter(Boolean).join(" "),email:form.email,phone:form.phone,appliedDate:new Date().toISOString().slice(0,10),status:"Pending",score:null,type:"External",firstName:form.firstName,middleName:form.middleName,lastName:form.lastName,birthDate:form.birthDate,gender:form.gender,address:form.address,education:form.education,eligibility:form.eligibility,experience:form.experience,examResult:"Pending"});setTrackingNo(applicant.trackingNo||"Pending");}}>
        <label className="text-xs text-slate-300 sm:col-span-2">Published vacancy<select required value={form.vacancyId} onChange={e=>setForm(f=>({...f,vacancyId:e.target.value}))} className="block w-full mt-1 rounded-lg bg-slate-900 border border-white/20 p-2 text-white"><option value="">Select a position</option>{available.map(v=><option key={v.id} value={v.id}>{v.position} · {v.department} · {v.classification||"Plantilla"}</option>)}</select></label>
        {([["First name","firstName"],["Middle name","middleName"],["Last name","lastName"],["Email","email"],["Phone","phone"],["Birth date","birthDate"],["Address","address"],["Education","education"],["Eligibility","eligibility"],["Relevant experience","experience"]] as const).map(([label,key])=><label key={key} className="text-xs text-slate-300">{label}<input required={["firstName","lastName","email"].includes(key)} type={key==="birthDate"?"date":"text"} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} className="block w-full mt-1 rounded-lg bg-slate-900 border border-white/20 p-2 text-white"/></label>)}
        <button disabled={!available.length} className="sm:col-span-2 rounded-lg bg-amber-400 p-2.5 text-sm font-semibold text-slate-950 disabled:opacity-50">{available.length?"Submit Application":"No published vacancies available"}</button>
        <p className="sm:col-span-2 text-[11px] text-slate-400">This demo stores applications in this browser only. Automated email/SMS, cloud hosting, and HRIPS synchronization require the production integration service.</p>
      </form>}
      <form className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5" onSubmit={e=>{e.preventDefault();setTrackedApplicant(applicants.find(a=>a.trackingNo?.toLowerCase()===trackingQuery.trim().toLowerCase())||null);}}>
        <h2 className="text-sm font-semibold mb-3">Track an Application</h2>
        <div className="flex flex-wrap gap-2"><input value={trackingQuery} onChange={e=>setTrackingQuery(e.target.value)} placeholder="Enter tracking number" className="flex-1 min-w-48 rounded-lg bg-slate-900 border border-white/20 p-2 text-sm text-white"/><button className="rounded-lg border border-white/20 px-4 py-2 text-sm">Check Status</button></div>
        {trackedApplicant&&<p className="mt-3 text-xs">Application stage: <strong>{trackedApplicant.status}</strong> · {vacancies.find(v=>v.id===trackedApplicant.vacancyId)?.position}</p>}
        {trackedApplicant===null&&trackingQuery&&<p className="mt-3 text-xs text-amber-200">No matching application was found in this browser's demo data.</p>}
      </form>
    </div>
  </main>;
}

export function TrainingPage({ programs, nominations, employees, onboarding, positionCompetencies, employeeCompetencies, onNominate, onUpdateNomination, onAddOnboarding, onUpdateOnboarding, onUpdateEmployee, onAddPositionCompetency, onUpdateEmployeeCompetency }: {
  programs: TrainingProgram[]; nominations: TrainingNomination[]; employees: Employee[];
  onboarding: OnboardingRecord[]; positionCompetencies: PositionCompetency[]; employeeCompetencies: EmployeeCompetency[];
  onNominate: (n: Omit<TrainingNomination,"id">) => void;
  onUpdateNomination: (n: TrainingNomination) => void;
  onAddOnboarding: (r: Omit<OnboardingRecord,"id">) => void;
  onUpdateOnboarding: (r: OnboardingRecord) => void;
  onUpdateEmployee: (e: Employee) => void;
  onAddPositionCompetency: (c: Omit<PositionCompetency,"id">) => void;
  onUpdateEmployeeCompetency: (c: EmployeeCompetency) => void;
}) {
  const [tab, setTab] = useState<"programs"|"nominations"|"invitations"|"onboarding"|"competencies"|"reports">("programs");
  const [showNom, setShowNom] = useState<TrainingProgram|null>(null);
  const [nomForm, setNomForm] = useState({ employeeId:"", note:"" });
  const [onboardingForm, setOnboardingForm] = useState({ employeeId:"", orientationDate:"" });
  const [competencyForm, setCompetencyForm] = useState({ position:"", competency:"", requiredLevel:3 });
  const [assessmentDrafts, setAssessmentDrafts] = useState<Record<string,{score:string;notes:string}>>({});
  const [notice, setNotice] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(employees[0]?.id||"");
  const statusColor: Record<string,string> = {
    Upcoming:"bg-blue-100 text-blue-700", Ongoing:"bg-emerald-500/15 text-emerald-400",
    Completed:"bg-gray-100 text-gray-500", Cancelled:"bg-red-500/15 text-red-400",
  };
  const nomStatusColor: Record<string,string> = {
    Pending:"bg-amber-100 text-amber-700", Approved:"bg-emerald-500/15 text-emerald-400",
    Completed:"bg-[#3B82F6]/10 text-[#C8A84B]", Declined:"bg-red-500/15 text-red-400",
  };
  const typeColor: Record<string,string> = {
    Mandatory:"bg-red-500/15 text-red-400", Optional:"bg-blue-100 text-blue-700", Scholarship:"bg-amber-100 text-amber-700",
  };
  const tabs: {id:typeof tab;label:string}[]=[
    {id:"programs",label:"Training Programs"},{id:"nominations",label:"Nominations & Assessment"},
    {id:"invitations",label:"Invitations"},{id:"onboarding",label:"Onboarding"},
    {id:"competencies",label:"Competency Inventory"},{id:"reports",label:"Reports"},
  ];
  const downloadCsv=(filename:string,rows:(string|number)[][])=>{
    const csv=rows.map(row=>row.map(cell=>`"${String(cell??"").replaceAll('"','""')}"`).join(",")).join("\r\n");
    const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
    const anchor=document.createElement("a");anchor.href=url;anchor.download=filename;anchor.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const saveAssessment=(nomination:TrainingNomination)=>{
    const draft=assessmentDrafts[nomination.id]||{score:String(nomination.assessmentScore??""),notes:nomination.assessmentNotes||""};
    const score=Number(draft.score);
    if(!draft.score||!Number.isFinite(score)||score<0||score>100){setNotice("Assessment score must be between 0 and 100.");return;}
    onUpdateNomination({...nomination,assessmentScore:score,assessmentNotes:draft.notes});
    setNotice("Training assessment form saved.");
  };
  const setNominationStatus=(nomination:TrainingNomination,status:TrainingNomination["status"])=>{
    onUpdateNomination({...nomination,status,completedDate:status==="Completed"?new Date().toISOString().slice(0,10):nomination.completedDate});
  };
  const selectedEmployee=employees.find(e=>e.id===selectedEmployeeId);
  const requiredCompetencies=positionCompetencies.filter(c=>c.position===selectedEmployee?.position);

  return (
    <div>
      <SectionHeader title="Learning & Development" subtitle="HRDO Training Unit · Training administration, onboarding, and competency development"/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          {label:"Training Programs",value:programs.length,icon:GraduationCap,color:"#3B82F6"},
          {label:"Pending Nominations",value:nominations.filter(n=>n.status==="Pending").length,icon:Users,color:"#2563EB"},
          {label:"Onboarding In Progress",value:onboarding.filter(o=>o.status==="In Progress").length,icon:Activity,color:"#059669"},
          {label:"Training Completions",value:nominations.filter(n=>n.status==="Completed").length,icon:CheckCircle,color:"#7C3AED"},
        ].map(s=><div key={s.label} className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:`${s.color}15`}}><s.icon className="w-5 h-5" style={{color:s.color}}/></div><div><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div></div>)}
      </div>
      <div className="flex flex-wrap gap-1 bg-muted/40 p-1 rounded-xl mb-5">
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${tab===t.id?"bg-muted/60 text-[#C8A84B] shadow-sm":"text-muted-foreground hover:text-foreground"}`}>{t.label}</button>)}
      </div>

      {tab==="programs"&&<div className="space-y-3">
        {programs.map(p=><div key={p.id} className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap mb-1"><h4 className="text-sm font-semibold">{p.title}</h4><span className={`text-[11px] px-2 py-0.5 rounded-full ${statusColor[p.status]}`}>{p.status}</span><span className={`text-[11px] px-2 py-0.5 rounded-full ${typeColor[p.type]}`}>{p.type}</span>{p.mandatoryOnboarding&&<span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Onboarding</span>}</div>
            <p className="text-xs text-muted-foreground">{p.sponsoringAgency||p.organizer} · {p.venue}</p><p className="text-xs mt-1">{fd(p.startDate)}{p.startDate!==p.endDate?` — ${fd(p.endDate)}`:""} · {p.category}</p>{p.scholarshipGrant&&<p className="text-xs mt-1 text-amber-700">Scholarship: {p.scholarshipGrant}{p.grantAmount?` · ₱${p.grantAmount.toLocaleString()}`:""}</p>}
          </div><div className="text-right"><p className="text-xs text-muted-foreground">{p.nominated}/{p.slots} nominated</p>{p.status==="Upcoming"&&<button onClick={()=>setShowNom(p)} className="mt-2 text-[11px] px-3 py-1 rounded-lg" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Create Nomination</button>}</div>
        </div>)}
      </div>}

      {tab==="nominations"&&<div className="bg-card rounded-xl border border-border overflow-x-auto shadow-sm">
        <table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">{["Employee","Program","Nomination","Assessment Form","PDS Sync"].map(h=><th key={h} className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">{h}</th>)}</tr></thead>
          <tbody>{nominations.map(n=>{const program=programs.find(p=>p.id===n.programId);const draft=assessmentDrafts[n.id]||{score:String(n.assessmentScore??""),notes:n.assessmentNotes||""};return <tr key={n.id} className="border-b border-border/50 align-top">
            <td className="px-3 py-3 text-xs"><b>{n.employeeName}</b><div className="text-muted-foreground">{n.department}</div></td><td className="px-3 py-3 text-xs">{program?.title||"—"}</td>
            <td className="px-3 py-3"><select value={n.status} onChange={e=>setNominationStatus(n,e.target.value as TrainingNomination["status"])} className="border border-border rounded px-2 py-1 text-xs bg-card">{["Pending","Approved","Completed","Declined"].map(s=><option key={s}>{s}</option>)}</select><div className={`mt-1 text-[10px] ${nomStatusColor[n.status]}`}>{n.status}</div></td>
            <td className="px-3 py-3 min-w-52"><input type="number" min="0" max="100" placeholder="Score / 100" value={draft.score} onChange={e=>setAssessmentDrafts(prev=>({...prev,[n.id]:{...draft,score:e.target.value}}))} className="w-24 border border-border rounded p-1 text-xs bg-card"/><textarea placeholder="Assessment notes" value={draft.notes} onChange={e=>setAssessmentDrafts(prev=>({...prev,[n.id]:{...draft,notes:e.target.value}}))} className="block w-full mt-1 border border-border rounded p-1 text-xs bg-card"/><button onClick={()=>saveAssessment(n)} className="mt-1 px-2 py-1 border border-border rounded text-[10px]">Save Assessment Form</button></td>
            <td className="px-3 py-3 text-xs">{n.pdsSynced?"Synced":"Pending"}{n.assessmentScore!=null&&<div>Score: {n.assessmentScore}</div>}</td>
          </tr>;})}</tbody>
        </table>
      </div>}

      {tab==="invitations"&&<div className="bg-card rounded-xl border border-border p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Training Invitation Processing</h3><div className="space-y-2">{nominations.filter(n=>n.status==="Approved"||n.status==="Completed").map(n=>{const program=programs.find(p=>p.id===n.programId);const emp=employees.find(e=>e.id===n.employeeId);return <div key={n.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 py-3"><div><p className="text-xs font-semibold">{n.employeeName}</p><p className="text-xs text-muted-foreground">{program?.title} · {emp?.email||"No email on file"}</p></div><div className="flex items-center gap-2"><select aria-label={`Invitation status for ${n.employeeName}`} value={n.invitationStatus||"Not Sent"} onChange={e=>onUpdateNomination({...n,invitationStatus:e.target.value as TrainingNomination["invitationStatus"]})} className="rounded-lg border border-border px-2 py-1.5 text-xs bg-card">{["Not Sent","Sent","Accepted","Declined"].map(status=><option key={status}>{status}</option>)}</select><button onClick={()=>onUpdateNomination({...n,invitationStatus:"Sent"})} className="rounded-lg border border-border px-3 py-1.5 text-xs">Mark Invitation Processed</button><button onClick={()=>downloadCsv(`training-invitation-${n.id}.csv`,[["Employee","Email","Training","Date","Venue"],[n.employeeName,emp?.email||"",program?.title||"",program?.startDate||"",program?.venue||""]])} className="rounded-lg border border-border px-3 py-1.5 text-xs">Download Invitation</button></div></div>;})}</div><p className="mt-3 text-[11px] text-muted-foreground">Invitation delivery is recorded in this portal. Automatic email/SMS delivery requires a configured messaging service.</p>
      </div>}

      {tab==="onboarding"&&<div className="space-y-4">
        <div className="bg-card rounded-xl border border-border p-4"><h3 className="text-sm font-semibold mb-3">Start Onboarding & Schedule Orientation</h3><div className="grid md:grid-cols-3 gap-3">
          <select value={onboardingForm.employeeId} onChange={e=>setOnboardingForm(f=>({...f,employeeId:e.target.value}))} className="border border-border rounded-lg p-2 text-xs bg-card"><option value="">Select newly hired employee</option>{employees.filter(e=>!onboarding.some(o=>o.employeeId===e.id)).map(e=><option key={e.id} value={e.id}>{e.fullName} · {e.position}</option>)}</select>
          <label className="text-xs">Orientation date<input type="date" value={onboardingForm.orientationDate} onChange={e=>setOnboardingForm(f=>({...f,orientationDate:e.target.value}))} className="block w-full border border-border rounded-lg p-2 mt-1 bg-card"/></label>
          <button disabled={!onboardingForm.employeeId||!onboardingForm.orientationDate} onClick={()=>{const e=employees.find(emp=>emp.id===onboardingForm.employeeId);if(!e)return;const mandatoryProgramIds=programs.filter(p=>p.mandatoryOnboarding||p.type==="Mandatory").map(p=>p.id);onAddOnboarding({employeeId:e.id,employeeName:e.fullName,position:e.position,department:e.department,startDate:e.dateHired,orientationDate:onboardingForm.orientationDate,orientationStatus:"Scheduled",mandatoryProgramIds,completedProgramIds:[],status:"In Progress"});onUpdateEmployee({...e,onboardingStatus:"In Progress"});setOnboardingForm({employeeId:"",orientationDate:""});}} className="rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Create Onboarding Plan</button>
        </div></div>
        {onboarding.map(o=><div key={o.id} className="bg-card rounded-xl border border-border p-4"><div className="flex flex-wrap justify-between gap-2"><div><p className="text-sm font-semibold">{o.employeeName} · {o.position}</p><p className="text-xs text-muted-foreground">{o.department} · Start {fd(o.startDate)} · Orientation {fd(o.orientationDate)}</p></div><span className="text-xs font-semibold">{o.status}</span></div>
          <div className="flex flex-wrap gap-3 mt-3"><label className="text-xs">Orientation date<input type="date" value={o.orientationDate} onChange={e=>onUpdateOnboarding({...o,orientationDate:e.target.value})} className="ml-2 border border-border rounded p-1 bg-card"/></label><label className="text-xs">Orientation status<select value={o.orientationStatus} onChange={e=>onUpdateOnboarding({...o,orientationStatus:e.target.value as OnboardingRecord["orientationStatus"]})} className="ml-2 border border-border rounded p-1 bg-card"><option>Scheduled</option><option>Completed</option><option>Rescheduled</option></select></label></div>
          <div className="grid sm:grid-cols-2 gap-2 mt-3">{o.mandatoryProgramIds.map(programId=>{const program=programs.find(p=>p.id===programId);const done=o.completedProgramIds.includes(programId);return <label key={programId} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={done} onChange={e=>{const completedProgramIds=e.target.checked?[...o.completedProgramIds,programId]:o.completedProgramIds.filter(id=>id!==programId);onUpdateOnboarding({...o,completedProgramIds});}}/>{program?.title||"Required onboarding training"}</label>;})}</div>
        </div>)}
        <div className="bg-card rounded-xl border border-border p-4"><button onClick={()=>downloadCsv("onboarding-completion-report.csv",[["Employee","Position","Department","Start Date","Orientation Date","Orientation Status","Mandatory Trainings","Completed Trainings","Status"],...onboarding.map(o=>[o.employeeName,o.position,o.department,o.startDate,o.orientationDate,o.orientationStatus,o.mandatoryProgramIds.map(id=>programs.find(p=>p.id===id)?.title||id).join("; "),o.completedProgramIds.map(id=>programs.find(p=>p.id===id)?.title||id).join("; "),o.status])])} className="rounded-lg border border-border px-3 py-2 text-xs"><FileText className="inline w-3.5 h-3.5 mr-1"/>Download Onboarding Completion Report</button></div>
      </div>}

      {tab==="competencies"&&<div className="space-y-4">
        <div className="bg-card rounded-xl border border-border p-4"><div className="grid md:grid-cols-3 gap-3"><select value={selectedEmployeeId} onChange={e=>setSelectedEmployeeId(e.target.value)} className="border border-border rounded-lg p-2 text-xs bg-card">{employees.map(e=><option key={e.id} value={e.id}>{e.fullName} · {e.position}</option>)}</select><p className="text-xs text-muted-foreground self-center">Compare employee skill levels against required position competencies (scale 1-5).</p><button onClick={()=>downloadCsv("competency-gap-inventory.csv",[["Employee","Position","Competency","Current Level","Required Level","Gap"],...employees.flatMap(emp=>positionCompetencies.filter(c=>c.position===emp.position).map(c=>{const current=employeeCompetencies.find(x=>x.employeeId===emp.id&&x.competency===c.competency)?.currentLevel||0;return [emp.fullName,emp.position,c.competency,current,c.requiredLevel,Math.max(0,c.requiredLevel-current)];}))])} className="rounded-lg border border-border px-3 py-2 text-xs">Export Competency Inventory</button></div></div>
        {selectedEmployee&&<div className="bg-card rounded-xl border border-border p-4"><h3 className="text-sm font-semibold mb-3">{selectedEmployee.fullName} · {selectedEmployee.position}</h3>{requiredCompetencies.length?<div className="space-y-2">{requiredCompetencies.map(c=>{const current=employeeCompetencies.find(x=>x.employeeId===selectedEmployee.id&&x.competency===c.competency);return <div key={c.id} className="grid grid-cols-3 items-center gap-3 border-b border-border/50 py-2"><span className="text-xs">{c.competency}</span><span className="text-xs text-muted-foreground">Current {current?.currentLevel||0} · Required {c.requiredLevel} · Gap {Math.max(0,c.requiredLevel-(current?.currentLevel||0))}</span><select value={current?.currentLevel||0} onChange={e=>onUpdateEmployeeCompetency({employeeId:selectedEmployee.id,competency:c.competency,currentLevel:Number(e.target.value),assessedDate:new Date().toISOString().slice(0,10)})} className="border border-border rounded p-1 text-xs bg-card">{[0,1,2,3,4,5].map(level=><option key={level} value={level}>{level===0?"Not Assessed":level}</option>)}</select></div>;})}</div>:<p className="text-xs text-muted-foreground">No competencies defined for this position. Add the required competencies below.</p>}</div>}
        <div className="bg-card rounded-xl border border-border p-4"><h3 className="text-sm font-semibold mb-3">Position Competency Requirements</h3><div className="grid md:grid-cols-3 gap-2"><input placeholder="Position title" value={competencyForm.position} onChange={e=>setCompetencyForm(f=>({...f,position:e.target.value}))} className="border border-border rounded p-2 text-xs bg-card"/><input placeholder="Competency" value={competencyForm.competency} onChange={e=>setCompetencyForm(f=>({...f,competency:e.target.value}))} className="border border-border rounded p-2 text-xs bg-card"/><div className="flex gap-2"><select value={competencyForm.requiredLevel} onChange={e=>setCompetencyForm(f=>({...f,requiredLevel:Number(e.target.value)}))} className="border border-border rounded p-2 text-xs bg-card">{[1,2,3,4,5].map(n=><option key={n} value={n}>Level {n}</option>)}</select><button disabled={!competencyForm.position.trim()||!competencyForm.competency.trim()} onClick={()=>{onAddPositionCompetency({...competencyForm});setCompetencyForm({position:"",competency:"",requiredLevel:3});}} className="rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Add Requirement</button></div></div></div>
      </div>}

      {tab==="reports"&&<div className="grid sm:grid-cols-2 gap-3">
        <button onClick={()=>downloadCsv("training-program-report.csv",[["Program","Category","Sponsor","Type","Start","End","Status","Slots","Nominated"],...programs.map(p=>[p.title,p.category,p.sponsoringAgency||p.organizer,p.type,p.startDate,p.endDate,p.status,p.slots,p.nominated])])} className="rounded-xl border border-border bg-card p-4 text-left text-xs font-medium"><FileText className="inline w-4 h-4 mr-2 text-[#C8A84B]"/>Training / Program Report</button>
        <button onClick={()=>downloadCsv("trainings-by-sponsoring-agency.csv",[["Sponsoring Agency","Program","Type","Participants"],...programs.map(p=>[p.sponsoringAgency||p.organizer,p.title,p.type,nominations.filter(n=>n.programId===p.id&&n.status!=="Declined").length])])} className="rounded-xl border border-border bg-card p-4 text-left text-xs font-medium"><FileText className="inline w-4 h-4 mr-2 text-[#C8A84B]"/>Trainings by Sponsoring Agency</button>
        <button onClick={()=>downloadCsv("scholarship-training-report.csv",[["Employee","Department","Program","Sponsor","Scholarship Grant","Status"],...nominations.filter(n=>programs.find(p=>p.id===n.programId)?.type==="Scholarship").map(n=>{const p=programs.find(program=>program.id===n.programId);return [n.employeeName,n.department,p?.title||"",p?.sponsoringAgency||p?.organizer||"",p?.scholarshipGrant||"",n.status];})])} className="rounded-xl border border-border bg-card p-4 text-left text-xs font-medium"><FileText className="inline w-4 h-4 mr-2 text-[#C8A84B]"/>Employees with Scholarship Grants</button>
        <button onClick={()=>downloadCsv("individual-training-records.csv",[["Employee","Employee No.","Program","Sponsor","Training Dates","Type","Assessment","Status","PDS Sync"],...nominations.map(n=>{const p=programs.find(program=>program.id===n.programId);const e=employees.find(emp=>emp.id===n.employeeId);return [n.employeeName,e?.employeeNo||"",p?.title||"",p?.sponsoringAgency||p?.organizer||"",p?`${p.startDate} - ${p.endDate}`:"",p?.type||"",n.assessmentScore??"",n.status,n.pdsSynced?"Synced":"Pending"];})])} className="rounded-xl border border-border bg-card p-4 text-left text-xs font-medium"><FileText className="inline w-4 h-4 mr-2 text-[#C8A84B]"/>Employee / Individual Training Records</button>
      </div>}

      <Modal open={!!showNom} onClose={()=>setShowNom(null)} title={`Training Nomination: ${showNom?.title||""}`}>
        <div className="space-y-3"><label className="block text-xs font-medium">Select Employee<select value={nomForm.employeeId} onChange={e=>setNomForm(f=>({...f,employeeId:e.target.value}))} className="block w-full border border-border rounded-lg px-3 py-2 mt-1 text-sm bg-card"><option value="">Choose employee</option>{employees.map(e=><option key={e.id} value={e.id}>{e.fullName}</option>)}</select></label>
          <label className="block text-xs font-medium">Justification / Nomination Form<textarea value={nomForm.note} onChange={e=>setNomForm(f=>({...f,note:e.target.value}))} rows={3} className="block w-full border border-border rounded-lg px-3 py-2 mt-1 text-sm bg-card"/></label>
          <button onClick={()=>{if(!nomForm.employeeId||!showNom){setNotice("Select an employee before submitting the nomination.");return;}if(nominations.some(n=>n.programId===showNom.id&&n.employeeId===nomForm.employeeId&&n.status!=="Declined")){setNotice("This employee already has an active nomination for the selected program.");return;}if(showNom.nominated>=showNom.slots){setNotice("This training program has reached its nomination capacity.");return;}const emp=employees.find(e=>e.id===nomForm.employeeId);if(!emp)return;onNominate({programId:showNom.id,employeeId:emp.id,employeeName:emp.fullName,department:emp.department,status:"Pending",nominatedDate:new Date().toISOString().slice(0,10),justification:nomForm.note});setShowNom(null);setNomForm({employeeId:"",note:""});}} className="w-full py-2.5 rounded-xl text-sm font-semibold" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Submit for Approval</button>
        </div>
      </Modal>
      {notice&&<div role="status" className="fixed bottom-4 right-4 z-50 max-w-md rounded-xl border border-border bg-card p-4 text-xs shadow-xl">{notice}<button onClick={()=>setNotice("")} className="ml-3 font-semibold text-[#C8A84B]">Dismiss</button></div>}
    </div>
  );
}

export function PerformancePage({ ratings, employees, bonusForms, developmentPlans, coachingRecords, onAddRating, onUpdateRating, onAddBonusForm, onUpdateBonusForm, onAddDevelopmentPlan, onUpdateDevelopmentPlan, onAddCoachingRecord, onUpdateCoachingRecord }: {
  ratings: PerformanceRating[]; employees: Employee[]; bonusForms: PerformanceBonusForm[];
  developmentPlans: IndividualDevelopmentPlan[]; coachingRecords: CoachingRecord[];
  onAddRating: (r: Omit<PerformanceRating,"id">) => void; onUpdateRating: (r: PerformanceRating) => void;
  onAddBonusForm: (b: Omit<PerformanceBonusForm,"id">) => void; onUpdateBonusForm: (b: PerformanceBonusForm) => void;
  onAddDevelopmentPlan: (p: Omit<IndividualDevelopmentPlan,"id">) => void;
  onUpdateDevelopmentPlan: (p: IndividualDevelopmentPlan) => void;
  onAddCoachingRecord: (c: Omit<CoachingRecord,"id">) => void;
  onUpdateCoachingRecord: (c: CoachingRecord) => void;
}) {
  const [tab, setTab] = useState<"appraisals"|"bonus"|"strategic"|"development"|"coaching">("appraisals");
  const [formOpen,setFormOpen]=useState(false);
  const [bonusSource,setBonusSource]=useState<PerformanceRating|null>(null);
  const [notice,setNotice]=useState("");
  const [searchQ,setSearchQ]=useState("");
  const [appraisal,setAppraisal]=useState({employeeId:"",period:"2026",type:"IPCR" as PerformanceRating["type"],outputScore:"3",efficiencyScore:"3",timelinessScore:"3"});
  const [bonusDraft,setBonusDraft]=useState({amount:"",notes:""});
  const [planDraft,setPlanDraft]=useState({employeeId:"",period:"2026",developmentGoals:"",competencyGaps:"",plannedActivities:"",targetDate:""});
  const [coachingDraft,setCoachingDraft]=useState({employeeId:"",coach:"",coachingDate:"",discussion:"",actionItems:"",followUpDate:""});
  const statusColor: Record<string,string>={Draft:"bg-gray-100 text-gray-500",Submitted:"bg-blue-100 text-blue-700",Reviewed:"bg-amber-100 text-amber-700",Approved:"bg-emerald-500/15 text-emerald-400"};
  const average=ratings.length?ratings.reduce((sum,r)=>sum+r.finalRating,0)/ratings.length:0;
  const filtered=ratings.filter(r=>(tab==="appraisals"||r.type===(tab==="strategic"?"IPCR":tab==="bonus"?"IPCR":r.type))&&`${r.employeeName} ${r.department} ${r.period}`.toLowerCase().includes(searchQ.toLowerCase()));
  const exportCsv=(filename:string,rows:(string|number)[][])=>{
    const csv=rows.map(row=>row.map(cell=>`"${String(cell??"").replaceAll('"','""')}"`).join(",")).join("\r\n");
    const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
    const anchor=document.createElement("a");anchor.href=url;anchor.download=filename;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const createAppraisal=()=>{
    const employee=employees.find(e=>e.id===appraisal.employeeId);
    const scores=[appraisal.outputScore,appraisal.efficiencyScore,appraisal.timelinessScore].map(Number);
    if(!employee||!appraisal.period.trim()||scores.some(score=>!Number.isFinite(score)||score<1||score>5)){setNotice("Select an employee, enter a period, and provide three ratings from 1 to 5.");return;}
    const finalRating=Number((scores.reduce((sum,score)=>sum+score,0)/scores.length).toFixed(2));
    const adjectivalRating=finalRating>=4.5?"Outstanding":finalRating>=3.5?"Very Satisfactory":finalRating>=2.5?"Satisfactory":"Unsatisfactory";
    onAddRating({employeeId:employee.id,employeeName:employee.fullName,department:employee.department,period:appraisal.period,type:appraisal.type,outputScore:scores[0],efficiencyScore:scores[1],timelinessScore:scores[2],finalRating,adjectivalRating,status:"Draft",submittedDate:""});
    setFormOpen(false);setNotice(`${appraisal.type} appraisal saved as Draft.`);
  };
  const generateBonusForm=()=>{
    if(!bonusSource)return;
    const amount=Number(bonusDraft.amount);
    if(!bonusDraft.amount||!Number.isFinite(amount)||amount<0){setNotice("Enter a valid non-negative proposed bonus amount.");return;}
    const existing=bonusForms.find(f=>f.ratingId===bonusSource.id);
    if(existing){onUpdateBonusForm({...existing,proposedAmount:amount,notes:bonusDraft.notes,status:"Draft",generatedDate:new Date().toISOString().slice(0,10)});}
    else onAddBonusForm({ratingId:bonusSource.id,employeeId:bonusSource.employeeId,employeeName:bonusSource.employeeName,period:bonusSource.period,finalRating:bonusSource.finalRating,proposedAmount:amount,status:"Draft",notes:bonusDraft.notes,generatedDate:new Date().toISOString().slice(0,10)});
    setBonusSource(null);setBonusDraft({amount:"",notes:""});setNotice("Performance-Based Bonus Form generated as a draft. Apply the approved PBB policy before approval.");
  };
  const performanceBonusCsv=[["Employee","Department","Period","IPCR/OPCR Rating","Adjectival Rating","Proposed Amount","Form Status","Notes"],...bonusForms.map(b=>[b.employeeName,employees.find(e=>e.id===b.employeeId)?.department||"",b.period,b.finalRating,ratings.find(r=>r.id===b.ratingId)?.adjectivalRating||"",b.proposedAmount,b.status,b.notes])];
  return <div>
    <SectionHeader title="Performance Management" subtitle="HRDO Performance Unit · Appraisals, performance-based bonus, development plans, and coaching"/>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {[{label:"Appraisals",value:ratings.length,icon:ClipboardCheck,color:"#3B82F6"},{label:"Outstanding",value:ratings.filter(r=>r.adjectivalRating==="Outstanding").length,icon:Star,color:"#C8A84B"},{label:"Average Rating",value:average.toFixed(2),icon:Target,color:"#059669"},{label:"Pending Review",value:ratings.filter(r=>r.status==="Submitted").length,icon:Clock,color:"#7C3AED"}].map(s=><div key={s.label} className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{backgroundColor:`${s.color}15`}}><s.icon className="w-5 h-5" style={{color:s.color}}/></div><div><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div></div>)}
    </div>
    <div className="flex flex-wrap gap-1 bg-muted/40 p-1 rounded-xl mb-5">
      {([{id:"appraisals",label:"IPCR / OPCR Appraisals"},{id:"bonus",label:"Performance-Based Bonus"},{id:"strategic",label:"Strategic Report"},{id:"development",label:"Individual Development Plans"},{id:"coaching",label:"Coaching & Monitoring"}] as const).map(item=><button key={item.id} onClick={()=>setTab(item.id)} className={`px-3 py-2 rounded-lg text-sm font-medium ${tab===item.id?"bg-muted/60 text-[#C8A84B] shadow-sm":"text-muted-foreground hover:text-foreground"}`}>{item.label}</button>)}
    </div>

    {tab==="appraisals"&&<div>
      <div className="flex flex-wrap justify-between gap-3 mb-4"><input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search employee, department, period" className="border border-border rounded-lg px-3 py-2 text-sm bg-card"/><button onClick={()=>setFormOpen(true)} className="rounded-lg px-4 py-2 text-sm font-semibold" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}><Plus className="inline w-4 h-4 mr-1"/>New IPCR / OPCR</button></div>
      <div className="bg-card rounded-xl border border-border overflow-x-auto"><table className="w-full text-sm"><thead className="bg-muted/30"><tr>{["Employee / Office","Type","Period","Output","Efficiency","Timeliness","Final","Status","Actions"].map(h=><th key={h} className="px-3 py-3 text-left text-xs text-muted-foreground">{h}</th>)}</tr></thead><tbody>
        {filtered.map(r=><tr key={r.id} className="border-t border-border/60"><td className="px-3 py-3 text-xs font-medium">{r.employeeName}<div className="text-muted-foreground">{r.department}</div></td><td className="px-3 py-3 text-xs">{r.type}</td><td className="px-3 py-3 text-xs">{r.period}</td><td className="px-3 py-3 text-xs">{r.outputScore.toFixed(1)}</td><td className="px-3 py-3 text-xs">{r.efficiencyScore.toFixed(1)}</td><td className="px-3 py-3 text-xs">{r.timelinessScore.toFixed(1)}</td><td className="px-3 py-3 text-xs font-bold">{r.finalRating.toFixed(2)}<div className="text-muted-foreground font-normal">{r.adjectivalRating}</div></td><td className="px-3 py-3"><select aria-label={`Appraisal status for ${r.employeeName}`} value={r.status} onChange={e=>onUpdateRating({...r,status:e.target.value as PerformanceRating["status"],submittedDate:e.target.value==="Submitted"&&!r.submittedDate?new Date().toISOString().slice(0,10):r.submittedDate})} className="border border-border rounded p-1 text-xs bg-card">{["Draft","Submitted","Reviewed","Approved"].map(s=><option key={s}>{s}</option>)}</select></td><td className="px-3 py-3"><button onClick={()=>{setBonusSource(r);setBonusDraft({amount:String(bonusForms.find(b=>b.ratingId===r.id)?.proposedAmount||""),notes:bonusForms.find(b=>b.ratingId===r.id)?.notes||""});setTab("bonus");}} className="text-[11px] text-[#92751E] hover:underline">PBB Form</button></td></tr>)}
      </tbody></table>{filtered.length===0&&<p className="p-5 text-xs text-muted-foreground">No matching appraisal records.</p>}</div>
    </div>}

    {tab==="bonus"&&<div className="space-y-4">
      <div className="bg-card rounded-xl border border-border p-4"><h3 className="text-sm font-semibold mb-1">Generate Performance-Based Bonus Form</h3><p className="text-xs text-muted-foreground mb-3">Select an appraisal to create a draft PBB form. Proposed amounts are manually entered; no PBB computation policy is assumed.</p><div className="flex flex-wrap gap-2"><select value={bonusSource?.id||""} onChange={e=>{const r=ratings.find(x=>x.id===e.target.value)||null;setBonusSource(r);const existing=bonusForms.find(b=>b.ratingId===r?.id);setBonusDraft({amount:String(existing?.proposedAmount||""),notes:existing?.notes||""});}} className="min-w-64 border border-border rounded-lg p-2 text-xs bg-card"><option value="">Select appraisal record</option>{ratings.map(r=><option key={r.id} value={r.id}>{r.employeeName} · {r.type} {r.period} · {r.finalRating}</option>)}</select><input type="number" min="0" step="0.01" value={bonusDraft.amount} onChange={e=>setBonusDraft(f=>({...f,amount:e.target.value}))} placeholder="Proposed bonus amount (₱)" className="border border-border rounded-lg p-2 text-xs bg-card"/><input value={bonusDraft.notes} onChange={e=>setBonusDraft(f=>({...f,notes:e.target.value}))} placeholder="Notes / policy reference" className="min-w-52 border border-border rounded-lg p-2 text-xs bg-card"/><button disabled={!bonusSource} onClick={generateBonusForm} className="rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Generate / Update Form</button></div></div>
      <div className="bg-card rounded-xl border border-border p-4"><div className="flex flex-wrap justify-between gap-2 mb-3"><h3 className="text-sm font-semibold">Performance-Based Bonus Forms ({bonusForms.length})</h3><button onClick={()=>exportCsv("performance-based-bonus-report.csv",performanceBonusCsv)} className="rounded-lg border border-border px-3 py-2 text-xs"><FileText className="inline w-3.5 h-3.5 mr-1"/>Download PBB Report</button></div><div className="overflow-x-auto"><table className="w-full text-xs"><thead className="bg-muted/30"><tr>{["Employee","Period","Rating","Proposed Amount","Status","Update"].map(h=><th key={h} className="p-2 text-left">{h}</th>)}</tr></thead><tbody>{bonusForms.map(b=><tr key={b.id} className="border-t border-border"><td className="p-2">{b.employeeName}</td><td className="p-2">{b.period}</td><td className="p-2">{b.finalRating}</td><td className="p-2">₱{b.proposedAmount.toLocaleString()}</td><td className="p-2">{b.status}</td><td className="p-2"><select aria-label={`PBB status for ${b.employeeName}`} value={b.status} onChange={e=>onUpdateBonusForm({...b,status:e.target.value as PerformanceBonusForm["status"]})} className="border border-border rounded p-1 bg-card">{["Draft","For Review","Approved","Not Eligible"].map(s=><option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table>{!bonusForms.length&&<p className="text-xs text-muted-foreground py-3">No PBB forms generated yet.</p>}</div></div>
    </div>}

    {tab==="strategic"&&<div className="space-y-4">
      <div className="bg-card rounded-xl border border-border p-4"><div className="flex flex-wrap justify-between gap-3"><div><h3 className="text-sm font-semibold">Strategic Performance Management Report</h3><p className="text-xs text-muted-foreground mt-1">Ratings, approval status, and IPCR/OPCR coverage by department.</p></div><button onClick={()=>{const depts=[...new Set(ratings.map(r=>r.department))];exportCsv("strategic-performance-management-report.csv",[["Department","Appraisals","IPCR","OPCR","Average Rating","Approved","Submitted","Outstanding"],...depts.map(dept=>{const rows=ratings.filter(r=>r.department===dept);return [dept,rows.length,rows.filter(r=>r.type==="IPCR").length,rows.filter(r=>r.type==="OPCR").length,rows.length?(rows.reduce((s,r)=>s+r.finalRating,0)/rows.length).toFixed(2):"0",rows.filter(r=>r.status==="Approved").length,rows.filter(r=>r.status==="Submitted").length,rows.filter(r=>r.adjectivalRating==="Outstanding").length];})])}} className="rounded-lg border border-border px-3 py-2 text-xs"><FileText className="inline w-3.5 h-3.5 mr-1"/>Export Strategic Report</button></div></div>
      <div className="bg-card rounded-xl border border-border overflow-x-auto"><table className="w-full text-xs"><thead className="bg-muted/30"><tr>{["Department","Appraisals","IPCR","OPCR","Average","Approved","Submitted","Outstanding"].map(h=><th key={h} className="p-3 text-left">{h}</th>)}</tr></thead><tbody>{[...new Set(ratings.map(r=>r.department))].map(dept=>{const rows=ratings.filter(r=>r.department===dept);return <tr key={dept} className="border-t border-border"><td className="p-3">{dept}</td><td className="p-3">{rows.length}</td><td className="p-3">{rows.filter(r=>r.type==="IPCR").length}</td><td className="p-3">{rows.filter(r=>r.type==="OPCR").length}</td><td className="p-3">{(rows.reduce((s,r)=>s+r.finalRating,0)/rows.length).toFixed(2)}</td><td className="p-3">{rows.filter(r=>r.status==="Approved").length}</td><td className="p-3">{rows.filter(r=>r.status==="Submitted").length}</td><td className="p-3">{rows.filter(r=>r.adjectivalRating==="Outstanding").length}</td></tr>;})}</tbody></table></div>
    </div>}

    {tab==="development"&&<div className="space-y-4">
      <div className="bg-card rounded-xl border border-border p-4"><h3 className="text-sm font-semibold mb-3">Individual Learning and Development Plan</h3><div className="grid md:grid-cols-2 gap-3"><select value={planDraft.employeeId} onChange={e=>setPlanDraft(f=>({...f,employeeId:e.target.value}))} className="border border-border rounded p-2 text-xs bg-card"><option value="">Select employee</option>{employees.map(e=><option key={e.id} value={e.id}>{e.fullName}</option>)}</select><input value={planDraft.period} onChange={e=>setPlanDraft(f=>({...f,period:e.target.value}))} placeholder="Plan period" className="border border-border rounded p-2 text-xs bg-card"/><textarea value={planDraft.developmentGoals} onChange={e=>setPlanDraft(f=>({...f,developmentGoals:e.target.value}))} placeholder="Development goals" className="border border-border rounded p-2 text-xs bg-card"/><textarea value={planDraft.competencyGaps} onChange={e=>setPlanDraft(f=>({...f,competencyGaps:e.target.value}))} placeholder="Competency gaps / development needs" className="border border-border rounded p-2 text-xs bg-card"/><textarea value={planDraft.plannedActivities} onChange={e=>setPlanDraft(f=>({...f,plannedActivities:e.target.value}))} placeholder="Planned learning activities" className="border border-border rounded p-2 text-xs bg-card"/><label className="text-xs">Target date<input type="date" value={planDraft.targetDate} onChange={e=>setPlanDraft(f=>({...f,targetDate:e.target.value}))} className="block w-full border border-border rounded p-2 mt-1 bg-card"/></label><button disabled={!planDraft.employeeId||!planDraft.developmentGoals.trim()||!planDraft.targetDate} onClick={()=>{const employee=employees.find(e=>e.id===planDraft.employeeId);if(!employee)return;onAddDevelopmentPlan({...planDraft,employeeName:employee.fullName,status:"Draft"});setPlanDraft({employeeId:"",period:"2026",developmentGoals:"",competencyGaps:"",plannedActivities:"",targetDate:""});setNotice("Individual development plan saved.");}} className="rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Create Development Plan</button></div></div>
      <div className="space-y-2">{developmentPlans.map(p=><div key={p.id} className="bg-card rounded-xl border border-border p-4"><div className="flex flex-wrap justify-between gap-2"><div><h4 className="text-sm font-semibold">{p.employeeName} · {p.period}</h4><p className="text-xs mt-1">{p.developmentGoals}</p><p className="text-xs text-muted-foreground mt-1">Needs: {p.competencyGaps||"Not specified"} · Activities: {p.plannedActivities||"Not specified"} · Target {p.targetDate}</p></div><select aria-label={`Development plan status for ${p.employeeName}`} value={p.status} onChange={e=>onUpdateDevelopmentPlan({...p,status:e.target.value as IndividualDevelopmentPlan["status"]})} className="h-fit border border-border rounded p-1 text-xs bg-card">{["Draft","In Progress","Completed"].map(s=><option key={s}>{s}</option>)}</select></div></div>)}</div>
      {!developmentPlans.length&&<p className="text-xs text-muted-foreground">No individual learning and development plans yet.</p>}
    </div>}

    {tab==="coaching"&&<div className="space-y-4">
      <div className="bg-card rounded-xl border border-border p-4"><h3 className="text-sm font-semibold mb-3">Coaching and Performance Monitoring</h3><div className="grid md:grid-cols-2 gap-3"><select value={coachingDraft.employeeId} onChange={e=>setCoachingDraft(f=>({...f,employeeId:e.target.value}))} className="border border-border rounded p-2 text-xs bg-card"><option value="">Select employee</option>{employees.map(e=><option key={e.id} value={e.id}>{e.fullName}</option>)}</select><input value={coachingDraft.coach} onChange={e=>setCoachingDraft(f=>({...f,coach:e.target.value}))} placeholder="Coach / supervisor" className="border border-border rounded p-2 text-xs bg-card"/><label className="text-xs">Coaching date<input type="date" value={coachingDraft.coachingDate} onChange={e=>setCoachingDraft(f=>({...f,coachingDate:e.target.value}))} className="block w-full border border-border rounded p-2 mt-1 bg-card"/></label><label className="text-xs">Follow-up date<input type="date" value={coachingDraft.followUpDate} onChange={e=>setCoachingDraft(f=>({...f,followUpDate:e.target.value}))} className="block w-full border border-border rounded p-2 mt-1 bg-card"/></label><textarea value={coachingDraft.discussion} onChange={e=>setCoachingDraft(f=>({...f,discussion:e.target.value}))} placeholder="Coaching discussion / performance observations" className="border border-border rounded p-2 text-xs bg-card"/><textarea value={coachingDraft.actionItems} onChange={e=>setCoachingDraft(f=>({...f,actionItems:e.target.value}))} placeholder="Agreed actions and monitoring items" className="border border-border rounded p-2 text-xs bg-card"/><button disabled={!coachingDraft.employeeId||!coachingDraft.coach.trim()||!coachingDraft.coachingDate||!coachingDraft.discussion.trim()} onClick={()=>{const employee=employees.find(e=>e.id===coachingDraft.employeeId);if(!employee)return;onAddCoachingRecord({...coachingDraft,employeeName:employee.fullName,status:"Scheduled"});setCoachingDraft({employeeId:"",coach:"",coachingDate:"",discussion:"",actionItems:"",followUpDate:""});}} className="rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Schedule Coaching</button></div></div>
      <div className="space-y-2">{coachingRecords.map(c=><div key={c.id} className="bg-card rounded-xl border border-border p-4"><div className="flex flex-wrap justify-between gap-2"><div><h4 className="text-sm font-semibold">{c.employeeName} · Coach: {c.coach}</h4><p className="text-xs text-muted-foreground">{c.coachingDate} · Follow-up {c.followUpDate||"Not scheduled"}</p><p className="text-xs mt-2">{c.discussion}</p><p className="text-xs text-muted-foreground mt-1">Actions: {c.actionItems||"None recorded"}</p></div><select aria-label={`Coaching status for ${c.employeeName}`} value={c.status} onChange={e=>onUpdateCoachingRecord({...c,status:e.target.value as CoachingRecord["status"]})} className="h-fit border border-border rounded p-1 text-xs bg-card">{["Scheduled","Completed","Follow-up"].map(s=><option key={s}>{s}</option>)}</select></div></div>)}</div>
      {!coachingRecords.length&&<p className="text-xs text-muted-foreground">No coaching sessions recorded yet.</p>}
    </div>}
    {notice&&<div role="status" className="fixed bottom-4 right-4 z-50 max-w-md rounded-xl border border-border bg-card p-4 text-xs shadow-xl">{notice}<button onClick={()=>setNotice("")} className="ml-3 font-semibold text-[#92751E]">Dismiss</button></div>}
    <Modal open={formOpen} onClose={()=>setFormOpen(false)} title="New IPCR / OPCR Appraisal">
      <div className="grid gap-3"><label className="text-xs">Employee / Office<select value={appraisal.employeeId} onChange={e=>setAppraisal(f=>({...f,employeeId:e.target.value}))} className="block w-full border border-border rounded p-2 mt-1 text-sm bg-card"><option value="">Select employee or office representative</option>{employees.map(e=><option key={e.id} value={e.id}>{e.fullName} · {e.department}</option>)}</select></label><div className="grid grid-cols-2 gap-3"><label className="text-xs">Form type<select value={appraisal.type} onChange={e=>setAppraisal(f=>({...f,type:e.target.value as PerformanceRating["type"]}))} className="block w-full border border-border rounded p-2 mt-1 bg-card"><option>IPCR</option><option>OPCR</option></select></label><label className="text-xs">Rating period<input value={appraisal.period} onChange={e=>setAppraisal(f=>({...f,period:e.target.value}))} className="block w-full border border-border rounded p-2 mt-1 bg-card"/></label></div>{([["Output","outputScore"],["Efficiency","efficiencyScore"],["Timeliness","timelinessScore"]] as const).map(([label,key])=><label key={key} className="text-xs">{label} score (1-5)<input type="number" min="1" max="5" step="0.1" value={appraisal[key]} onChange={e=>setAppraisal(f=>({...f,[key]:e.target.value}))} className="block w-full border border-border rounded p-2 mt-1 bg-card"/></label>)}<p className="text-[11px] text-muted-foreground">Final rating is the arithmetic mean of the three entered scores. Adjust this computation if the approved PNU IPCR/OPCR form uses different weights.</p><button onClick={createAppraisal} className="rounded-lg p-2.5 text-sm font-semibold" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Save Appraisal Draft</button></div>
    </Modal>
  </div>;
}

export function RewardsPage({ nominations, employees, nominatedBy, onNominate, onUpdateNomination }: {
  nominations: RewardNomination[]; employees: Employee[]; nominatedBy: string;
  onNominate: (n: Omit<RewardNomination,"id">) => void;
  onUpdateNomination: (n: RewardNomination) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<"All"|"Pending"|"Endorsed"|"Approved"|"Rejected">("All");
  const [awardFilter, setAwardFilter] = useState<"All"|RewardAwardType>("All");
  const [form, setForm] = useState<{awardType:RewardAwardType; nomineeId:string; reason:string; period:string}>({ awardType:"Outstanding Employee Award", nomineeId:"", reason:"", period:"2026" });
  const [notice, setNotice] = useState("");
  const AWARD_TYPES: RewardAwardType[] = [
    "PRAISE Nomination","Productivity Enhancement Incentive","Special Awards",
    "Performance Based Bonus","Loyalty Incentive Pay","Perfect Attendance Incentive",
    "Research Awards","Extension Awards","Outstanding Teacher Award",
    "Outstanding Employee Award","Gawad Agad Award (On-the- Spot recognition)",
  ];
  const statusColor: Record<string,string> = {
    Pending:"bg-amber-100 text-amber-700", Endorsed:"bg-blue-100 text-blue-700",
    Approved:"bg-emerald-500/15 text-emerald-400", Rejected:"bg-red-500/15 text-red-400",
  };
  const awardIcon: Record<string,React.ElementType> = {
    "Outstanding Employee Award":Trophy,"Outstanding Teacher Award":Star,"Research Awards":Microscope,
    "Perfect Attendance Incentive":CheckCircle,"PRAISE Nomination":Award,"Loyalty Incentive Pay":Medal,
    "Extension Awards":Heart,"Gawad Agad Award (On-the- Spot recognition)":Medal,
    "Productivity Enhancement Incentive":Target,"Performance Based Bonus":Award,
    "Special Awards":Trophy,
  };
  const filtered = nominations.filter(n=>(filter==="All"||n.status===filter)&&(awardFilter==="All"||n.awardType===awardFilter));
  const exportReport=()=>{
    const rows=[["Award Type","Nominee","Department","Period","Nominated By","Date Nominated","Status","Justification"],...nominations.map(n=>[n.awardType,n.nomineeName,n.department,n.period,n.nominatedBy,n.dateNominated,n.status,n.reason])];
    const csv=rows.map(row=>row.map(cell=>`"${String(cell??"").replaceAll('"','""')}"`).join(",")).join("\r\n");
    const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
    const anchor=document.createElement("a");anchor.href=url;anchor.download="praise-awards-nominations-report.csv";anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };

  return (
    <div>
      <SectionHeader title="Rewards & Recognition" subtitle="HRDO Rewards Unit · PNU PRAISE nominations, incentives, awards, and recognition"/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label:"Total Nominations", value:nominations.length, icon:Award, color:"#C8A84B" },
          { label:"Approved", value:nominations.filter(n=>n.status==="Approved").length, icon:Trophy, color:"#059669" },
          { label:"Pending Review", value:nominations.filter(n=>n.status==="Pending").length, icon:Clock, color:"#D97706" },
          { label:"Award Types", value:AWARD_TYPES.length, icon:Star, color:"#3B82F6" },
        ].map(s=>(
          <div key={s.label} className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:`${s.color}15`}}>
              <s.icon className="w-5 h-5" style={{color:s.color}}/>
            </div>
            <div><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 bg-muted/40 p-1 rounded-xl">
            {(["All","Pending","Endorsed","Approved","Rejected"] as const).map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter===f?"bg-muted/60 text-[#C8A84B] shadow-sm":"text-muted-foreground hover:text-foreground"}`}>{f}</button>
            ))}
          </div>
          <select aria-label="Filter by award type" value={awardFilter} onChange={e=>setAwardFilter(e.target.value as "All"|RewardAwardType)} className="border border-border rounded-lg px-3 py-2 text-xs bg-card">
            <option value="All">All PRAISE award types</option>
            {AWARD_TYPES.map(type=><option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={exportReport} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-border"><FileText className="w-3.5 h-3.5"/>Export Report</button>
          <button onClick={()=>setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>
            <Plus className="w-3.5 h-3.5"/>New Nomination
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(n=>{
          const IconComp = awardIcon[n.awardType]||Award;
          return (
            <div key={n.id} className="bg-card rounded-xl border border-border p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:"rgba(200,168,75,0.12)"}}>
                  <IconComp className="w-5 h-5" style={{color:"#C8A84B"}}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="text-sm font-semibold">{n.awardType}</h4>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusColor[n.status]}`}>{n.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1"><strong>{n.nomineeName}</strong> · {n.department} · {n.period}</p>
                  <p className="text-xs text-foreground/70 line-clamp-2">{n.reason}</p>
                  <p className="text-xs text-muted-foreground mt-1">Nominated by {n.nominatedBy} · {fd(n.dateNominated)}</p>
                </div>
                <label className="text-[11px] text-muted-foreground shrink-0">Status
                  <select aria-label={`Nomination status for ${n.nomineeName} - ${n.awardType}`} value={n.status} onChange={e=>onUpdateNomination({...n,status:e.target.value as RewardNomination["status"]})} className="block mt-1 border border-border rounded-lg px-2 py-1.5 text-xs bg-card text-foreground">
                    {["Pending","Endorsed","Approved","Rejected"].map(status=><option key={status}>{status}</option>)}
                  </select>
                </label>
              </div>
            </div>
          );
        })}
        {!filtered.length&&<div className="bg-card rounded-xl border border-border p-8 text-center text-sm text-muted-foreground">No nominations match the selected filters.</div>}
      </div>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Submit Award Nomination">
        <div className="space-y-3">
          <div><label className="block text-xs font-medium text-muted-foreground mb-1">Award Type</label>
          <select value={form.awardType} onChange={e=>setForm(f=>({...f,awardType:e.target.value as RewardAwardType}))}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none bg-card">
            {AWARD_TYPES.map(t=><option key={t}>{t}</option>)}
          </select></div>
          <div><label className="block text-xs font-medium text-muted-foreground mb-1">Nominee</label>
          <select value={form.nomineeId} onChange={e=>setForm(f=>({...f,nomineeId:e.target.value}))}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none bg-card">
            <option value="">— Select employee —</option>
            {employees.map(e=><option key={e.id} value={e.id}>{e.fullName}</option>)}
          </select></div>
          <div><label className="block text-xs font-medium text-muted-foreground mb-1">Period</label>
          <input value={form.period} onChange={e=>setForm(f=>({...f,period:e.target.value}))} placeholder="e.g. Calendar Year 2026"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none bg-card"/></div>
          <div><label className="block text-xs font-medium text-muted-foreground mb-1">Justification / Reason</label>
          <textarea value={form.reason} onChange={e=>setForm(f=>({...f,reason:e.target.value}))} rows={4}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none bg-card"/></div>
          <button onClick={()=>{
            const emp = employees.find(e=>e.id===form.nomineeId);
            if(!emp||!form.period.trim()||!form.reason.trim()){setNotice("Select a nominee and enter the award period and justification.");return;}
            onNominate({...form,period:form.period.trim(),reason:form.reason.trim(),nomineeId:emp.id,nomineeName:emp.fullName,department:emp.department,nominatedBy,status:"Pending",dateNominated:new Date().toISOString().slice(0,10)});
            setShowAdd(false); setForm({awardType:"Outstanding Employee Award",nomineeId:"",reason:"",period:"2026"});
          }} className="w-full py-2.5 rounded-xl text-sm font-semibold" style={{backgroundColor:"#C8A84B", color:"#1A2744"}}>
            Submit Nomination
          </button>
        </div>
      </Modal>
      {notice&&<div role="status" className="fixed bottom-4 right-4 z-50 max-w-md rounded-xl border border-border bg-card p-4 text-xs shadow-xl">{notice}<button onClick={()=>setNotice("")} className="ml-3 font-semibold text-[#92751E]">Dismiss</button></div>}
    </div>
  );
}

export function WellnessPage({ records, employees, riskAssessments, programs, counselingRecords, onAdd, onUpdateRecord, onAddRiskAssessment, onAddProgram, onUpdateProgram, onAddCounseling, onUpdateCounseling }: {
  records: WellnessRecord[]; employees: Employee[]; riskAssessments: HealthRiskAssessment[];
  programs: WellnessProgram[]; counselingRecords: CounselingRecord[];
  onAdd: (r: Omit<WellnessRecord,"id">) => void;
  onUpdateRecord: (r: WellnessRecord) => void;
  onAddRiskAssessment: (r: Omit<HealthRiskAssessment,"id">) => void;
  onAddProgram: (p: Omit<WellnessProgram,"id">) => void;
  onUpdateProgram: (p: WellnessProgram) => void;
  onAddCounseling: (r: Omit<CounselingRecord,"id">) => void;
  onUpdateCounseling: (r: CounselingRecord) => void;
}) {
  const [tab, setTab] = useState<"records"|"mental"|"risks"|"programs"|"counseling"|"reports">("records");
  const [showAdd, setShowAdd] = useState(false);
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [recordForm, setRecordForm] = useState({ employeeId:"", type:"Medical" as WellnessRecord["type"], description:"", date:"", provider:"PNU Medical Clinic" });
  const [riskForm, setRiskForm] = useState({ employeeId:"", assessmentDate:"", riskLevel:"Low" as HealthRiskAssessment["riskLevel"], riskFactors:"", recommendations:"", followUpDate:"" });
  const [programForm, setProgramForm] = useState({ name:"", category:"Wellness", description:"", targetAudience:"All employees", startDate:"", endDate:"" });
  const [counselingForm, setCounselingForm] = useState({ employeeId:"", sessionDate:"", counselor:"", referralSource:"", notes:"", followUpDate:"" });
  const [notice, setNotice] = useState("");
  const typeColor: Record<string,string> = {
    Medical:"bg-blue-100 text-blue-700", Dental:"bg-teal-100 text-teal-700",
    "Mental Health":"bg-purple-100 text-purple-700", "Wellness Program":"bg-emerald-500/15 text-emerald-400",
  };
  const typeIcon: Record<string,React.ElementType> = {
    Medical:Stethoscope, Dental:User, "Mental Health":Heart, "Wellness Program":Activity,
  };
  const statusColor: Record<string,string> = {
    Scheduled:"bg-amber-100 text-amber-700", Completed:"bg-emerald-500/15 text-emerald-400", Cancelled:"bg-red-500/15 text-red-400",
  };
  const exportReport=()=>{
    const rows=[
      ["Health & Wellness Report","Count"],
      ["Medical records",records.filter(r=>r.type==="Medical").length],
      ["Dental records",records.filter(r=>r.type==="Dental").length],
      ["Mental health monitoring records",records.filter(r=>r.type==="Mental Health").length],
      ["Scheduled health services",records.filter(r=>r.status==="Scheduled").length],
      ["Completed health services",records.filter(r=>r.status==="Completed").length],
      ["Risk assessments",riskAssessments.length],
      ["Low risk assessments",riskAssessments.filter(a=>a.riskLevel==="Low").length],
      ["Moderate risk assessments",riskAssessments.filter(a=>a.riskLevel==="Moderate").length],
      ["High risk assessments",riskAssessments.filter(a=>a.riskLevel==="High").length],
      ["Wellness programs",programs.length],
      ["Active wellness programs",programs.filter(p=>p.status==="Active").length],
      ["Counseling sessions",counselingRecords.length],
      ["Scheduled counseling sessions",counselingRecords.filter(c=>c.status==="Scheduled").length],
      ["Completed counseling sessions",counselingRecords.filter(c=>c.status==="Completed").length],
    ];
    const csv=rows.map(row=>row.map(cell=>`"${String(cell??"").replaceAll('"','""')}"`).join(",")).join("\r\n");
    const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
    const anchor=document.createElement("a");anchor.href=url;anchor.download="health-and-wellness-report.csv";anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const recordList=tab==="mental"?records.filter(r=>r.type==="Mental Health"):records.filter(r=>r.type==="Medical"||r.type==="Dental");
  const tabs=[["records","Medical & Dental"],["mental","Mental Health"],["risks","Risk Assessments"],["programs","Wellness Programs"],["counseling","Counseling"],["reports","Reports"]] as const;
  const inputClass="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none bg-card";
  const addRecord=()=>{
    const emp=employees.find(e=>e.id===recordForm.employeeId);
    if(!emp||!recordForm.date||!recordForm.description.trim()||!recordForm.provider.trim()){setNotice("Select an employee and complete the date, service details, and provider.");return;}
    onAdd({...recordForm,description:recordForm.description.trim(),provider:recordForm.provider.trim(),employeeName:emp.fullName,status:"Scheduled"});
    setShowAdd(false);setRecordForm({employeeId:"",type:"Medical",description:"",date:"",provider:"PNU Medical Clinic"});
  };

  return <div>
    <SectionHeader title="Health & Wellness" subtitle="Health and Wellness Office · Medical and dental services, mental health, risk assessment, wellness programs, and counseling"/>
    <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
      Health and counseling information is confidential. Record only information needed to coordinate services; avoid entering diagnoses or unnecessary sensitive details. This demo stores records in this browser.
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {[
        {label:"Medical & Dental Records",value:records.filter(r=>r.type==="Medical"||r.type==="Dental").length,icon:Stethoscope,color:"#3B82F6"},
        {label:"Mental Health Records",value:records.filter(r=>r.type==="Mental Health").length,icon:Heart,color:"#7C3AED"},
        {label:"Risk Assessments",value:riskAssessments.length,icon:Activity,color:"#D97706"},
        {label:"Active Programs",value:programs.filter(p=>p.status==="Active").length,icon:CheckCircle,color:"#059669"},
      ].map(s=><div key={s.label} className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:`${s.color}15`}}><s.icon className="w-5 h-5" style={{color:s.color}}/></div><div><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div></div>)}
    </div>
    <div className="flex flex-wrap gap-1 bg-muted/40 p-1 rounded-xl mb-5">
      {tabs.map(([id,label])=><button key={id} onClick={()=>setTab(id)} className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${tab===id?"bg-muted/60 text-[#C8A84B] shadow-sm":"text-muted-foreground hover:text-foreground"}`}>{label}</button>)}
    </div>

    {(tab==="records"||tab==="mental")&&<div>
      <div className="flex items-center justify-between gap-2 mb-4"><div><h3 className="text-sm font-semibold">{tab==="mental"?"Mental Health Monitoring":"Medical & Dental Information"} ({recordList.length})</h3><p className="text-xs text-muted-foreground mt-1">Track service date, provider, and administrative follow-up.</p></div><button onClick={()=>{setRecordForm(f=>({...f,type:tab==="mental"?"Mental Health":"Medical"}));setShowAdd(true);}} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}><Plus className="w-3.5 h-3.5"/>Add Record</button></div>
      <div className="space-y-3">{recordList.map(r=>{const IconComp=typeIcon[r.type]||Heart;return <div key={r.id} className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-center gap-3"><div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-muted/40"><IconComp className="w-4 h-4 text-[#C8A84B]"/></div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap mb-0.5"><p className="text-xs font-semibold">{r.employeeName}</p><span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${typeColor[r.type]}`}>{r.type}</span></div><p className="text-xs text-foreground/80">{r.description}</p><p className="text-xs text-muted-foreground">{r.provider} · {fd(r.date)}</p></div><select aria-label={`Health record status for ${r.employeeName}`} value={r.status} onChange={e=>onUpdateRecord({...r,status:e.target.value as WellnessRecord["status"]})} className={`border border-border rounded-lg px-2 py-1.5 text-xs bg-card ${statusColor[r.status]}`}><option>Scheduled</option><option>Completed</option><option>Cancelled</option></select></div>;})}
      {!recordList.length&&<div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">No records in this category yet.</div>}</div>
    </div>}

    {tab==="risks"&&<div className="space-y-4">
      <div className="bg-card rounded-xl border border-border p-4"><h3 className="text-sm font-semibold mb-1">Health Risk Assessments</h3><p className="text-xs text-muted-foreground mb-3">Capture risk level, factors, recommendations, and follow-up date. Avoid recording diagnoses.</p><div className="grid md:grid-cols-2 gap-3"><select aria-label="Risk assessment employee" value={riskForm.employeeId} onChange={e=>setRiskForm(f=>({...f,employeeId:e.target.value}))} className={inputClass}><option value="">Select employee</option>{employees.map(e=><option key={e.id} value={e.id}>{e.fullName}</option>)}</select><label className="text-xs">Assessment date<input type="date" value={riskForm.assessmentDate} onChange={e=>setRiskForm(f=>({...f,assessmentDate:e.target.value}))} className={`${inputClass} mt-1`}/></label><label className="text-xs">Risk level<select value={riskForm.riskLevel} onChange={e=>setRiskForm(f=>({...f,riskLevel:e.target.value as HealthRiskAssessment["riskLevel"]}))} className={`${inputClass} mt-1`}><option>Low</option><option>Moderate</option><option>High</option></select></label><label className="text-xs">Follow-up date<input type="date" value={riskForm.followUpDate} onChange={e=>setRiskForm(f=>({...f,followUpDate:e.target.value}))} className={`${inputClass} mt-1`}/></label><textarea aria-label="Risk factors" value={riskForm.riskFactors} onChange={e=>setRiskForm(f=>({...f,riskFactors:e.target.value}))} placeholder="Risk factors / observations (administrative summary)" className={inputClass}/><textarea aria-label="Risk recommendations" value={riskForm.recommendations} onChange={e=>setRiskForm(f=>({...f,recommendations:e.target.value}))} placeholder="Recommended actions / referrals" className={inputClass}/><button disabled={!riskForm.employeeId||!riskForm.assessmentDate||!riskForm.riskFactors.trim()} onClick={()=>{const emp=employees.find(e=>e.id===riskForm.employeeId);if(!emp)return;onAddRiskAssessment({...riskForm,employeeName:emp.fullName,riskFactors:riskForm.riskFactors.trim(),recommendations:riskForm.recommendations.trim()});setRiskForm({employeeId:"",assessmentDate:"",riskLevel:"Low",riskFactors:"",recommendations:"",followUpDate:""});setNotice("Health risk assessment saved.");}} className="rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Save Assessment</button></div></div>
      <div className="space-y-2">{riskAssessments.map(a=><div key={a.id} className="bg-card rounded-xl border border-border p-4"><div className="flex flex-wrap justify-between gap-2"><div><h4 className="text-sm font-semibold">{a.employeeName}</h4><p className="text-xs text-muted-foreground">Assessed {fd(a.assessmentDate)}{a.followUpDate?` · Follow-up ${fd(a.followUpDate)}`:""}</p><p className="text-xs mt-2">Factors: {a.riskFactors}</p>{a.recommendations&&<p className="text-xs text-muted-foreground mt-1">Actions: {a.recommendations}</p>}</div><span className={`h-fit rounded-full px-2 py-1 text-xs font-medium ${a.riskLevel==="High"?"bg-red-500/15 text-red-500":a.riskLevel==="Moderate"?"bg-amber-500/15 text-amber-600":"bg-emerald-500/15 text-emerald-500"}`}>{a.riskLevel} risk</span></div></div>)}
      {!riskAssessments.length&&<p className="text-xs text-muted-foreground">No risk assessments recorded.</p>}</div>
    </div>}

    {tab==="programs"&&<div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="text-sm font-semibold">Wellness Programs Management ({programs.length})</h3><p className="text-xs text-muted-foreground mt-1">Create programs and track their lifecycle.</p></div>      <button onClick={()=>{setProgramForm({name:"",category:"Wellness",description:"",targetAudience:"All employees",startDate:"",endDate:""});setShowProgramForm(true);}} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}><Plus className="w-3.5 h-3.5"/>New Program</button></div>
      {showProgramForm&&<div className="bg-card rounded-xl border border-border p-4"><h4 className="text-sm font-semibold mb-3">Create Wellness Program</h4><div className="grid md:grid-cols-2 gap-3"><input aria-label="Program name" value={programForm.name} onChange={e=>setProgramForm(f=>({...f,name:e.target.value}))} placeholder="Program name" className={inputClass}/><input aria-label="Program category" value={programForm.category} onChange={e=>setProgramForm(f=>({...f,category:e.target.value}))} placeholder="Category" className={inputClass}/><input aria-label="Target audience" value={programForm.targetAudience} onChange={e=>setProgramForm(f=>({...f,targetAudience:e.target.value}))} placeholder="Target audience" className={inputClass}/><label className="text-xs">Start date<input type="date" value={programForm.startDate} onChange={e=>setProgramForm(f=>({...f,startDate:e.target.value}))} className={`${inputClass} mt-1`}/></label><label className="text-xs">End date<input type="date" value={programForm.endDate} onChange={e=>setProgramForm(f=>({...f,endDate:e.target.value}))} className={`${inputClass} mt-1`}/></label><textarea aria-label="Program description" value={programForm.description} onChange={e=>setProgramForm(f=>({...f,description:e.target.value}))} placeholder="Program description" className={inputClass}/><button disabled={!programForm.name.trim()||!programForm.startDate||!programForm.endDate} onClick={()=>{onAddProgram({...programForm,name:programForm.name.trim(),description:programForm.description.trim(),status:"Planned"});setProgramForm({name:"",category:"Wellness",description:"",targetAudience:"All employees",startDate:"",endDate:""});setShowProgramForm(false);setNotice("Wellness program created.");}} className="rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Save Program</button><button onClick={()=>setShowProgramForm(false)} className="rounded-lg border border-border px-3 py-2 text-xs">Cancel</button></div></div>}
      {programs.map(p=><div key={p.id} className="bg-card rounded-xl border border-border p-4 shadow-sm"><div className="flex flex-wrap justify-between gap-3"><div className="flex-1"><div className="flex items-center gap-2 mb-1"><Heart className="w-4 h-4 text-rose-500"/><h4 className="text-sm font-semibold">{p.name}</h4><span className="text-[11px] rounded-full bg-muted px-2 py-0.5">{p.category}</span></div><p className="text-xs text-muted-foreground">{p.description}</p><p className="text-xs text-muted-foreground mt-1">Target: {p.targetAudience} · {fd(p.startDate)} – {fd(p.endDate)}</p></div><select aria-label={`Program status for ${p.name}`} value={p.status} onChange={e=>onUpdateProgram({...p,status:e.target.value as WellnessProgram["status"]})} className="h-fit border border-border rounded-lg px-2 py-1.5 text-xs bg-card">{["Planned","Active","Completed","Cancelled"].map(status=><option key={status}>{status}</option>)}</select></div></div>)}
    </div>}

    {tab==="counseling"&&<div className="space-y-4">
      <div className="bg-card rounded-xl border border-border p-4"><h3 className="text-sm font-semibold mb-1">Counseling Program Management</h3><p className="text-xs text-muted-foreground mb-3">Schedule and track counseling appointments and follow-ups. Keep notes brief and avoid sensitive clinical details.</p><div className="grid md:grid-cols-2 gap-3"><select aria-label="Counseling employee" value={counselingForm.employeeId} onChange={e=>setCounselingForm(f=>({...f,employeeId:e.target.value}))} className={inputClass}><option value="">Select employee</option>{employees.map(e=><option key={e.id} value={e.id}>{e.fullName}</option>)}</select><input aria-label="Counselor" value={counselingForm.counselor} onChange={e=>setCounselingForm(f=>({...f,counselor:e.target.value}))} placeholder="Counselor / provider" className={inputClass}/><label className="text-xs">Session date<input type="date" value={counselingForm.sessionDate} onChange={e=>setCounselingForm(f=>({...f,sessionDate:e.target.value}))} className={`${inputClass} mt-1`}/></label><label className="text-xs">Follow-up date<input type="date" value={counselingForm.followUpDate} onChange={e=>setCounselingForm(f=>({...f,followUpDate:e.target.value}))} className={`${inputClass} mt-1`}/></label><input aria-label="Referral source" value={counselingForm.referralSource} onChange={e=>setCounselingForm(f=>({...f,referralSource:e.target.value}))} placeholder="Referral source (optional)" className={inputClass}/><textarea aria-label="Counseling administrative notes" value={counselingForm.notes} onChange={e=>setCounselingForm(f=>({...f,notes:e.target.value}))} placeholder="Administrative follow-up notes (optional)" className={inputClass}/><button disabled={!counselingForm.employeeId||!counselingForm.counselor.trim()||!counselingForm.sessionDate} onClick={()=>{const emp=employees.find(e=>e.id===counselingForm.employeeId);if(!emp)return;onAddCounseling({...counselingForm,employeeName:emp.fullName,counselor:counselingForm.counselor.trim(),status:"Scheduled"});setCounselingForm({employeeId:"",sessionDate:"",counselor:"",referralSource:"",notes:"",followUpDate:""});setNotice("Counseling session scheduled.");}} className="rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Schedule Session</button></div></div>
      {counselingRecords.map(c=><div key={c.id} className="bg-card rounded-xl border border-border p-4"><div className="flex flex-wrap justify-between gap-2"><div><h4 className="text-sm font-semibold">{c.employeeName} · {c.counselor}</h4><p className="text-xs text-muted-foreground">{fd(c.sessionDate)} · Follow-up {c.followUpDate?fd(c.followUpDate):"not scheduled"}{c.referralSource?` · Referred by ${c.referralSource}`:""}</p>{c.notes&&<p className="text-xs mt-2">{c.notes}</p>}</div><select aria-label={`Counseling status for ${c.employeeName}`} value={c.status} onChange={e=>onUpdateCounseling({...c,status:e.target.value as CounselingRecord["status"]})} className="h-fit border border-border rounded-lg px-2 py-1.5 text-xs bg-card">{["Scheduled","Completed","Cancelled"].map(status=><option key={status}>{status}</option>)}</select></div></div>)}
      {!counselingRecords.length&&<p className="text-xs text-muted-foreground">No counseling sessions scheduled.</p>}
    </div>}

    {tab==="reports"&&<div className="space-y-4">
      <div className="bg-card rounded-xl border border-border p-4 flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">Health and Wellness Reports</h3><p className="text-xs text-muted-foreground mt-1">Export aggregate service, assessment, program, and counseling totals. Personal notes are excluded.</p></div><button onClick={exportReport} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs"><FileText className="w-3.5 h-3.5"/>Export Report</button></div>
      <div className="grid md:grid-cols-2 gap-4">{[
        {title:"Medical & Dental",values:[["Medical services",records.filter(r=>r.type==="Medical").length],["Dental services",records.filter(r=>r.type==="Dental").length],["Scheduled",records.filter(r=>(r.type==="Medical"||r.type==="Dental")&&r.status==="Scheduled").length],["Completed",records.filter(r=>(r.type==="Medical"||r.type==="Dental")&&r.status==="Completed").length]]},
        {title:"Mental Health & Risk",values:[["Mental health records",records.filter(r=>r.type==="Mental Health").length],["Risk assessments",riskAssessments.length],["High risk",riskAssessments.filter(a=>a.riskLevel==="High").length],["Follow-ups scheduled",riskAssessments.filter(a=>Boolean(a.followUpDate)).length]]},
        {title:"Wellness Programs",values:[["Total programs",programs.length],["Active",programs.filter(p=>p.status==="Active").length],["Planned",programs.filter(p=>p.status==="Planned").length],["Completed",programs.filter(p=>p.status==="Completed").length]]},
        {title:"Counseling",values:[["Total sessions",counselingRecords.length],["Scheduled",counselingRecords.filter(c=>c.status==="Scheduled").length],["Completed",counselingRecords.filter(c=>c.status==="Completed").length],["Follow-ups scheduled",counselingRecords.filter(c=>Boolean(c.followUpDate)).length]]},
      ].map(section=><div key={section.title} className="bg-card rounded-xl border border-border p-4"><h4 className="text-sm font-semibold mb-2">{section.title}</h4>{section.values.map(([label,value])=><div key={label} className="flex justify-between border-b border-border/50 py-2 last:border-0 text-xs"><span className="text-muted-foreground">{label}</span><strong>{value}</strong></div>)}</div>)}</div>
    </div>}

    <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add Medical / Dental / Mental Health Record">
      <div className="space-y-3"><label className="block text-xs font-medium">Employee<select value={recordForm.employeeId} onChange={e=>setRecordForm(f=>({...f,employeeId:e.target.value}))} className={`${inputClass} mt-1`}><option value="">Select employee</option>{employees.map(e=><option key={e.id} value={e.id}>{e.fullName}</option>)}</select></label>
      <div className="grid grid-cols-2 gap-3"><label className="text-xs">Service type<select value={recordForm.type} onChange={e=>setRecordForm(f=>({...f,type:e.target.value as WellnessRecord["type"]}))} className={`${inputClass} mt-1`}>{["Medical","Dental","Mental Health","Wellness Program"].map(type=><option key={type}>{type}</option>)}</select></label><label className="text-xs">Service date<input type="date" value={recordForm.date} onChange={e=>setRecordForm(f=>({...f,date:e.target.value}))} className={`${inputClass} mt-1`}/></label></div>
      <label className="block text-xs">Service details<textarea value={recordForm.description} onChange={e=>setRecordForm(f=>({...f,description:e.target.value}))} placeholder="Brief administrative service details" className={`${inputClass} mt-1`}/></label>
      <label className="block text-xs">Provider / Clinic<input value={recordForm.provider} onChange={e=>setRecordForm(f=>({...f,provider:e.target.value}))} className={`${inputClass} mt-1`}/></label>
      <button onClick={addRecord} className="w-full py-2.5 rounded-xl text-sm font-semibold" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Save Record</button></div>
    </Modal>
    {notice&&<div role="status" className="fixed bottom-4 right-4 z-50 max-w-md rounded-xl border border-border bg-card p-4 text-xs shadow-xl">{notice}<button onClick={()=>setNotice("")} className="ml-3 font-semibold text-[#92751E]">Dismiss</button></div>}
  </div>;
}

export function FacultyPage({ profiles, employees }: { profiles: FacultyProfile[]; employees: Employee[] }) {
  const [tab, setTab] = useState<"directory"|"evaluation"|"workload">("directory");
  const [search, setSearch] = useState("");
  const rankColor: Record<string,string> = {
    "Instructor":"bg-gray-100 text-gray-600",
    "Assistant Professor":"bg-blue-100 text-blue-700",
    "Associate Professor":"bg-purple-100 text-purple-700",
    "Professor":"bg-[#3B82F6]/10 text-[#C8A84B]",
    "University Professor":"bg-amber-100 text-amber-700",
  };
  const facultyEmployees = employees.filter(e=>profiles.some(p=>p.employeeId===e.id));
  const filtered = facultyEmployees.filter(e=>{
    const q = search.toLowerCase();
    return e.fullName.toLowerCase().includes(q)||e.department.toLowerCase().includes(q)||
      (profiles.find(p=>p.employeeId===e.id)?.specialization||"").toLowerCase().includes(q);
  });
  const totalPublications = profiles.reduce((s,p)=>s+p.publications,0);
  const totalResearch = profiles.reduce((s,p)=>s+p.researchCount,0);
  const avgEval = profiles.length?(profiles.reduce((s,p)=>s+p.evaluation,0)/profiles.length).toFixed(2):0;

  return (
    <div>
      <SectionHeader title="Faculty Management" subtitle="Faculty profiles, academic evaluation, teaching load, and research tracking"/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label:"Total Faculty", value:profiles.length, icon:GraduationCap, color:"#3B82F6" },
          { label:"Total Publications", value:totalPublications, icon:BookMarked, color:"#2563EB" },
          { label:"Research Projects", value:totalResearch, icon:Microscope, color:"#7C3AED" },
          { label:"Avg. Evaluation", value:avgEval, icon:Star, color:"#C8A84B" },
        ].map(s=>(
          <div key={s.label} className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:`${s.color}15`}}>
              <s.icon className="w-5 h-5" style={{color:s.color}}/>
            </div>
            <div><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-muted/40 p-1 rounded-xl mb-5 w-fit">
        {(["directory","evaluation","workload"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab===t?"bg-muted/60 text-[#C8A84B] shadow-sm":"text-muted-foreground hover:text-foreground"}`}>
            {t==="directory"?"Faculty Directory":t==="evaluation"?"Evaluation":"Teaching Load"}
          </button>
        ))}
      </div>

      {tab==="directory"&&(
        <div>
          <div className="mb-4 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search faculty..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-xl focus:outline-none bg-white"/>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filtered.map(emp=>{
              const prof = profiles.find(p=>p.employeeId===emp.id)!;
              if(!prof) return null;
              return (
                <div key={emp.id} className="bg-card rounded-xl border border-border p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Av name={emp.fullName} color={emp.color} size="lg"/>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="text-xs font-bold">{emp.fullName}</p>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${rankColor[prof.rank]}`}>{prof.rank}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{prof.specialization}</p>
                      <p className="text-[11px] text-muted-foreground">{prof.highestDegree} · {prof.university}</p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {[
                          { label:"Load", value:`${prof.teachingLoad} units`, icon:BookOpen },
                          { label:"Research", value:prof.researchCount, icon:Microscope },
                          { label:"Publications", value:prof.publications, icon:FileText },
                          { label:"Awards", value:prof.awards, icon:Trophy },
                        ].map(s=>(
                          <div key={s.label} className="flex items-center gap-1 text-[11px]">
                            <s.icon className="w-3 h-3 text-muted-foreground"/><strong>{s.value}</strong><span className="text-muted-foreground ml-0.5">{s.label}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex">{[1,2,3,4,5].map(i=><Star key={i} className={`w-3 h-3 ${i<=Math.round(prof.evaluation)?"text-amber-400":"text-muted"}`} fill={i<=Math.round(prof.evaluation)?"currentColor":"none"}/>)}</div>
                        <span className="text-[11px] font-mono">{prof.evaluation.toFixed(1)} evaluation</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab==="evaluation"&&(
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/30">
              {["Faculty","Rank","Specialization","Research","Publications","Extension","Awards","Eval Score"].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>{profiles.map(prof=>{
              const emp = employees.find(e=>e.id===prof.employeeId);
              if(!emp) return null;
              return (
                <tr key={prof.employeeId} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">{emp.fullName.split(". ").pop()?.split(",")[0]}</td>
                  <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${rankColor[prof.rank]}`}>{prof.rank}</span></td>
                  <td className="px-4 py-3 text-xs max-w-[150px] truncate">{prof.specialization}</td>
                  <td className="px-4 py-3 text-xs font-mono text-center">{prof.researchCount}</td>
                  <td className="px-4 py-3 text-xs font-mono text-center">{prof.publications}</td>
                  <td className="px-4 py-3 text-xs font-mono text-center">{prof.extensionCount}</td>
                  <td className="px-4 py-3 text-xs font-mono text-center">{prof.awards}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold" style={{color:prof.evaluation>=4.5?"#C8A84B":prof.evaluation>=4?"#059669":"#DC2626"}}>{prof.evaluation.toFixed(1)}</span>
                      <div className="flex">{[1,2,3,4,5].map(i=><Star key={i} className={`w-2.5 h-2.5 ${i<=Math.round(prof.evaluation)?"text-amber-400":"text-muted"}`} fill={i<=Math.round(prof.evaluation)?"currentColor":"none"}/>)}</div>
                    </div>
                  </td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}

      {tab==="workload"&&(
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {[
              { label:"Avg Teaching Load", value:`${(profiles.reduce((s,p)=>s+p.teachingLoad,0)/profiles.length).toFixed(1)} units` },
              { label:"Overloaded Faculty", value:profiles.filter(p=>p.teachingLoad>18).length },
              { label:"Research Active", value:profiles.filter(p=>p.researchCount>0).length },
            ].map(s=>(
              <div key={s.label} className="bg-card rounded-xl border border-border p-4 shadow-sm text-center">
                <p className="text-2xl font-bold" style={{color:"#C8A84B"}}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                {["Faculty","Rank","Teaching Load","Research","Extension","Admin Work","Total Load"].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody>{profiles.map(prof=>{
                const emp = employees.find(e=>e.id===prof.employeeId);
                if(!emp) return null;
                const admin = prof.rank==="University Professor"||prof.rank==="Professor"?3:0;
                const total = prof.teachingLoad + (prof.researchCount*3) + prof.extensionCount + admin;
                return (
                  <tr key={prof.employeeId} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">{emp.fullName.split(". ").pop()?.split(",")[0]}</td>
                    <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${rankColor[prof.rank]}`}>{prof.rank.replace("University ","U.")}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs font-mono font-bold ${prof.teachingLoad>18?"text-red-600":"text-foreground"}`}>{prof.teachingLoad} units</span></td>
                    <td className="px-4 py-3 text-xs font-mono">{prof.researchCount} proj.</td>
                    <td className="px-4 py-3 text-xs font-mono">{prof.extensionCount} prog.</td>
                    <td className="px-4 py-3 text-xs font-mono">{admin} units</td>
                    <td className="px-4 py-3 text-xs font-bold font-mono">{total}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
