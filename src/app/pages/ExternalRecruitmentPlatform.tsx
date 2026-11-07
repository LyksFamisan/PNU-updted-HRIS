import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bell, Briefcase, Check, ChevronDown, Clock3, FileText, GraduationCap, LogIn, LogOut, Menu, Search, ShieldCheck, Upload, UserRound, X } from "lucide-react";
import type { Applicant, JobVacancy } from "../types";
import {
  ExternalApplication, ExternalApplicantProfile, ExternalDocument, ExternalRecruitmentApi,
  mergeHripsApplication, mapToHripsApplicant, isPublishedVacancy, isApplicationOpen,
} from "../externalRecruitmentApi";

type View="jobs"|"details"|"login"|"register"|"forgot"|"dashboard"|"profile"|"apply"|"review"|"applications"|"application"|"schedule"|"notifications";
const emptyProfile=(email=""):ExternalApplicantProfile=>({firstName:"",middleName:"",lastName:"",email,phone:"",gender:"Female",address:"",birthDate:"",education:"",eligibility:"",certifications:"",experience:""});
const REQUIRED_PROFILE:Array<keyof ExternalApplicantProfile>=["firstName","lastName","email","phone","address","education","eligibility","experience"];
const STATUS=["Draft","Submitted","Under Review","For Examination","For Interview","Selected","Not Selected","Withdrawn"];
const ACCEPTED_TYPES=["application/pdf","image/jpeg","image/png"];
const EXTENSION_TYPES:Record<string,string>={pdf:"application/pdf",jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png"};
const mockAccountKey="pnu-external-mock-accounts-v1";
const navy="#10233F",gold="#C8A84B";
const formatDate=(value:string)=>value?new Intl.DateTimeFormat("en-PH",{dateStyle:"medium",timeZone:"Asia/Manila"}).format(new Date(value)): "—";
const formatSchedule=(value:string)=>value?new Intl.DateTimeFormat("en-PH",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Manila"}).format(new Date(value)): "Schedule pending";
const fieldClass="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#C8A84B] focus:ring-2 focus:ring-amber-100";

export function ExternalRecruitmentPlatform({vacancies,applicants,onApply,api}:{vacancies:JobVacancy[];applicants:Applicant[];onApply:(a:Omit<Applicant,"id"|"trackingNo">)=>Applicant;api:ExternalRecruitmentApi}) {
  const [view,setView]=useState<View>("jobs");
  const [selectedVacancyId,setSelectedVacancyId]=useState("");
  const [selectedApplicationId,setSelectedApplicationId]=useState("");
  const [activeDraftId,setActiveDraftId]=useState("");
  const [search,setSearch]=useState("");
  const [employmentFilter,setEmploymentFilter]=useState("All");
  const [userEmail,setUserEmail]=useState("");
  const [profile,setProfile]=useState<ExternalApplicantProfile>(emptyProfile());
  const [applications,setApplications]=useState<ExternalApplication[]>([]);
  const [drafts,setDrafts]=useState<ExternalApplication[]>([]);
  const [notifications,setNotifications]=useState<ReturnType<ExternalRecruitmentApi["listNotifications"]>>([]);
  const [notificationConfig,setNotificationConfig]=useState(()=>api.getNotificationConfig());
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [message,setMessage]=useState("");
  const [authForm,setAuthForm]=useState({email:"",password:"",confirm:""});
  const [selectedFiles,setSelectedFiles]=useState<ExternalDocument[]>([]);
  const [confirmation,setConfirmation]=useState(false);
  const [drawer,setDrawer]=useState(false);
  const [applicationSearch,setApplicationSearch]=useState("");

  const published=useMemo(()=>vacancies.filter(v=>isPublishedVacancy(v)),[vacancies]);
  const visibleVacancies=published.filter(v=>(employmentFilter==="All"||v.employmentType===employmentFilter)&&`${v.position} ${v.department} ${v.qualifications}`.toLowerCase().includes(search.toLowerCase()));
  const selectedVacancy=vacancies.find(v=>v.id===selectedVacancyId);
  const selectedApplication=applications.find(a=>a.id===selectedApplicationId);
  const missingProfile=REQUIRED_PROFILE.filter(key=>!profile[key].trim());
  const completion=Math.round((REQUIRED_PROFILE.length-missingProfile.length)/REQUIRED_PROFILE.length*100);

  const refreshApplicantData=(email:string)=>{
    setUserEmail(email);
    setProfile(readMockProfile(email)||emptyProfile(email));
    setApplications(api.listApplications(email).map(application=>mergeHripsApplication(application,applicants.find(a=>a.externalTrackingNo===application.trackingNo))));
    setDrafts(api.listDrafts(email));
    setNotifications(api.listNotifications(email));
  };
  useEffect(()=>{
    if(!userEmail)return;
    setApplications(current=>current.map(application=>{
      const source=applicants.find(a=>a.externalTrackingNo===application.trackingNo);
      const merged=mergeHripsApplication(application,source);
      const statusChanged=merged.status!==application.status;
      const scheduleChanged=JSON.stringify(merged.schedules)!==JSON.stringify(application.schedules);
      if(statusChanged||scheduleChanged) {
        try {
          api.addNotification({
            id:`HRIPS-${application.trackingNo}-${merged.status}-${JSON.stringify(merged.schedules)}`,
            email:userEmail,title:statusChanged?"Application status updated":"Assessment schedule updated",
            message:statusChanged?`Your application status is now ${merged.status}.`:"An assessment schedule was changed. Review your schedule for details.",
            createdAt:new Date().toISOString(),channel:"In portal",
          });
        } catch(e) { setError(e instanceof Error?e.message:"Could not save an application update notification."); }
      }
      return merged;
    }));
    try { setNotifications(api.listNotifications(userEmail)); }
    catch(e) { setError(e instanceof Error?e.message:"Could not load notifications."); }
  },[applicants,userEmail,api]);
  const readMockProfile=(email:string):ExternalApplicantProfile|null=>{
    try { return (JSON.parse(localStorage.getItem("pnu-external-mock-profiles-v1")||"{}") as Record<string,ExternalApplicantProfile>)[email]||null; }
    catch(error) { console.error("Could not read applicant profiles.",error); return null; }
  };
  const saveMockProfile=(value:ExternalApplicantProfile)=>{
    const profiles=JSON.parse(localStorage.getItem("pnu-external-mock-profiles-v1")||"{}") as Record<string,ExternalApplicantProfile>;
    profiles[value.email]=value;localStorage.setItem("pnu-external-mock-profiles-v1",JSON.stringify(profiles));
  };
  const hashPassword=async(password:string)=>{
    if(!window.crypto?.subtle)throw new Error("Secure browser hashing is unavailable in this browser context.");
    const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(password));
    return Array.from(new Uint8Array(bytes)).map(b=>b.toString(16).padStart(2,"0")).join("");
  };
  const accounts=()=>{
    try{return JSON.parse(localStorage.getItem(mockAccountKey)||"{}") as Record<string,{passwordHash:string;verified:boolean}>;}
    catch(error){console.error("Could not read simulated applicant accounts.",error);throw new Error("The simulated account store is unreadable.");}
  };
  const setAccounts=(next:Record<string,{passwordHash:string;verified:boolean}>)=>localStorage.setItem(mockAccountKey,JSON.stringify(next));
  const clearAlerts=()=>{setError("");setMessage("");};
  const login=async()=>{
    clearAlerts();setBusy(true);
    try{
      const email=authForm.email.trim().toLowerCase(),account=accounts()[email];
      if(!account)throw new Error("No applicant account was found in this browser. Select Create an account to register first. Prototype accounts are saved only in the browser where they were created.");
      if(account.passwordHash!==await hashPassword(authForm.password))throw new Error("Incorrect password for this applicant account. Use the password chosen during registration, or select Forgot password.");
      if(!account.verified)throw new Error("Verify your email first. In this prototype, use the verification action shown after registration.");
      refreshApplicantData(email);setView(selectedVacancyId?"apply":"dashboard");setMessage("Signed in using simulated prototype authentication.");
    }catch(e){setError(e instanceof Error?e.message:"Could not sign in.");}
    finally{setBusy(false);}
  };
  const register=async()=>{
    clearAlerts();setBusy(true);
    try{
      const email=authForm.email.trim().toLowerCase();
      if(!email||!authForm.password||authForm.password.length<8)throw new Error("Enter a valid email and create a password of at least 8 characters. Shorter passwords cannot be registered.");
      if(authForm.password!==authForm.confirm)throw new Error("Password confirmation does not match.");
      const existing=accounts();if(existing[email])throw new Error("This email already has a prototype account in this browser. Sign in or use Forgot password.");
      setAccounts({...existing,[email]:{passwordHash:await hashPassword(authForm.password),verified:true}});
      saveMockProfile(emptyProfile(email));
      refreshApplicantData(email);
      setView(selectedVacancyId?"apply":"dashboard");
      setMessage("Applicant prototype account created successfully. You are now signed in. No real verification email was sent.");
    }catch(e){setError(e instanceof Error?e.message:"Could not register.");}
    finally{setBusy(false);}
  };
  const verifyEmail=()=>{
    const email=authForm.email.trim().toLowerCase(),all=accounts();
    if(!all[email]){setError("Register an account first.");return;}
    setAccounts({...all,[email]:{...all[email],verified:true}});
    refreshApplicantData(email);setView(selectedVacancyId?"apply":"dashboard");setMessage("Prototype email verified. No email was sent.");
  };
  const resetPassword=async()=>{
    clearAlerts();setBusy(true);
    try{
      const email=authForm.email.trim().toLowerCase(),all=accounts();
      if(!all[email])throw new Error("No simulated account was found for this email.");
      if(!authForm.password||authForm.password.length<8)throw new Error("Enter a new password of at least 8 characters.");
      if(authForm.password!==authForm.confirm)throw new Error("Password confirmation does not match.");
      setAccounts({...all,[email]:{...all[email],passwordHash:await hashPassword(authForm.password)}});
      setMessage("Password reset in this browser prototype. Production reset must use a verified, expiring email link.");setView("login");
    }catch(e){setError(e instanceof Error?e.message:"Could not reset password.");}
    finally{setBusy(false);}
  };
  const requireLogin=(target:View)=>{
    if(!userEmail){setView("login");setError("Sign in to continue.");return;}
    setError("");setView(target);
  };
  const startApply=(vacancy:JobVacancy)=>{
    if(new Date(`${vacancy.deadline}T23:59:59+08:00`)<new Date()){setError("The application deadline has passed.");return;}
    const savedDraft=getDraft(vacancy.id);
    setSelectedVacancyId(vacancy.id);
    setActiveDraftId(savedDraft?.id||"");
    setSelectedFiles(savedDraft?.documents||[]);
    if(savedDraft)setProfile(savedDraft.profileSnapshot);
    setConfirmation(false);
    if(!userEmail){setView("login");setError("Sign in to continue your application.");return;}
    setError("");setView("apply");
  };
  const getDraft=(vacancyId:string)=>drafts.find(d=>d.vacancyId===vacancyId);
  const applicationDraft=():ExternalApplication=>{
    const prior=getDraft(selectedVacancyId);
    const id=prior?.id||activeDraftId||`DRAFT-${crypto.randomUUID?.()||Date.now()}`;
    if(!activeDraftId)setActiveDraftId(id);
    return {
      id,email:userEmail,vacancyId:selectedVacancyId,
      trackingNo:prior?.trackingNo||"",submittedAt:new Date().toISOString(),status:"Draft",
      statusHistory:prior?.statusHistory||[{status:"Draft",at:new Date().toISOString(),message:"Draft saved by applicant."}],
      profileSnapshot:{...profile},documents:selectedFiles.length?selectedFiles:prior?.documents||[],schedules:prior?.schedules||[],
    };
  };
  const saveDraft=()=>{
    try{const draft=applicationDraft();api.saveDraft(draft);setDrafts(api.listDrafts(userEmail));setMessage("Application draft saved in this browser.");setError("");}
    catch(e){setError(e instanceof Error?e.message:"Could not save draft.");}
  };
  const submitApplication=()=>{
    if(!selectedVacancy||!userEmail)return;
    if(new Date(`${selectedVacancy.deadline}T23:59:59+08:00`)<new Date()){setError("The application deadline has passed.");return;}
    if(missingProfile.length){setError(`Complete required profile fields: ${missingProfile.join(", ")}.`);return;}
    const required=selectedVacancy.requiredDocuments||["Personal Data Sheet (PDS)","Résumé / Curriculum Vitae"];
    const missingDocs=required.filter(r=>!selectedFiles.some(f=>f.requirement===r));
    if(missingDocs.length){setError(`Upload required documents: ${missingDocs.join(", ")}.`);return;}
    if(!confirmation){setError("Confirm that the submitted information is accurate.");return;}
    try{
      const draft=applicationDraft();
      const now=new Date().toISOString(),stableSuffix=draft.id.replace(/[^A-Z0-9]/gi,"").slice(-8).toUpperCase();
      const trackingNo=`PNU-EXT-${new Date().getFullYear()}-${stableSuffix}`;
      const submitted:ExternalApplication={...draft,trackingNo,submittedAt:now,status:"Submitted",statusHistory:[...draft.statusHistory,{status:"Submitted",at:now,message:"Application received by the recruitment platform."}]};
      const existingHrips=applicants.find(item=>item.externalTrackingNo===trackingNo);
      if(!existingHrips) {
        const hripsApplicant=onApply(mapToHripsApplicant(submitted));
        if(!hripsApplicant.id)throw new Error("HRIPS mock synchronization did not return an application record.");
      }
      api.submitApplication(submitted);
      refreshApplicantData(userEmail);setSelectedApplicationId(submitted.id);setActiveDraftId("");setView("application");setError("");setMessage("Application submitted. Email/SMS and HRIPS synchronization are simulated.");
    }catch(e){setError(e instanceof Error?e.message:"Submission failed. Save as draft and retry.");}
  };
  const saveProfile=()=>{
    try{saveMockProfile(profile);setMessage("Profile saved. Previously submitted application snapshots are unchanged.");setError("");}
    catch(e){setError(e instanceof Error?e.message:"Could not save profile.");}
  };
  const retryHripsSync=()=>{
    clearAlerts();
    try {
      applications.forEach(application=>{
        if(!applicants.some(item=>item.externalTrackingNo===application.trackingNo))onApply(mapToHripsApplicant(application));
      });
      setApplications(current=>current.map(application=>mergeHripsApplication(application,applicants.find(item=>item.externalTrackingNo===application.trackingNo))));
      setMessage("HRIPS mock synchronization checked. Failed items can be retried; no remote service is configured.");
    } catch(e) { setError(e instanceof Error?e.message:"HRIPS synchronization retry failed."); }
  };
  const saveNotificationConfig=()=>{
    try { api.saveNotificationConfig(notificationConfig);setMessage("Notification settings saved. Provider delivery remains simulated.");setError(""); }
    catch(e) { setError(e instanceof Error?e.message:"Could not save notification settings."); }
  };
  const uploadFiles=(files:FileList|null,requestedRequirement?:string)=>{
    if(!files)return;const additions:ExternalDocument[]=[];
    const assigned=new Set(selectedFiles.map(file=>file.requirement));
    for(const file of Array.from(files)){
      const extension=file.name.split(".").pop()?.toLowerCase();
      const type=file.type||EXTENSION_TYPES[extension||""]||"";
      if(!ACCEPTED_TYPES.includes(type)){setError(`${file.name}: allowed formats are PDF, JPG, and PNG.`);continue;}
      if(file.size>notificationConfig.maxUploadSizeMb*1024*1024){setError(`${file.name}: file exceeds the ${notificationConfig.maxUploadSizeMb} MB limit.`);continue;}
      const requirements=selectedVacancy?.requiredDocuments||["Personal Data Sheet (PDS)","Résumé / Curriculum Vitae"];
      const requirement=requestedRequirement||requirements.find(item=>!assigned.has(item))||file.name;
      assigned.add(requirement);
      additions.push({requirement,fileName:file.name,size:file.size,type});
    }
    setSelectedFiles(prev=>additions.reduce((next,file)=>[...next.filter(existing=>existing.requirement!==file.requirement),file],prev));
  };
  const availableDrafts=drafts.filter(d=>isPublishedVacancy(vacancies.find(v=>v.id===d.vacancyId)||({status:"Closed"} as JobVacancy)));
  const navItems:Array<{label:string;view:View;icon:typeof Briefcase}>=[
    {label:"Jobs",view:"jobs",icon:Briefcase},{label:"Dashboard",view:"dashboard",icon:UserRound},
    {label:"My Profile",view:"profile",icon:UserRound},{label:"My Applications",view:"applications",icon:FileText},
    {label:"Assessment Schedule",view:"schedule",icon:GraduationCap},{label:"Notifications",view:"notifications",icon:Bell},
  ];
  const changeView=(next:View)=>{setView(next);setDrawer(false);clearAlerts();};

  const statusBadge=(status:string)=><span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">{status}</span>;
  const button=(label:string,onClick:()=>void,variant:"gold"|"outline"|"navy"="gold",disabled=false)=><button disabled={disabled} onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${variant==="gold"?"bg-[#C8A84B] text-[#10233F]":variant==="navy"?"bg-[#10233F] text-white":"border border-slate-300 bg-white text-slate-700"}`}>{label}</button>;
  const card=(children:React.ReactNode,className="",key?:string)=><div key={key} className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
  const profileFields=()=>(
    <div className="grid gap-4 sm:grid-cols-2">
      {([["First name","firstName"],["Middle name","middleName"],["Last name","lastName"],["Email","email"],["Phone","phone"],["Birth date","birthDate"],["Address","address"],["Education","education"],["Eligibility","eligibility"],["Certifications","certifications"],["Work experience","experience"]] as const).map(([label,key])=><label key={key} className="text-sm font-medium text-slate-700">{label}{key==="email"?<input className={fieldClass} value={profile.email} disabled/>:<input className={fieldClass} type={key==="birthDate"?"date":"text"} value={profile[key]} onChange={e=>setProfile(p=>({...p,[key]:e.target.value}))}/>}</label>)}<label className="text-sm font-medium text-slate-700">Gender<select className={fieldClass} value={profile.gender} onChange={e=>setProfile(p=>({...p,gender:e.target.value as "Male"|"Female"}))}><option>Female</option><option>Male</option></select></label>
    </div>
  );
  const timeline=(app:ExternalApplication)=><ol className="relative ml-2 border-l border-slate-200">{app.statusHistory.map((event,index)=><li key={`${event.status}-${event.at}-${index}`} className="mb-5 ml-5"><span className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-[#C8A84B] ring-4 ring-white"/><p className="text-sm font-semibold text-slate-900">{event.status}</p><p className="text-xs text-slate-500">{formatSchedule(event.at)}</p><p className="mt-1 text-sm text-slate-600">{event.message}</p></li>)}</ol>;
  const content=()=>{
    if(view==="login"||view==="register"||view==="forgot")return <div className="mx-auto max-w-lg py-10">{card(<><div className="mb-5"><p className="text-xs font-bold uppercase tracking-widest text-[#9A7A25]">Applicant account</p><h1 className="mt-1 text-2xl font-bold text-[#10233F]">{view==="login"?"Sign in":view==="register"?"Create an account":"Reset password"}</h1><p className="mt-2 text-sm text-slate-600">Create an applicant account to apply for jobs. This prototype saves accounts only in your current browser; it does not send real verification emails.</p></div><div className="space-y-4"><label className="block text-sm font-medium">Email<input type="email" autoComplete="email" className={fieldClass} value={authForm.email} onChange={e=>setAuthForm(f=>({...f,email:e.target.value}))}/></label>{view!=="forgot"&&<label className="block text-sm font-medium">Password<input type="password" autoComplete={view==="login"?"current-password":"new-password"} className={fieldClass} value={authForm.password} onChange={e=>setAuthForm(f=>({...f,password:e.target.value}))}/></label>}{view==="register"&&<p className="text-xs text-slate-500">Use at least 8 characters for your password. Registration will sign you in automatically in this browser prototype.</p>}{view!=="login"&&<label className="block text-sm font-medium">{view==="forgot"?"Confirm new password":"Confirm password"}<input type="password" className={fieldClass} value={authForm.confirm} onChange={e=>setAuthForm(f=>({...f,confirm:e.target.value}))}/></label>}{button(busy?"Please wait…":view==="login"?"Sign in":view==="register"?"Register":"Reset password",()=>void(view==="login"?login():view==="register"?register():resetPassword()),"gold",busy)}{view==="register"&&message.includes("000000")&&button("Verify email (simulated)",verifyEmail,"outline")}{view==="login"&&<>{button("Create an account",()=>changeView("register"),"outline")}{button("Forgot password?",()=>changeView("forgot"),"outline")}</>}{view!=="login"&&button("Back to sign in",()=>changeView("login"),"outline")}</div></>)}</div>;
    if(view==="jobs")return <div className="space-y-6"><section className="rounded-3xl bg-[#10233F] px-6 py-10 text-white md:px-10"><p className="text-xs font-bold uppercase tracking-[.2em] text-amber-300">Philippine Normal University</p><h1 className="mt-3 max-w-2xl text-3xl font-bold md:text-4xl">Build your future in public service and education.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-200">Explore career opportunities at PNU and track your application securely through this external applicant portal.</p><div className="mt-6 flex flex-wrap gap-3">{button("Browse vacancies",()=>document.getElementById("vacancy-list")?.scrollIntoView({behavior:"smooth"}))}{!userEmail&&button("Create applicant account",()=>changeView("register"),"outline")}</div></section><div id="vacancy-list" className="flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400"/><input className={`${fieldClass} pl-9`} aria-label="Search vacancies" placeholder="Search title, department, qualifications" value={search} onChange={e=>setSearch(e.target.value)}/></label><select className={`${fieldClass} sm:w-56`} value={employmentFilter} onChange={e=>setEmploymentFilter(e.target.value)}><option>All</option>{Array.from(new Set(published.map(v=>v.employmentType))).map(type=><option key={type}>{type}</option>)}</select></div><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-[#10233F]">Published Vacancies</h2><span className="text-sm text-slate-500">{visibleVacancies.length} listed</span></div>{visibleVacancies.length?<div className="grid gap-4 md:grid-cols-2">{visibleVacancies.map(v=>card(<><div className="flex items-start justify-between gap-2"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#9A7A25]">{v.classification||v.employmentType}</p><h3 className="mt-1 text-lg font-bold text-[#10233F]">{v.position}</h3></div><span className="rounded-lg bg-slate-100 px-2 py-1 text-xs">{v.employmentType}</span></div><p className="mt-2 text-sm text-slate-600">{v.department}</p><p className="mt-3 line-clamp-2 text-sm text-slate-600">{v.qualifications}</p><p className="mt-4 text-xs text-slate-500">Deadline: {formatDate(v.deadline)}{isApplicationOpen(v)?"":" · Closed"}</p><div className="mt-4 flex gap-2">{button("View details",()=>{setSelectedVacancyId(v.id);changeView("details")},"outline")}{button(isApplicationOpen(v)?"Apply":"Closed",()=>startApply(v),"gold",!isApplicationOpen(v))}</div></>,"",v.id))}</div>:card(<div className="py-8 text-center"><Briefcase className="mx-auto h-8 w-8 text-slate-300"/><p className="mt-2 font-semibold">No published vacancies</p><p className="mt-1 text-sm text-slate-500">Check back later or adjust your filters.</p></div>)}</div>;
    if(view==="details")return <div className="mx-auto max-w-3xl space-y-4">{button("Back to vacancies",()=>changeView("jobs"),"outline")} {selectedVacancy?card(<><p className="text-sm font-semibold text-[#9A7A25]">{selectedVacancy.employmentType} · {selectedVacancy.department}</p><h1 className="mt-2 text-3xl font-bold text-[#10233F]">{selectedVacancy.position}</h1><p className="mt-5 text-sm leading-6 text-slate-700">{selectedVacancy.qualifications}</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><p className="text-sm"><strong>Salary grade:</strong> SG-{selectedVacancy.salaryGrade}</p><p className="text-sm"><strong>Positions:</strong> {selectedVacancy.slots}</p><p className="text-sm"><strong>Deadline:</strong> {formatDate(selectedVacancy.deadline)}{isApplicationOpen(selectedVacancy)?"":" · Closed"}</p></div><h2 className="mt-6 font-bold">Required documents</h2><ul className="mt-2 list-inside list-disc text-sm text-slate-600">{(selectedVacancy.requiredDocuments||["Personal Data Sheet (PDS)","Résumé / Curriculum Vitae"]).map(doc=><li key={doc}>{doc}</li>)}</ul><div className="mt-6">{button("Apply for this position",()=>startApply(selectedVacancy),"gold",!isApplicationOpen(selectedVacancy))}</div></>):card(<p>Vacancy is no longer available.</p>)}</div>;
    if(view==="dashboard")return <div className="space-y-5"><div><p className="text-sm text-slate-500">Signed in as {userEmail}</p><h1 className="text-2xl font-bold text-[#10233F]">Applicant Dashboard</h1></div><div className="grid gap-4 sm:grid-cols-3">{[[applications.length,"Submitted applications"],[drafts.length,"Saved drafts"],[notifications.length,"Notifications"]].map(([value,label])=>card(<><p className="text-2xl font-bold text-[#10233F]">{value}</p><p className="text-sm text-slate-500">{label}</p></>,"",String(label)))}</div>{card(<><h2 className="font-bold">Continue an application</h2>{availableDrafts.length?availableDrafts.map(d=>{const v=vacancies.find(item=>item.id===d.vacancyId);return <div key={d.id} className="flex flex-wrap items-center justify-between gap-2 border-b py-3"><span>{v?.position||"Vacancy"} · Draft</span>{button("Continue",()=>{setSelectedVacancyId(d.vacancyId);setActiveDraftId(d.id);setProfile(d.profileSnapshot);setSelectedFiles(d.documents);changeView("apply")},"outline")}</div>}):<p className="mt-2 text-sm text-slate-500">No saved drafts.</p>}</>)}<h2 className="text-lg font-bold">Recent applications</h2>{applications.slice(0,3).map(a=>card(<div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">{vacancies.find(v=>v.id===a.vacancyId)?.position}</p><p className="text-xs text-slate-500">{a.trackingNo} · {formatDate(a.submittedAt)}</p></div>{statusBadge(a.status)}</div>,"",a.id))}</div>;
    if(view==="profile")return <div className="mx-auto max-w-3xl space-y-4">{card(<><div className="flex items-start justify-between"><div><h1 className="text-2xl font-bold text-[#10233F]">My Profile</h1><p className="mt-1 text-sm text-slate-500">Updates apply to new applications only. Submitted applications keep their original profile snapshot.</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-800">{completion}% complete</span></div><div className="my-4 h-2 rounded bg-slate-100"><div className="h-full rounded bg-[#C8A84B]" style={{width:`${completion}%`}}/></div>{profileFields()}<div className="mt-4">{button("Save profile",saveProfile)}</div>{missingProfile.length>0&&<p className="mt-3 text-xs text-amber-800">Required fields missing: {missingProfile.join(", ")}</p>}</>)}</div>;
    if(view==="apply")return <div className="mx-auto max-w-4xl space-y-4">{card(<><div className="flex items-center justify-between"><div><p className="text-sm text-[#9A7A25]">{selectedVacancy?.department}</p><h1 className="text-2xl font-bold text-[#10233F]">Application · {selectedVacancy?.position}</h1></div>{statusBadge("Draft")}</div><div className="mt-4 flex flex-wrap gap-2">{button("Save draft",saveDraft,"outline")}{button("Review application",()=>{if(missingProfile.length){setError(`Complete profile fields: ${missingProfile.join(", ")}`);setView("profile");return;}setView("review")})}</div></>)}
      {view==="apply"&&card(<><h2 className="mb-3 text-lg font-bold">Applicant Information</h2>{profileFields()}</>)}
      {card(<><h2 className="text-lg font-bold">Supporting Documents</h2><p className="mt-1 text-xs text-slate-500">PDF, JPG, or PNG · Maximum {notificationConfig.maxUploadSizeMb} MB each. Prototype stores filenames/metadata only; no protected file upload is configured.</p><label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-6 text-sm text-slate-600"><Upload className="h-5 w-5"/>Choose files<input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={e=>uploadFiles(e.target.files)}/></label><div className="mt-3 space-y-2">{(selectedVacancy?.requiredDocuments||["Personal Data Sheet (PDS)","Résumé / Curriculum Vitae"]).map(doc=>{const file=selectedFiles.find(f=>f.requirement===doc);return <div key={doc} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm"><span>{doc} {file?<span className="text-xs text-slate-500">· {file.fileName}</span>:<span className="text-xs text-red-600">· Required</span>}</span><label className="cursor-pointer text-xs font-semibold text-blue-800">{file?"Replace":"Upload"}<input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={e=>uploadFiles(e.target.files,doc)}/></label></div>})}{selectedFiles.filter(f=>!(selectedVacancy?.requiredDocuments||["Personal Data Sheet (PDS)","Résumé / Curriculum Vitae"]).includes(f.requirement)).map((file,i)=><div key={`${file.fileName}-${i}`} className="text-xs text-slate-500">{file.fileName} · {Math.ceil(file.size/1024)} KB</div>)}</div></>)}
      </div>;
    if(view==="review")return <div className="mx-auto max-w-3xl space-y-4">{card(<><button className="mb-4 text-sm text-blue-800" onClick={()=>setView("apply")}><ArrowLeft className="mr-1 inline h-4 w-4"/>Back to application</button><p className="text-sm text-[#9A7A25]">Final review · {selectedVacancy?.department}</p><h1 className="text-2xl font-bold text-[#10233F]">{selectedVacancy?.position}</h1><h2 className="mt-5 font-bold">Applicant profile snapshot</h2><dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">{Object.entries(profile).map(([label,value])=><div key={label} className="rounded-lg bg-slate-50 p-3"><dt className="text-xs capitalize text-slate-500">{label}</dt><dd>{value||"—"}</dd></div>)}</dl><h2 className="mt-5 font-bold">Documents</h2><ul className="mt-2 list-inside list-disc text-sm">{selectedFiles.map(file=><li key={file.requirement}>{file.requirement}: {file.fileName}</li>)}</ul><p className="mt-4 text-xs text-slate-500">Once submitted, your profile and document metadata are preserved as a snapshot and cannot be changed through this portal.</p><label className="mt-4 flex gap-2 text-sm"><input type="checkbox" checked={confirmation} onChange={e=>setConfirmation(e.target.checked)}/>I certify that the information and documents submitted are true and accurate.</label><div className="mt-4 flex gap-2">{button("Save draft",saveDraft,"outline")}{button("Submit application",submitApplication,"gold",!confirmation)}</div></>)}</div>;
    if(view==="application")return <div className="mx-auto max-w-3xl space-y-4">{card(<><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold text-[#10233F]">Application details</h1><p className="text-sm text-slate-500">{selectedApplication?.trackingNo}</p></div>{selectedApplication&&statusBadge(selectedApplication.status)}</div><p className="mt-4 text-sm"><strong>Position:</strong> {vacancies.find(v=>v.id===selectedApplication?.vacancyId)?.position}</p><p className="text-sm"><strong>Submitted:</strong> {formatDate(selectedApplication?.submittedAt||"")}</p><h2 className="mb-3 mt-6 font-bold">Status timeline</h2>{selectedApplication?timeline(selectedApplication):<p>Application submission confirmation.</p>}</>)}</div>;
    if(view==="applications")return <div className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold text-[#10233F]">My Applications</h1>{button("Retry / reconcile HRIPS",retryHripsSync,"outline")}</div><input className={fieldClass} placeholder="Filter by tracking number or position" value={applicationSearch} onChange={e=>setApplicationSearch(e.target.value)}/>{applications.filter(a=>`${a.trackingNo} ${vacancies.find(v=>v.id===a.vacancyId)?.position}`.toLowerCase().includes(applicationSearch.toLowerCase())).map(a=>card(<div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-bold">{vacancies.find(v=>v.id===a.vacancyId)?.position}</p><p className="text-xs text-slate-500">Tracking {a.trackingNo} · Submitted {formatDate(a.submittedAt)}</p></div>{statusBadge(a.status)}{button("View details",()=>{setSelectedApplicationId(a.id);changeView("application")},"outline")}</div>,"",a.id))}{!applications.length&&card(<p className="text-sm text-slate-500">You have not submitted an application.</p>)}</div>;
    if(view==="schedule")return <div className="space-y-4"><h1 className="text-2xl font-bold text-[#10233F]">Assessment Schedule</h1>{applications.flatMap(a=>a.schedules.map((schedule,index)=>({a,schedule,index}))).map(({a,schedule,index})=>card(<><p className="text-xs font-semibold uppercase text-[#9A7A25]">{schedule.type} · {vacancies.find(v=>v.id===a.vacancyId)?.position}</p><p className="mt-2 font-bold">{formatSchedule(schedule.dateTime)} · Asia/Manila</p><p className="mt-1 text-sm">{schedule.location}</p><p className="mt-2 text-sm text-slate-600">{schedule.instructions}</p><p className="mt-2 text-xs text-slate-400">Tracking: {a.trackingNo}{schedule.updatedAt?` · Updated ${formatSchedule(schedule.updatedAt)}`:""}</p></>,"",`schedule-${a.id}-${index}`))}{!applications.some(a=>a.schedules.length)&&card(<p className="text-sm text-slate-500">No examinations or interviews have been scheduled for your applications.</p>)}</div>;
    if(view==="notifications")return <div className="space-y-4"><h1 className="text-2xl font-bold text-[#10233F]">Notifications</h1><p className="text-sm text-amber-800">Email and SMS integrations are simulated. No messages are sent externally.</p>{card(<><h2 className="font-bold">Notification delivery and data retention</h2><label className="mt-2 block text-sm">SMS sender name<input className={fieldClass} maxLength={11} value={notificationConfig.smsSenderName} onChange={e=>setNotificationConfig(c=>({...c,smsSenderName:e.target.value}))}/></label><label className="mt-3 block text-sm">Maximum upload size (MB)<input type="number" min={1} max={50} className={fieldClass} value={notificationConfig.maxUploadSizeMb} onChange={e=>setNotificationConfig(c=>({...c,maxUploadSizeMb:Number(e.target.value)}))}/></label><label className="mt-3 block text-sm">Prototype draft / in-portal notification retention (days)<input type="number" min={1} max={3650} className={fieldClass} value={notificationConfig.retentionDays} onChange={e=>setNotificationConfig(c=>({...c,retentionDays:Number(e.target.value)}))}/></label><p className="mt-1 text-xs text-slate-500">Expired drafts/notifications are hidden. Production retention for submitted applications and uploaded files must be configured and enforced by the backend and institutional policy.</p><p className="mt-1 text-xs text-slate-500">Sender names are provider-dependent and may require registration/approval. Provider credentials belong only on the server.</p><div className="mt-3">{button("Save settings",saveNotificationConfig)}</div></>)}{notifications.map(n=>card(<><div className="flex justify-between"><h2 className="font-bold">{n.title}</h2><span className="text-xs">{n.channel}</span></div><p className="mt-1 text-sm text-slate-600">{n.message}</p><p className="mt-2 text-xs text-slate-400">{formatSchedule(n.createdAt)}</p></>,"",n.id))}{!notifications.length&&card(<p className="text-sm text-slate-500">No notifications yet.</p>)}</div>;
    return <div/>;
  };
  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8"><button className="flex items-center gap-3 text-left" onClick={()=>changeView("jobs")}><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#10233F] text-sm font-black text-[#C8A84B]">PNU</div><div><p className="font-bold text-[#10233F]">PNU Careers</p><p className="text-[11px] text-slate-500">External Recruitment Platform</p></div></button><button className="rounded-lg border p-2 md:hidden" aria-label="Toggle navigation" onClick={()=>setDrawer(v=>!v)}>{drawer?<X/>:<Menu/>}</button><nav className="hidden items-center gap-1 md:flex">{navItems.filter(n=>userEmail||n.view==="jobs").map(n=><button key={n.view} onClick={()=>requireLogin(n.view)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${view===n.view?"bg-amber-50 text-amber-900":"text-slate-600 hover:bg-slate-100"}`}>{n.label}{n.view==="notifications"&&notifications.length>0?` (${notifications.length})`:""}</button>)}{userEmail?button("Sign out",()=>{setUserEmail("");setProfile(emptyProfile());setApplications([]);setDrafts([]);setNotifications([]);setSelectedFiles([]);setSelectedVacancyId("");setSelectedApplicationId("");setActiveDraftId("");setView("jobs");setMessage("Signed out.");},"outline"):button("Sign in",()=>changeView("login"),"navy")}</nav></div>{drawer&&<div className="space-y-1 border-t p-3 md:hidden">{navItems.filter(n=>userEmail||n.view==="jobs").map(n=><button key={n.view} className="block w-full rounded-lg p-3 text-left text-sm" onClick={()=>userEmail?changeView(n.view):changeView("login")}>{n.label}</button>)}{userEmail?button("Sign out",()=>{setUserEmail("");setProfile(emptyProfile());setApplications([]);setDrafts([]);setNotifications([]);setSelectedFiles([]);setSelectedVacancyId("");setSelectedApplicationId("");setActiveDraftId("");setView("jobs");},"outline"):button("Sign in",()=>changeView("login"),"navy")}</div>}</header>
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">{(error||message)&&<div role={error?"alert":"status"} className={`mb-4 flex items-start justify-between gap-2 rounded-xl border p-3 text-sm ${error?"border-red-200 bg-red-50 text-red-800":"border-emerald-200 bg-emerald-50 text-emerald-800"}`}><span>{error||message}</span><button aria-label="Dismiss message" onClick={clearAlerts}><X className="h-4 w-4"/></button></div>}{content()}</main>
    <footer className="mt-12 border-t bg-white"><div className="mx-auto grid max-w-7xl gap-2 px-4 py-6 text-xs text-slate-500 md:grid-cols-2 md:px-8"><p>Prototype only · Simulated authentication, file metadata uploads, email/SMS, and HRIPS synchronization.</p><p className="md:text-right">Privacy: applicant data is stored in this browser prototype. Do not upload sensitive or real applicant data.</p></div></footer>
  </div>;
}
