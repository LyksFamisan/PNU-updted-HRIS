import { useState, type ReactNode } from "react";
import { Activity, AlertTriangle, Bell, Briefcase, Calendar, Clock, Download, GraduationCap, Printer, Send, User, Wallet } from "lucide-react";
import { Badge, SectionHeader } from "../shared";
import { computePayslip, fc, fd } from "../data";
import type {
  Applicant, CoachingRecord, DtrRecord, Employee, EmployeeServiceRequest, HROfficeCommunication,
  IndividualDevelopmentPlan, JobVacancy, LeaveRequest, PayrollRun,
  PerformanceRating, TrainingNomination, TrainingProgram,
} from "../types";

type ServiceRequestType = EmployeeServiceRequest["requestType"];
type Tab = "overview"|"pds"|"pay"|"attendance"|"leave"|"requests"|"vacancies"|"development"|"messages";

const TABS: Array<{id:Tab;label:string;icon:typeof User}> = [
  {id:"overview",label:"Overview",icon:Activity},{id:"pds",label:"My PDS",icon:User},
  {id:"pay",label:"Payslip & Contributions",icon:Wallet},{id:"attendance",label:"Schedule & DTR",icon:Clock},
  {id:"leave",label:"Leave & Requests",icon:Calendar},{id:"requests",label:"Applications",icon:Send},
  {id:"vacancies",label:"Job Vacancies",icon:Briefcase},{id:"development",label:"Development",icon:GraduationCap},
  {id:"messages",label:"Memos & Alerts",icon:Bell},
];
const REQUEST_TYPES: ServiceRequestType[] = [
  "Compensatory Time-off (CTO)","Request for Overtime","Request Change Shift",
  "DTR correction","Manual Submission of DTR","Magna Carta Application",
  "Provident Fund Application","Psychological Assessment","Self-Assessment",
  "Employee Inquiry","Customer Feedback",
];
const PRINT_STYLE="@media print { body * { visibility:hidden !important } .employee-print, .employee-print * { visibility:visible !important } .employee-print { padding:24px; background:white; color:black } .no-print { display:none !important } }";

export function EmployeeSelfServicePage({ employee, employees, payrolls, leaves, dtr, vacancies, applicants, trainings, nominations, ratings, plans, coachingRecords, communications, serviceRequests, pdsView, initialPage, onAddLeave, onAddRequest, onApplyVacancy, onNominateTraining, onAddRating, onAddPlan, onAddCoaching }: {
  employee:Employee; employees:Employee[]; payrolls:PayrollRun[]; leaves:LeaveRequest[]; dtr:DtrRecord[];
  vacancies:JobVacancy[]; applicants:Applicant[]; trainings:TrainingProgram[]; nominations:TrainingNomination[];
  ratings:PerformanceRating[]; plans:IndividualDevelopmentPlan[]; coachingRecords:CoachingRecord[];
  communications:HROfficeCommunication[]; serviceRequests:EmployeeServiceRequest[];
  pdsView:ReactNode; initialPage:string;
  onAddLeave:(leave:Omit<LeaveRequest,"id">)=>void;
  onAddRequest:(request:Omit<EmployeeServiceRequest,"id">)=>void;
  onApplyVacancy:(vacancy:JobVacancy)=>Applicant;
  onNominateTraining:(program:TrainingProgram,justification:string)=>void;
  onAddRating:(rating:Omit<PerformanceRating,"id">)=>void;
  onAddPlan:(plan:Omit<IndividualDevelopmentPlan,"id">)=>void;
  onAddCoaching:(record:Omit<CoachingRecord,"id">)=>void;
}) {
  const [tab,setTab]=useState<Tab>(()=>({
    profile:"pds", payslip:"pay", leave:"leave", attendance:"attendance", performance:"development",
    training:"development", recruitment:"vacancies", notifications:"messages", wellness:"requests",
  }[initialPage] as Tab)||"overview");
  const [leaveForm,setLeaveForm]=useState({leaveType:"Vacation Leave",startDate:"",endDate:"",reason:""});
  const [requestForm,setRequestForm]=useState({requestType:REQUEST_TYPES[0],details:"",typedSignature:employee.fullName});
  const [vacancyMessage,setVacancyMessage]=useState("");
  const [trainingProgramId,setTrainingProgramId]=useState("");
  const [trainingJustification,setTrainingJustification]=useState("");
  const [ipcrPeriod,setIpcrPeriod]=useState("2026");
  const [planForm,setPlanForm]=useState({period:"2026",developmentGoals:"",competencyGaps:"",plannedActivities:"",targetDate:""});
  const [coachingForm,setCoachingForm]=useState({coach:"",coachingDate:"",discussion:"",actionItems:"",followUpDate:""});
  const [notice,setNotice]=useState("");
  const ownLeaves=leaves.filter(l=>l.employeeId===employee.id).sort((a,b)=>b.appliedDate.localeCompare(a.appliedDate));
  const ownRequests=serviceRequests.filter(r=>r.employeeId===employee.id).sort((a,b)=>b.submittedAt.localeCompare(a.submittedAt));
  const ownDtr=dtr.filter(r=>r.employeeId===employee.id).sort((a,b)=>b.date.localeCompare(a.date));
  const ownNominations=nominations.filter(n=>n.employeeId===employee.id);
  const ownRatings=ratings.filter(r=>r.employeeId===employee.id);
  const ownPlans=plans.filter(p=>p.employeeId===employee.id);
  const ownCoaching=coachingRecords.filter(c=>c.employeeId===employee.id);
  const ownApplications=applicants.filter(a=>a.type==="Internal"&&a.email.toLowerCase()===employee.email.toLowerCase());
  const publishedVacancies=vacancies.filter(v=>v.status==="Open"&&v.publicationStatus==="Published");
  const availableTrainings=trainings.filter(p=>p.status==="Upcoming"||p.status==="Ongoing");
  const payslip=computePayslip(employee.monthlySalary);
  const overtimeMinutes=ownDtr.reduce((sum,r)=>sum+r.overtime,0);
  const alerts=[
    ...ownLeaves.map(l=>({id:l.id,title:"Leave Status",message:`${l.leaveType} (${fd(l.startDate)}–${fd(l.endDate)}) is ${l.status.toLowerCase()}${l.remarks?`: ${l.remarks}`:""}.`})),
    ...ownRequests.map(r=>({id:r.id,title:`${r.requestType} Status`,message:`Your request is ${r.status.toLowerCase()}${r.remarks?`: ${r.remarks}`:""}.`})),
    ...ownDtr.filter(r=>r.status==="Absent"||r.status==="Late"||!r.timeIn||!r.timeOut).slice(0,5).map(r=>({id:`DTR-${r.date}`,title:"DTR Issue",message:`${fd(r.date)}: ${r.status}${!r.timeIn||!r.timeOut?" · missing time entry":""}`})),
    ...communications.filter(c=>c.status==="Published").slice(0,3).map(c=>({id:c.id,title:`${c.category} received`,message:c.title})),
  ];
  const tabCounts:Partial<Record<Tab,number>>={leave:ownLeaves.filter(l=>l.status==="Pending").length,requests:ownRequests.filter(r=>r.status==="Pending").length,messages:alerts.length};
  const input="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm";
  const print=()=>window.print();
  const exportCsv=(filename:string,rows:(string|number)[][])=>{
    const csv=rows.map(row=>row.map(cell=>`"${String(cell??"").replaceAll('"','""')}"`).join(",")).join("\r\n");
    const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
    const a=document.createElement("a");a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const submitLeave=()=>{
    if(!leaveForm.startDate||!leaveForm.endDate||!leaveForm.reason.trim()){setNotice("Complete leave dates and reason.");return;}
    const start=new Date(`${leaveForm.startDate}T00:00:00`),end=new Date(`${leaveForm.endDate}T00:00:00`);
    if(end<start){setNotice("Leave end date cannot be before its start date.");return;}
    const days=Math.floor((end.getTime()-start.getTime())/86400000)+1;
    onAddLeave({employeeId:employee.id,employeeName:employee.fullName,department:employee.department,leaveType:leaveForm.leaveType,startDate:leaveForm.startDate,endDate:leaveForm.endDate,days,reason:leaveForm.reason.trim(),status:"Pending",appliedDate:new Date().toISOString().slice(0,10)});
    setLeaveForm({leaveType:"Vacation Leave",startDate:"",endDate:"",reason:""});setNotice("Leave application submitted.");
  };
  const submitRequest=()=>{
    if(!requestForm.details.trim()||!requestForm.typedSignature.trim()){setNotice("Add request details and your typed acknowledgement.");return;}
    onAddRequest({employeeId:employee.id,employeeName:employee.fullName,requestType:requestForm.requestType,details:requestForm.details.trim(),typedSignature:requestForm.typedSignature.trim(),submittedAt:new Date().toISOString(),status:"Pending"});
    setRequestForm({...requestForm,details:""});setNotice(`${requestForm.requestType} submitted for review.`);
  };
  const applyVacancy=(vacancy:JobVacancy)=>{
    const existing=ownApplications.find(a=>a.vacancyId===vacancy.id&&a.status!=="Failed");
    if(existing){setVacancyMessage(`You already applied. Tracking number: ${existing.trackingNo||"pending"}`);return;}
    const applicant=onApplyVacancy(vacancy);
    setVacancyMessage(`Application submitted. Tracking number: ${applicant.trackingNo||"assigned"}. Current status: ${applicant.status}.`);
  };
  const applyTraining=()=>{
    const program=availableTrainings.find(p=>p.id===trainingProgramId);
    if(!program||!trainingJustification.trim()){setNotice("Choose a training and add a short justification.");return;}
    if(program.nominated>=program.slots){setNotice("This training program has reached its nomination capacity.");return;}
    if(ownNominations.some(n=>n.programId===program.id&&n.status!=="Declined")){setNotice("You already have an active nomination for this training.");return;}
    onNominateTraining(program,trainingJustification.trim());setTrainingProgramId("");setTrainingJustification("");setNotice("Training application submitted for nomination approval.");
  };
  const applyIpcr=()=>{
    if(ownRatings.some(r=>r.period===ipcrPeriod)){setNotice(`An IPCR record for ${ipcrPeriod} already exists.`);return;}
    onAddRating({employeeId:employee.id,employeeName:employee.fullName,department:employee.department,period:ipcrPeriod,type:"IPCR",outputScore:0,efficiencyScore:0,timelinessScore:0,finalRating:0,adjectivalRating:"Not Rated",status:"Draft",submittedDate:""});
    setNotice("IPCR application created as a draft for completion by you and your supervisor.");
  };
  const applyPlan=()=>{
    if(!planForm.developmentGoals.trim()||!planForm.targetDate){setNotice("Enter development goals and a target date.");return;}
    onAddPlan({...planForm,employeeId:employee.id,employeeName:employee.fullName,status:"Draft"});
    setPlanForm({period:"2026",developmentGoals:"",competencyGaps:"",plannedActivities:"",targetDate:""});setNotice("Individual development plan submitted as a draft.");
  };
  const applyCoaching=()=>{
    if(!coachingForm.coach.trim()||!coachingForm.coachingDate||!coachingForm.discussion.trim()){setNotice("Enter a coach, session date, and coaching topic.");return;}
    onAddCoaching({...coachingForm,employeeId:employee.id,employeeName:employee.fullName,status:"Scheduled"});
    setCoachingForm({coach:"",coachingDate:"",discussion:"",actionItems:"",followUpDate:""});setNotice("Coaching session request recorded.");
  };
  const printButton=<button onClick={print} className="no-print inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs"><Printer className="h-3.5 w-3.5"/>Print</button>;
  const requestPanel=<div className="space-y-4">
    <div className="rounded-xl border border-border bg-card p-4"><h3 className="mb-1 text-sm font-semibold">File a Request / Application</h3><p className="mb-3 text-xs text-muted-foreground">Typed acknowledgement is not a verified digital signature.</p><div className="grid gap-3 md:grid-cols-2"><label className="text-xs">Request type<select value={requestForm.requestType} onChange={e=>setRequestForm(f=>({...f,requestType:e.target.value}))} className={`${input} mt-1`}>{REQUEST_TYPES.map(type=><option key={type}>{type}</option>)}</select></label><label className="text-xs">Typed acknowledgement<input value={requestForm.typedSignature} onChange={e=>setRequestForm(f=>({...f,typedSignature:e.target.value}))} className={`${input} mt-1`}/></label><textarea value={requestForm.details} onChange={e=>setRequestForm(f=>({...f,details:e.target.value}))} placeholder="Details, dates, reason, and supporting reference" className={input}/><button onClick={submitRequest} className="rounded-lg px-3 py-2 text-xs font-semibold" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Submit Request</button></div></div>
    <div className="rounded-xl border border-border bg-card p-4"><h3 className="mb-3 text-sm font-semibold">My Request Status</h3><div className="space-y-2">{ownRequests.map(r=><div key={r.id} className="rounded-lg border border-border p-3"><div className="flex flex-wrap justify-between gap-2"><div><p className="text-xs font-semibold">{r.requestType}</p><p className="mt-1 text-xs text-muted-foreground">{r.details}</p><p className="mt-1 text-[11px] text-muted-foreground">{new Date(r.submittedAt).toLocaleString()}{r.remarks?` · ${r.remarks}`:""}</p></div><Badge variant={r.status}>{r.status}</Badge></div></div>)}{!ownRequests.length&&<p className="text-xs text-muted-foreground">No requests submitted.</p>}</div></div>
  </div>;
  const leavePanel=<div className="space-y-4">
    <div className="rounded-xl border border-border bg-card p-4"><h3 className="mb-3 text-sm font-semibold">Monitor Leave and File Leave Application</h3><div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4"><div className="rounded-lg bg-muted/40 p-3"><p className="text-xs text-muted-foreground">Vacation balance</p><p className="text-lg font-bold">{employee.vacationLeave} days</p></div><div className="rounded-lg bg-muted/40 p-3"><p className="text-xs text-muted-foreground">Sick balance</p><p className="text-lg font-bold">{employee.sickLeave} days</p></div><div className="rounded-lg bg-muted/40 p-3"><p className="text-xs text-muted-foreground">Pending requests</p><p className="text-lg font-bold">{ownLeaves.filter(l=>l.status==="Pending").length}</p></div><div className="rounded-lg bg-muted/40 p-3"><p className="text-xs text-muted-foreground">Approved requests</p><p className="text-lg font-bold">{ownLeaves.filter(l=>l.status==="Approved").length}</p></div></div><div className="grid gap-3 md:grid-cols-2"><label className="text-xs">Leave type<select value={leaveForm.leaveType} onChange={e=>setLeaveForm(f=>({...f,leaveType:e.target.value}))} className={`${input} mt-1`}>{["Vacation Leave","Sick Leave","Special Leave","Maternity Leave","Paternity Leave","Study Leave","Other"].map(type=><option key={type}>{type}</option>)}</select></label><label className="text-xs">Reason<input value={leaveForm.reason} onChange={e=>setLeaveForm(f=>({...f,reason:e.target.value}))} className={`${input} mt-1`}/></label><label className="text-xs">Start date<input type="date" value={leaveForm.startDate} onChange={e=>setLeaveForm(f=>({...f,startDate:e.target.value}))} className={`${input} mt-1`}/></label><label className="text-xs">End date<input type="date" value={leaveForm.endDate} onChange={e=>setLeaveForm(f=>({...f,endDate:e.target.value}))} className={`${input} mt-1`}/></label><button onClick={submitLeave} className="rounded-lg px-3 py-2 text-xs font-semibold" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Submit Leave Application</button></div></div>
    <div className="rounded-xl border border-border bg-card p-4"><h3 className="mb-3 text-sm font-semibold">My Leave Applications</h3><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="border-b border-border text-left"><th className="p-2">Type</th><th className="p-2">Period</th><th className="p-2">Days</th><th className="p-2">Status</th><th className="p-2">Remarks</th></tr></thead><tbody>{ownLeaves.map(l=><tr key={l.id} className="border-b border-border/50"><td className="p-2">{l.leaveType}</td><td className="p-2">{fd(l.startDate)} – {fd(l.endDate)}</td><td className="p-2">{l.days}</td><td className="p-2"><Badge variant={l.status}>{l.status}</Badge></td><td className="p-2">{l.remarks||"—"}</td></tr>)}</tbody></table>{!ownLeaves.length&&<p className="p-3 text-xs text-muted-foreground">No leave applications yet.</p>}</div></div>
  </div>;

  const payrollPanel=<div className="space-y-4"><div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold">My Payslip and Government Contributions</h3><p className="mt-1 text-xs text-muted-foreground">Employee-level pay history is not connected; amounts below are estimates based on your current salary.</p></div>{printButton}</div><div className="employee-print rounded-xl border border-border bg-card p-5"><h2 className="text-lg font-bold">Philippine Normal University · Employee Payslip Estimate</h2><p className="text-xs text-muted-foreground">{employee.fullName} · {employee.employeeNo} · {employee.position}</p><div className="mt-4 grid gap-2 sm:grid-cols-2">{[["Monthly gross salary",payslip.grossPay],["GSIS contribution",payslip.gsis],["PHIC / PhilHealth contribution",payslip.philhealth],["Pag-IBIG contribution",payslip.pagibig],["Withholding tax",payslip.tax],["Total deductions",payslip.totalDeductions],["Estimated net pay",payslip.netPay]].map(([label,value])=><div key={label} className="flex justify-between border-b border-border/50 py-2 text-xs"><span>{label}</span><strong>{fc(Number(value))}</strong></div>)}</div></div><div className="rounded-xl border border-border bg-card p-4"><h4 className="mb-2 text-sm font-semibold">My Pay Periods</h4>{payrolls.filter(p=>p.status==="Released").map(p=><div key={p.id} className="flex flex-wrap justify-between border-b border-border/50 py-2 text-xs"><span>{p.period} · Pay date {p.payDate}</span><span>Released · Estimated net {fc(payslip.netPay/2)}</span><button onClick={print} className="no-print rounded border border-border px-2 py-1"><Printer className="inline h-3 w-3"/> Print estimate</button></div>)}{!payrolls.some(p=>p.status==="Released")&&<p className="text-xs text-muted-foreground">No released payroll periods are available.</p>}</div><div className="flex flex-wrap gap-2"><button onClick={()=>exportCsv("my-contributions-estimate.csv",[["Contribution","Estimated monthly amount"],["GSIS",payslip.gsis],["PHIC / PhilHealth",payslip.philhealth],["Pag-IBIG",payslip.pagibig],["Tax",payslip.tax]])} className="no-print rounded-lg border border-border px-3 py-2 text-xs"><Download className="mr-1 inline h-3.5 w-3.5"/>Export contributions</button></div></div>;

  const attendancePanel=<div className="space-y-4"><div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold">My Schedule, Attendance, DTR, and Overtime</h3><p className="mt-1 text-xs text-muted-foreground">Only your own time records are shown. Shift template below is demo-only and not a synchronized assignment.</p></div>{printButton}</div><div className="employee-print rounded-xl border border-border bg-card p-4"><h4 className="text-sm font-semibold">Assigned Schedule (Demo)</h4><div className="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-5">{["Monday","Tuesday","Wednesday","Thursday","Friday"].map(day=><div key={day} className="rounded-lg bg-muted/40 p-3"><strong>{day}</strong><p className="mt-1">8:00 AM – 5:00 PM</p></div>)}</div><p className="mt-2 text-[11px] text-amber-700">Confirm actual hours and shift assignment with Timekeeping; the schedule feed has not been configured.</p></div><div className="grid grid-cols-2 gap-3 md:grid-cols-3"><div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">DTR records</p><p className="text-xl font-bold">{ownDtr.length}</p></div><div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">Recorded overtime</p><p className="text-xl font-bold">{(overtimeMinutes/60).toFixed(2)} hours</p></div><div className="rounded-lg border border-border bg-card p-3"><p className="text-xs text-muted-foreground">DTR issues</p><p className="text-xl font-bold">{ownDtr.filter(r=>r.status==="Absent"||r.status==="Late"||!r.timeIn||!r.timeOut).length}</p></div></div><div className="employee-print overflow-x-auto rounded-xl border border-border bg-card p-4"><div className="mb-2 flex items-center justify-between"><h4 className="text-sm font-semibold">Daily Time Record</h4><button onClick={()=>exportCsv("my-dtr.csv",[["Date","Time In","Time Out","Status","Overtime (minutes)"],...ownDtr.map(r=>[r.date,r.timeIn||"",r.timeOut||"",r.status,r.overtime])])} className="no-print rounded-lg border border-border px-3 py-2 text-xs"><Download className="mr-1 inline h-3.5 w-3.5"/>Export DTR</button></div><table className="w-full text-xs"><thead><tr className="border-b border-border text-left"><th className="p-2">Date</th><th className="p-2">Time In</th><th className="p-2">Time Out</th><th className="p-2">Status</th><th className="p-2">OT (min)</th></tr></thead><tbody>{ownDtr.map(r=><tr key={r.date} className="border-b border-border/50"><td className="p-2">{fd(r.date)}</td><td className="p-2">{r.timeIn||"Missing"}</td><td className="p-2">{r.timeOut||"Missing"}</td><td className="p-2">{r.status}</td><td className="p-2">{r.overtime}</td></tr>)}</tbody></table>{!ownDtr.length&&<p className="py-3 text-xs text-muted-foreground">No DTR records are available.</p>}</div><div className="rounded-xl border border-border bg-card p-4"><h4 className="mb-2 text-sm font-semibold">Summary of Overtime</h4><p className="text-xs">Total recorded overtime: <strong>{overtimeMinutes} minutes ({(overtimeMinutes/60).toFixed(2)} hours)</strong></p><button onClick={()=>exportCsv("my-overtime-summary.csv",[["Date","Overtime minutes"],...ownDtr.filter(r=>r.overtime>0).map(r=>[r.date,r.overtime]),["Total",overtimeMinutes]])} className="no-print mt-2 rounded-lg border border-border px-3 py-2 text-xs"><Download className="mr-1 inline h-3.5 w-3.5"/>Export overtime summary</button></div></div>;

  const developmentPanel=<div className="space-y-4"><div className="rounded-xl border border-border bg-card p-4"><h3 className="mb-3 text-sm font-semibold">My IPCR / Performance Applications</h3><div className="flex flex-wrap gap-2"><input value={ipcrPeriod} onChange={e=>setIpcrPeriod(e.target.value)} aria-label="IPCR period" className={`${input} max-w-48`}/><button onClick={applyIpcr} className="rounded-lg px-3 py-2 text-xs font-semibold" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Apply for IPCR</button></div><div className="mt-3 space-y-2">{ownRatings.map(r=><div key={r.id} className="flex justify-between rounded-lg border border-border p-3 text-xs"><span>{r.type} · {r.period}</span><Badge variant={r.status}>{r.status}</Badge></div>)}</div></div><div className="rounded-xl border border-border bg-card p-4"><h3 className="mb-3 text-sm font-semibold">Apply for Training / Seminar</h3><div className="grid gap-2 md:grid-cols-3"><select value={trainingProgramId} onChange={e=>setTrainingProgramId(e.target.value)} className={input}><option value="">Select training</option>{availableTrainings.map(p=><option key={p.id} value={p.id}>{p.title} · {p.startDate}</option>)}</select><input value={trainingJustification} onChange={e=>setTrainingJustification(e.target.value)} className={input} placeholder="Justification"/><button onClick={applyTraining} className="rounded-lg px-3 py-2 text-xs font-semibold" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Submit Training Application</button></div><div className="mt-3 space-y-2">{ownNominations.map(n=><div key={n.id} className="flex justify-between rounded-lg border border-border p-3 text-xs"><span>{trainings.find(p=>p.id===n.programId)?.title||n.programId}</span><Badge variant={n.status}>{n.status}</Badge></div>)}</div></div><div className="rounded-xl border border-border bg-card p-4"><h3 className="mb-3 text-sm font-semibold">Individual Development Plan (IDP)</h3><div className="grid gap-2 md:grid-cols-2"><input value={planForm.period} onChange={e=>setPlanForm(f=>({...f,period:e.target.value}))} className={input} aria-label="IDP period"/><input value={planForm.developmentGoals} onChange={e=>setPlanForm(f=>({...f,developmentGoals:e.target.value}))} className={input} placeholder="Development goals"/><input value={planForm.competencyGaps} onChange={e=>setPlanForm(f=>({...f,competencyGaps:e.target.value}))} className={input} placeholder="Development needs"/><input value={planForm.plannedActivities} onChange={e=>setPlanForm(f=>({...f,plannedActivities:e.target.value}))} className={input} placeholder="Planned activities"/><input type="date" value={planForm.targetDate} onChange={e=>setPlanForm(f=>({...f,targetDate:e.target.value}))} className={input} aria-label="IDP target date"/><button onClick={applyPlan} className="rounded-lg px-3 py-2 text-xs font-semibold" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Apply for IDP</button></div>{ownPlans.map(p=><p key={p.id} className="mt-2 rounded-lg border border-border p-3 text-xs">{p.period} · {p.developmentGoals} · {p.status}</p>)}</div><div className="rounded-xl border border-border bg-card p-4"><h3 className="mb-3 text-sm font-semibold">Request Coaching & Monitoring</h3><div className="grid gap-2 md:grid-cols-2"><input value={coachingForm.coach} onChange={e=>setCoachingForm(f=>({...f,coach:e.target.value}))} className={input} placeholder="Coach / supervisor"/><input type="date" value={coachingForm.coachingDate} onChange={e=>setCoachingForm(f=>({...f,coachingDate:e.target.value}))} className={input}/><input value={coachingForm.discussion} onChange={e=>setCoachingForm(f=>({...f,discussion:e.target.value}))} className={input} placeholder="Coaching topic"/><input value={coachingForm.actionItems} onChange={e=>setCoachingForm(f=>({...f,actionItems:e.target.value}))} className={input} placeholder="Goals / action items"/><input type="date" value={coachingForm.followUpDate} onChange={e=>setCoachingForm(f=>({...f,followUpDate:e.target.value}))} className={input}/><button onClick={applyCoaching} className="rounded-lg px-3 py-2 text-xs font-semibold" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Apply for Coaching</button></div>{ownCoaching.map(c=><p key={c.id} className="mt-2 rounded-lg border border-border p-3 text-xs">{fd(c.coachingDate)} · {c.discussion} · {c.status}</p>)}</div></div>;

  const renderTab=()=>{
    if(tab==="pds")return <div>{pdsView}</div>;
    if(tab==="pay")return payrollPanel;
    if(tab==="attendance")return attendancePanel;
    if(tab==="leave")return leavePanel;
    if(tab==="requests")return requestPanel;
    if(tab==="development")return developmentPanel;
    if(tab==="vacancies")return <div className="space-y-3"><div><h3 className="text-sm font-semibold">Internal Job Vacancies</h3><p className="mt-1 text-xs text-muted-foreground">Only open, published opportunities are shown. Your internal application receives a tracking number.</p></div>{publishedVacancies.map(v=><div key={v.id} className="flex flex-wrap justify-between gap-3 rounded-xl border border-border bg-card p-4"><div><h4 className="text-sm font-semibold">{v.position} · {v.classification||"Plantilla"}</h4><p className="text-xs text-muted-foreground">{v.department} · SG-{v.salaryGrade} · {v.slots} slot(s)</p><p className="mt-1 text-xs">{v.qualifications}</p><p className="mt-1 text-[11px] text-muted-foreground">Deadline: {fd(v.deadline)}</p></div><button onClick={()=>applyVacancy(v)} className="h-fit rounded-lg px-3 py-2 text-xs font-semibold" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>Apply</button></div>)}{!publishedVacancies.length&&<p className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">No open published vacancies are available.</p>}<h4 className="pt-3 text-sm font-semibold">My Internal Applications</h4>{ownApplications.map(a=><div key={a.id} className="flex justify-between rounded-lg border border-border bg-card p-3 text-xs"><span>{vacancies.find(v=>v.id===a.vacancyId)?.position||a.vacancyId} · {a.trackingNo}</span><Badge variant={a.status}>{a.status}</Badge></div>)}{vacancyMessage&&<p role="status" className="text-xs text-emerald-700">{vacancyMessage}</p>}</div>;
    if(tab==="messages")return <div className="space-y-4"><div className="rounded-xl border border-border bg-card p-4"><h3 className="mb-3 text-sm font-semibold">Memos and Announcements Received</h3>{communications.filter(c=>c.status==="Published").map(c=><article key={c.id} className="border-b border-border py-3 last:border-0"><span className="rounded bg-muted px-2 py-1 text-[10px]">{c.category}</span><h4 className="mt-2 text-sm font-semibold">{c.title}</h4><p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">{c.body}</p><p className="mt-1 text-[10px] text-muted-foreground">{fd(c.publishedAt)}</p></article>)}{!communications.some(c=>c.status==="Published")&&<p className="text-xs text-muted-foreground">No new memoranda or announcements.</p>}</div><div className="rounded-xl border border-border bg-card p-4"><h3 className="mb-3 text-sm font-semibold">Notifications & Status Alerts</h3>{alerts.map(a=><div key={a.id} className="flex gap-2 border-b border-border/50 py-2 text-xs last:border-0"><AlertTriangle className="h-4 w-4 shrink-0 text-amber-600"/><div><strong>{a.title}</strong><p className="mt-0.5 text-muted-foreground">{a.message}</p></div></div>)}{!alerts.length&&<p className="text-xs text-muted-foreground">No new alerts.</p>}</div></div>;
    return <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-5"><p className="text-xs text-muted-foreground">Welcome back</p><h2 className="mt-1 text-xl font-bold">{employee.fullName}</h2><p className="text-sm text-muted-foreground">{employee.position} · {employee.department}</p><p className="mt-1 text-xs text-muted-foreground">{employee.employeeNo} · {employee.employmentType} · SG-{employee.salaryGrade}/Step {employee.step}</p><p className="mt-2 text-[11px] text-amber-700">Payroll amounts shown here are estimates; employee-level payroll history is not connected in this demo.</p></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[{label:"Latest Net Estimate",value:fc(payslip.netPay/2),icon:Wallet},{label:"Vacation Leave",value:`${employee.vacationLeave} days`,icon:Calendar},{label:"Pending Leave",value:ownLeaves.filter(l=>l.status==="Pending").length,icon:Clock},{label:"Pending Requests",value:ownRequests.filter(r=>r.status==="Pending").length,icon:Bell}].map(s=><div key={s.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"><s.icon className="h-5 w-5 text-[#C8A84B]"/><div><p className="text-lg font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div></div>)}</div>
      <div className="rounded-xl border border-border bg-card p-4"><h3 className="mb-2 text-sm font-semibold">Important Alerts</h3>{alerts.slice(0,5).map(a=><p key={a.id} className="border-b border-border/50 py-2 text-xs last:border-0"><strong>{a.title}:</strong> {a.message}</p>)}{!alerts.length&&<p className="text-xs text-muted-foreground">No current alerts.</p>}</div>
      <div className="grid gap-3 md:grid-cols-3">{TABS.slice(1).map(item=><button key={item.id} onClick={()=>setTab(item.id)} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left hover:border-[#C8A84B]/60"><item.icon className="h-5 w-5 text-[#C8A84B]"/><span className="text-sm font-medium">{item.label}</span>{tabCounts[item.id]?<span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs">{tabCounts[item.id]}</span>:null}</button>)}</div>
    </div>;
  };
  return <div>
    <style>{PRINT_STYLE}</style>
    <SectionHeader title="Employee / Faculty Self-Service" subtitle={`${employee.fullName} · Personal records, pay, time, applications, and announcements`}/>
    <div className="no-print mb-4 flex flex-wrap gap-1 rounded-xl bg-muted/40 p-1">{TABS.map(item=><button key={item.id} onClick={()=>setTab(item.id)} className={`relative rounded-lg px-3 py-2 text-xs font-medium sm:text-sm ${tab===item.id?"bg-muted/60 text-[#C8A84B] shadow-sm":"text-muted-foreground hover:text-foreground"}`}>{item.label}{tabCounts[item.id]?<span className="ml-1 rounded-full bg-amber-500/15 px-1.5">{tabCounts[item.id]}</span>:null}</button>)}</div>
    <div>{renderTab()}</div>
    {notice&&<div role="status" className="no-print fixed bottom-4 right-4 z-50 max-w-md rounded-xl border border-border bg-card p-4 text-xs shadow-xl">{notice}<button onClick={()=>setNotice("")} className="ml-3 font-semibold text-[#92751E]">Dismiss</button></div>}
  </div>;
}
