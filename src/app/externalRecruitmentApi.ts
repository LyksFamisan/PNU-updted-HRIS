import type { Applicant, JobVacancy } from "./types";

export interface ExternalApplicantProfile {
  firstName: string; middleName: string; lastName: string; email: string; phone: string; gender:"Male"|"Female";
  address: string; birthDate: string; education: string; eligibility: string;
  certifications: string; experience: string;
}
export interface ExternalDocument {
  requirement: string; fileName: string; size: number; type: string;
}
export interface ExternalApplication {
  id: string; email: string; vacancyId: string; trackingNo: string;
  submittedAt: string; status: string; statusHistory: { status: string; at: string; message: string }[];
  profileSnapshot: ExternalApplicantProfile; documents: ExternalDocument[];
  schedules: { type: "Examination" | "Interview"; dateTime: string; location: string; instructions: string; updatedAt?: string }[];
}
export interface ExternalNotification {
  id: string; email: string; title: string; message: string; createdAt: string; channel: "In portal" | "Email" | "SMS";
}
export interface ExternalNotificationConfig { smsSenderName: string; deliveryMode: "simulated" | "provider"; retentionDays:number; maxUploadSizeMb:number; }
export interface ExternalRecruitmentApi {
  listDrafts(email: string): ExternalApplication[];
  saveDraft(draft: ExternalApplication): void;
  submitApplication(application: ExternalApplication): void;
  listApplications(email: string): ExternalApplication[];
  listNotifications(email: string): ExternalNotification[];
  addNotification(notification: ExternalNotification): void;
  getNotificationConfig(): ExternalNotificationConfig;
  saveNotificationConfig(config: ExternalNotificationConfig): void;
}

const STORAGE_KEY="pnu-external-recruitment-mock-v1";
const NOTIFICATION_CONFIG_KEY="pnu-external-recruitment-notification-config";
interface MockStore { drafts: ExternalApplication[]; applications: ExternalApplication[]; notifications: ExternalNotification[]; }
const emptyStore=():MockStore=>({
  drafts:[],
  applications:[{
    id:"EXT-DEMO-001",email:"demo.applicant@example.test",vacancyId:"JV-2024-001",
    trackingNo:"PNU-EXT-2026-DEMO0001",submittedAt:"2026-11-01T04:30:00.000Z",
    status:"Under Review",statusHistory:[
      {status:"Submitted",at:"2026-11-01T04:30:00.000Z",message:"Application received by the recruitment platform."},
      {status:"Under Review",at:"2026-11-03T02:00:00.000Z",message:"Your application is being reviewed."},
    ],
    profileSnapshot:{firstName:"Alex",middleName:"",lastName:"Sample",email:"demo.applicant@example.test",phone:"",gender:"Female",address:"",birthDate:"",education:"",eligibility:"",certifications:"",experience:""},
    documents:[{requirement:"Résumé / Curriculum Vitae",fileName:"sample-resume.pdf",size:185000,type:"application/pdf"}],
    schedules:[{type:"Examination",dateTime:"2026-11-20T01:00:00.000Z",location:"PNU Manila · Examination Room 2",instructions:"Bring a valid ID and arrive 30 minutes early."}],
  }],
  notifications:[{id:"EXT-NOT-DEMO-001",email:"demo.applicant@example.test",title:"Assessment schedule posted",message:"An examination schedule was added to your application.",createdAt:"2026-11-03T02:00:00.000Z",channel:"In portal"}],
});
function readStore():MockStore {
  try {
    const raw=localStorage.getItem(STORAGE_KEY);
    if(!raw){const seed=emptyStore();writeStore(seed);return seed;}
    const parsed=JSON.parse(raw) as Partial<MockStore>;
    return {drafts:Array.isArray(parsed.drafts)?parsed.drafts:[],applications:Array.isArray(parsed.applications)?parsed.applications:[],notifications:Array.isArray(parsed.notifications)?parsed.notifications:[]};
  } catch(error) {
    console.error("Could not read the recruitment mock API store.",error);
    throw new Error("Recruitment prototype data is unreadable. Clear its mock data or contact support.");
  }
}
function writeStore(store:MockStore) {
  try { localStorage.setItem(STORAGE_KEY,JSON.stringify(store)); }
  catch(error) { console.error("Could not save recruitment mock API data.",error); throw new Error("Could not save your changes in this browser."); }
}
export const externalRecruitmentApi:ExternalRecruitmentApi={
  listDrafts:email=>{
    const days=externalRecruitmentApi.getNotificationConfig().retentionDays;
    return readStore().drafts.filter(d=>d.email===email&&(Date.now()-new Date(d.submittedAt).getTime())/86400000<=days);
  },
  saveDraft:draft=>{
    const store=readStore();
    if(store.applications.some(app=>app.email===draft.email&&app.vacancyId===draft.vacancyId))throw new Error("An application for this vacancy has already been submitted.");
    writeStore({...store,drafts:[...store.drafts.filter(item=>item.id!==draft.id),draft]});
  },
  submitApplication:application=>{
    const store=readStore();
    if(store.applications.some(app=>app.email===application.email&&app.vacancyId===application.vacancyId))throw new Error("An application for this vacancy has already been submitted.");
    writeStore({...store,drafts:store.drafts.filter(d=>d.id!==application.id),applications:[...store.applications,application],notifications:[{
      id:`NOT-${Date.now()}`,email:application.email,title:"Application submitted",
      message:`Your application is submitted. Tracking number: ${application.trackingNo}`,
      createdAt:new Date().toISOString(),channel:"In portal",
    },...store.notifications]});
  },
  listApplications:email=>readStore().applications.filter(a=>a.email===email),
  listNotifications:email=>{
    const days=externalRecruitmentApi.getNotificationConfig().retentionDays;
    return readStore().notifications.filter(n=>n.email===email&&(Date.now()-new Date(n.createdAt).getTime())/86400000<=days);
  },
  addNotification:notification=>{
    const store=readStore();
    if(store.notifications.some(item=>item.id===notification.id))return;
    writeStore({...store,notifications:[notification,...store.notifications]});
  },
  getNotificationConfig:()=>{
    try { return {...{smsSenderName:"PNU Careers",deliveryMode:"simulated" as const,retentionDays:365,maxUploadSizeMb:10},...JSON.parse(localStorage.getItem(NOTIFICATION_CONFIG_KEY)||"{}")} as ExternalNotificationConfig; }
    catch(error) { console.error("Could not read notification configuration.",error); throw new Error("Notification configuration is unreadable."); }
  },
  saveNotificationConfig:config=>{
    if(!config.smsSenderName.trim()||config.smsSenderName.length>11)throw new Error("SMS sender name must be 1–11 characters.");
    if(!Number.isInteger(config.retentionDays)||config.retentionDays<1||config.retentionDays>3650)throw new Error("Retention must be between 1 and 3650 days.");
    if(!Number.isInteger(config.maxUploadSizeMb)||config.maxUploadSizeMb<1||config.maxUploadSizeMb>50)throw new Error("Maximum file size must be between 1 and 50 MB.");
    try { localStorage.setItem(NOTIFICATION_CONFIG_KEY,JSON.stringify({...config,smsSenderName:config.smsSenderName.trim(),deliveryMode:"simulated"})); }
    catch(error) { console.error("Could not save notification configuration.",error); throw new Error("Could not save notification settings."); }
  },
};
export interface NotificationProvider {
  sendEmail(to:string,subject:string,body:string):Promise<void>;
  sendSms(to:string,senderName:string,message:string):Promise<void>;
}

export function mapToHripsApplicant(application:ExternalApplication):Omit<Applicant,"id"|"trackingNo"> {
  const p=application.profileSnapshot;
  return {
    vacancyId:application.vacancyId,name:[p.firstName,p.middleName,p.lastName].filter(Boolean).join(" "),
    email:p.email,phone:p.phone,appliedDate:application.submittedAt.slice(0,10),status:"Pending",
    score:null,type:"External",firstName:p.firstName,middleName:p.middleName,lastName:p.lastName,
    birthDate:p.birthDate,gender:p.gender,address:p.address,education:p.education,eligibility:p.eligibility,
    experience:p.experience,examResult:"Pending",externalTrackingNo:application.trackingNo,
    externalStatusHistory:application.statusHistory,externalDocuments:application.documents,
    externalSchedule:application.schedules,externalProfileSnapshot:p,
  };
}
export function mergeHripsApplication(application:ExternalApplication,source:Applicant|undefined):ExternalApplication {
  if(!source)return application;
  const applicantStatuses:Record<string,string>={Shortlisted:"Under Review",Examination:"For Examination",Interview:"For Interview",Passed:"Selected",Failed:"Not Selected",Hired:"Selected"};
  const status=applicantStatuses[source.status];
  if(status&&status!==application.status) {
    return {...application,status,statusHistory:[...application.statusHistory,{status,at:new Date().toISOString(),message:"Application status updated by Recruitment Staff."}],schedules:source.externalSchedule||application.schedules};
  }
  return {...application,schedules:source.externalSchedule||application.schedules};
}
export function isPublishedVacancy(vacancy:JobVacancy,now=new Date()):boolean {
  return vacancy.publicationStatus==="Published";
}
export function isApplicationOpen(vacancy:JobVacancy,now=new Date()):boolean {
  return vacancy.status==="Open"&&(!vacancy.deadline||new Date(`${vacancy.deadline}T23:59:59+08:00`)>=now);
}
