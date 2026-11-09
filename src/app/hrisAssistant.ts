import type { Page, Role } from "./types";

export interface HrisGuideAnswer {
  text: string;
  page?: Page;
  pageLabel?: string;
}

interface GuideEntry {
  keys: string[];
  answer: string;
  page?: Page;
  label?: string;
  roles?: Role[];
}

const guides: GuideEntry[] = [
  {keys:["portal","module","role","access","saan","where","sinong","which office","responsible","sino ang bahala"],answer:"Piliin ang portal ayon sa gawain:\n• Recruitment Staff — vacancies, applicants, examinations, competency/PSB assessment, appointment workflow\n• Training Staff — nominations, approvals, onboarding, training reports, competencies\n• Performance Staff — IPCR/OPCR, PBB, IDP, coaching\n• Rewards Unit — PRAISE nominations at awards\n• Health and Wellness Office — medical/dental, wellness programs, counseling\n• HR Records Office — PDS, 201 files, employment history, employee requests\n• Timekeeping Staff — schedule/attendance/DTR\n• Leave Management Staff — leave filing at approval\n• Payroll Staff — payroll processing\n• All Employees/Faculty — sariling PDS, payslip estimates, DTR, leave, applications at updates\n• Faculty Management Staff — faculty profiles at academic tracking\n\nI-navigate kita sa module kung available sa iyong portal."},
  {keys:["leave balance","vacation leave","sick leave","leave application","leave request","file leave","apply leave","mag leave","magpaalam","bakasyon","sick","maternity leave","paternity leave","study leave","leave status"],answer:"Para mag-file bilang Employee/Faculty: buksan ang **Leave & Requests**, piliin ang leave type at dates, ilagay ang dahilan, at isumite. Lalabas ang request bilang Pending at makikita mo rito ang status.\n\nPara sa Leave Management Staff: buksan ang **Leave Management** para suriin ang pending requests at i-approve o i-reject ayon sa patakaran at supporting documents ng PNU. Tingnan ang balance at aprubadong leave bago magpasya. Ang timeline at requirements ay dapat kumpirmahin sa HR; huwag umasa sa demo bilang opisyal na leave-policy source.",page:"leave",label:"Buksan ang Leave page"},
  {keys:["payslip","salary","payroll","net pay","gross pay","sweldo","sahod","pay period"],answer:"Employee/Faculty: buksan ang **Payslip & Contributions** para makita at i-print ang kasalukuyang salary estimate at contribution estimate. Mahalagang demo limitasyon: wala pang employee-level payroll history na konektado, kaya ang pay periods at halaga ay hindi opisyal na aktuwal na payslip.\n\nPayroll Staff: gamitin ang **Payroll Management** para sa payroll runs at status workflow; tiyaking beripikado ang DTR at deductions bago aprubahan o i-release.",page:"payslip",label:"Buksan ang Payslip page"},
  {keys:["gsis","philhealth","phic","pagibig","pag-ibig","hdmf","contribution","contributions","deduction","bawas"],answer:"Employee/Faculty: buksan ang **Payslip & Contributions** para sa estimate at export ng GSIS, PhilHealth/PHIC, Pag-IBIG, at withholding tax. Hindi ito opisyal na remittance statement; hingin sa Payroll/HR ang verified contribution history.\n\nPayroll Staff: gamitin ang payroll reports para mag-review ng deductions at remittance records.",page:"payslip",label:"Tingnan ang contributions"},
  {keys:["dtr","attendance","time in","time out","clock in","clock out","late","absent","kulang oras","timekeeping","overtime","ot","shift","schedule","iskedyul","manual dtr","dtr correction","correct dtr"],answer:"Employee/Faculty: pumunta sa **Schedule & DTR** para sa sariling attendance, DTR, overtime summary, at mag-file ng DTR correction/manual DTR o change-shift request sa **Leave & Requests**. Ang nakikitang weekday schedule ay demo template lamang; kumpirmahin ang aktuwal na shift sa Timekeeping.\n\nTimekeeping Staff: buksan ang **Scheduling & Timekeeping** para tingnan ang records, i-review ang DTR corrections at mag-monitor ng attendance. Huwag baguhin ang record kung walang beripikadong batayan.",page:"attendance",label:"Buksan ang Schedule & DTR"},
  {keys:["recruitment","vacancy","vacancies","job","apply for job","job order","plantilla","applicant","application tracking","tracking number","external applicant"],answer:"External applicant: buksan ang **Job Vacancies** para makita ang published openings at deadlines. Kailangan ng account para mag-apply; kumpletuhin ang profile at kinakailangang dokumento, i-review ang application, kumpirmahin ang katumpakan, at isumite. Makikita ang tracking number, status timeline at schedule sa sariling account.\n\nRecruitment Staff: buksan ang **Recruitment** para sa vacancies, publication, applicants, assessment at appointment workflow. Ang external platform synchronization ay mock/demo pa lamang; walang aktuwal na email/SMS o remote HRIPS API.",page:"recruitment",label:"Buksan ang Recruitment"},
  {keys:["training","seminar","nomination","nominate","learning development","onboarding","orientation","competency","competencies","training application","scholarship"],answer:"Employee/Faculty: buksan ang **Training & Seminars** sa self-service at isumite ang application na may justification; makikita rito ang nomination status. Nananatiling pending hanggang marepaso ng Training Unit.\n\nTraining Staff: buksan ang **Learning & Development** para sa programs, nominations, approval, invitations, assessments, onboarding, competency inventory at reports. Ang email/SMS invitations ay hindi awtomatikong ipinapadala sa demo.",page:"training",label:"Buksan ang Training"},
  {keys:["ipcr","opcr","performance","pbb","bonus","individual development plan","idp","coaching","monitoring","appraisal","rating"],answer:"Employee/Faculty: sa **Development & IPCR**, gumawa ng IPCR draft, magsumite ng IDP at humiling ng coaching. Draft lang ang employee-created IPCR hanggang makumpleto at ma-review; huwag ituring na final rating.\n\nPerformance Staff: buksan ang **Performance Management** para sa IPCR/OPCR appraisals, PBB forms/reports, IDP at coaching. Ang anumang demo scoring o PBB estimate ay hindi opisyal na DBM/CSC determination.",page:"performance",label:"Buksan ang Performance"},
  {keys:["praise","award","rewards","recognition","incentive","loyalty","perfect attendance","gawad agad","outstanding teacher","outstanding employee"],answer:"Rewards and Recognition Staff: buksan ang **Rewards & Recognition** para gumawa at mag-track ng PRAISE nominations, productivity incentives, special awards, PBB, loyalty, perfect attendance, research/extension, Outstanding Teacher/Employee at Gawad Agad. I-validate ang eligibility at approval laban sa kasalukuyang PNU PRAISE rules.",page:"rewards",label:"Buksan ang Rewards"},
  {keys:["health","wellness","medical","dental","mental health","counseling","counselling","risk assessment","medical record"],answer:"Health and Wellness Office: buksan ang **Health & Wellness** para sa medical/dental encounters, health-risk assessments, wellness programs, counseling schedule at aggregate reports. Ang health details ay sensitibo: ilagay lamang ang pinakamababang kinakailangang impormasyon at gamitin ang demo records nang walang totoong datos. Employee self-service requests ay nasa **Other Applications**; huwag mag-post ng medical details sa open request.",page:"wellness",label:"Buksan ang Health & Wellness"},
  {keys:["pds","personal data sheet","personal information","update profile","my profile","employee record","201 file","201 documents","salary adjustment","nosa","nosi","saln","bir form","service record","certificate of employment"],answer:"Employee/Faculty: buksan ang **My PDS** para makita o baguhin ang PDS at isumite ang update para sa HRMO approval. Tingnan ang update history at request forms.\n\nHR Records Staff: buksan ang **HR Records Office** para sa employee records, PDS review, 201 document index, appointment/employment history, forms at reports. Ang dokumento ay metadata/index lamang sa demo at hindi aktuwal na file storage. I-verify ang kasalukuyang CSC PDS form version sa HR.",page:"profile",label:"Buksan ang PDS"},
  {keys:["employee inquiry","inquiry","feedback","customer feedback","change shift","cto","compensatory","overtime request","magna carta","provident fund","pass slip","travel authority","psychological assessment","self assessment","request form","application form"],answer:"Employee/Faculty: buksan ang **Other Applications** o **Leave & Requests**, piliin ang angkop na request type, ilagay lamang ang kinakailangang detalye, at isumite. Makikita ang status sa Applications/Requests. Ang typed acknowledgement sa demo ay hindi legal na digital signature.\n\nHR Records Staff: buksan ang **HR Records Office → Forms & Applications** para i-review at i-update ang request status.",page:"wellness",label:"Buksan ang Employee Applications"},
  {keys:["memo","memorandum","announcement","circular","order","notification","alert","abiso","message"],answer:"Employee/Faculty: buksan ang **Memos & Alerts** para sa published announcements, memos at personal status alerts.\n\nStaff: buksan ang **Notifications** para sa system notifications. Ang pag-publish ng HR communications ay nasa HR Records Office. Basahin ang petsa at status; draft communication ay hindi pa inilalabas sa employees.",page:"notifications",label:"Buksan ang Notifications"},
  {keys:["report","reports","analytics","csv","export","demographics"],answer:"Buksan ang **Reports & Analytics** para sa mga available na workforce, payroll at leave report exports. Ang report data ay demo/local data; tiyaking may pahintulot ka at beripikahin ang resulta bago gamitin sa opisyal na report.",page:"reports",label:"Buksan ang Reports"},
  {keys:["faculty","faculty profile","teaching load","research","academic profile"],answer:"Faculty Management Staff: buksan ang **Faculty Profile** para sa faculty profile, teaching load, research/publication, extension at evaluation information. Ang profile figures sa prototype ay sample data.",page:"faculty",label:"Buksan ang Faculty Management"},
  {keys:["login","log in","sign in","password","account","access denied","cannot login","di makapasok","nakalimutan password"],answer:"Para sa HRIS staff/employee, bumalik sa Access Portal at piliin ang tamang role portal. Sa demo, gamitin lamang ang nakasaad na demo credentials; huwag maglagay ng totoong password sa chat. Ang account access o password reset sa production ay dapat dumaan sa system administrator/official identity service. External applicants ay may hiwalay na sign-in sa PNU Careers; prototype account ay simulated."},
  {keys:["privacy","security","personal data","data protection","confidential","safe","secure","security"],answer:"Protektahan ang personal, payroll at lalo na ang health information. Sa kasalukuyang prototype, maraming workflow at records ay nakaimbak lamang sa browser/localStorage; wala itong production-grade server authorization, secure file storage o audit guarantees. Huwag gumamit ng totoong sensitibong datos hanggang maikabit ang production backend."},
  {keys:["error","bug","not working","hindi gumagana","problem","issue","failed","stuck","help"],answer:"Para matulungan kitang matukoy ang problema, sabihin kung anong portal/module ang gamit mo, anong hakbang ang ginawa mo, anong mensahe ang lumabas, at ano ang inaasahan mong mangyari. Huwag isama ang password, buong ID number, health details o ibang sensitibong impormasyon."},
];

export type GuideLanguage = "fil" | "en";

const englishAnswers: Record<string, string> = {
  portal: "Choose a portal based on your task: Employee/Faculty for your own records and requests, HR Records for PDS and 201 files, Payroll for pay runs, Timekeeping for DTR, Leave Management for leave approvals, and the corresponding staff portal for Recruitment, Training, Performance, Rewards, Wellness, or Faculty Management.",
  "leave balance": "Employees and faculty can open Leave & Requests, select a leave type and dates, enter the reason, and submit. Track the request there. Leave staff can review pending requests in Leave Management. Confirm official eligibility and supporting documents with PNU HR.",
  payslip: "Open Payslip & Contributions to view or print your monthly salary and deduction estimate. For finalized amounts, contact Payroll. Payroll staff can review runs in Payroll Management.",
  gsis: "Open Payslip & Contributions to see or export estimated GSIS, PhilHealth, Pag-IBIG, and withholding tax. Ask Payroll or HR for verified contribution history.",
  dtr: "Open Schedule & DTR to view attendance, time records, and overtime. Submit a DTR correction, manual DTR, or shift-change request in Leave & Requests. Confirm your actual shift with Timekeeping.",
  recruitment: "External applicants can browse Job Vacancies, sign in, complete their profile and documents, then submit and track an application. Recruitment staff manage vacancies, applicants, assessments, and appointments in Recruitment.",
  training: "Employees can apply in Training & Seminars and track their nomination status. Training staff use Learning & Development to review nominations and manage programs, assessments, and reports.",
  ipcr: "Open Development & IPCR to draft an IPCR, submit an IDP, or request coaching. Performance staff can review these in Performance Management.",
  praise: "Open Rewards & Recognition to submit or track PRAISE nominations, incentives, and awards. Confirm eligibility and approval requirements with the PNU Rewards Unit.",
  health: "Wellness staff can manage appointments, assessments, and programs in Health & Wellness. Employees can open Other Applications for requests. Avoid sharing sensitive medical details in open requests.",
  pds: "Open My PDS to view your Personal Data Sheet or submit changes for HRMO approval. HR Records staff can review PDS requests, employee records, and the 201 document index in HR Records Office.",
  "employee inquiry": "Open Other Applications or Leave & Requests, select the request type, and submit the required details. Track its status in Applications or Requests. HR Records staff can review requests in Forms & Applications.",
  memo: "Open Memos & Alerts for published announcements and personal status updates. Staff can view system notifications on the Notifications page.",
  report: "Open Reports & Analytics for available workforce, payroll, and leave exports. Verify the data before using it in an official report.",
  faculty: "Open Faculty Profile for faculty records, teaching loads, research and publications, extension work, and evaluations.",
  login: "Return to the Access Portal and choose your role. Ask the system administrator about account access or password resets. External applicants sign in through PNU Careers. Keep passwords out of chat.",
  privacy: "Use sample information in prototype workflows. Keep real payroll, personal, and medical details in authorized PNU systems.",
  error: "Tell me which portal you used, what you clicked, the error message, and what you expected. Keep passwords, full ID numbers, and sensitive details out of the chat.",
};

type GuidePrompt = [topic: string, filipino: string, english: string];

const portalPrompts: Record<Role, GuidePrompt[]> = {
  admin: [
    ["portal", "Aling portal ang para sa bawat staff role?", "Which portal should each staff role use?"],
    ["login", "Saan idadaan ang account access issue?", "Who handles account access issues?"],
    ["report", "Saan makikita ang system reports?", "Where are the system reports?"],
  ],
  hr_records: [
    ["pds", "Paano i-review ang PDS at 201 records?", "How do I review PDS and 201 records?"],
    ["employee inquiry", "Saan i-review ang employee requests?", "Where do I review employee requests?"],
    ["memo", "Saan mag-publish ng HR memo?", "Where do I publish an HR memo?"],
  ],
  timekeeping: [
    ["dtr", "Saan i-review ang DTR corrections?", "Where do I review DTR corrections?"],
    ["dtr", "Saan makikita ang attendance records?", "Where are the attendance records?"],
  ],
  leave_management: [
    ["leave balance", "Paano i-review ang pending leave requests?", "How do I review pending leave requests?"],
    ["leave balance", "Ano ang dapat tingnan bago mag-approve ng leave?", "What should I check before approving leave?"],
  ],
  payroll: [
    ["payslip", "Saan makikita ang payroll runs?", "Where can I review payroll runs?"],
    ["gsis", "Saan i-review ang contribution deductions?", "Where do I review contribution deductions?"],
    ["report", "Paano mag-export ng payroll report?", "How do I export a payroll report?"],
  ],
  recruitment: [
    ["recruitment", "Saan mag-manage ng vacancies?", "Where do I manage vacancies?"],
    ["recruitment", "Saan i-review ang applicants at assessments?", "Where do I review applicants and assessments?"],
  ],
  training: [
    ["training", "Saan i-review ang training nominations?", "Where do I review training nominations?"],
    ["training", "Saan mag-manage ng training programs?", "Where do I manage training programs?"],
  ],
  performance: [
    ["ipcr", "Saan i-review ang IPCR at OPCR?", "Where do I review IPCR and OPCR?"],
    ["ipcr", "Saan makikita ang IDP at coaching?", "Where are IDP and coaching records?"],
  ],
  rewards: [
    ["praise", "Saan mag-submit ng PRAISE nomination?", "Where do I submit a PRAISE nomination?"],
    ["praise", "Paano i-track ang awards at incentives?", "How do I track awards and incentives?"],
  ],
  wellness: [
    ["health", "Saan mag-manage ng wellness programs?", "Where do I manage wellness programs?"],
    ["health", "Saan makikita ang counseling schedule?", "Where can I find the counseling schedule?"],
  ],
  management: [
    ["report", "Saan makikita ang workforce at payroll reports?", "Where are the workforce and payroll reports?"],
    ["privacy", "Paano protektahan ang sensitibong HR data?", "How should I protect sensitive HR data?"],
  ],
  employee: [
    ["leave balance", "Paano ako mag-file ng leave?", "How do I submit my leave request?"],
    ["payslip", "Paano ko i-print ang payslip ko?", "How do I print my payslip?"],
    ["dtr", "Paano ako mag-request ng DTR correction?", "How do I request a DTR correction?"],
    ["pds", "Saan ko puwedeng i-update ang PDS ko?", "Where can I update my PDS?"],
  ],
  faculty_management: [
    ["faculty", "Saan makikita ang faculty profiles at teaching load?", "Where are faculty profiles and teaching loads?"],
    ["faculty", "Saan makikita ang faculty research at evaluations?", "Where are faculty research and evaluations?"],
  ],
};

export function getHrisGuideSuggestions(role: Role, language: GuideLanguage): string[] {
  return portalPrompts[role].map(([, filipino, english]) => language === "en" ? english : filipino);
}

const normalize=(value:string)=>value.toLocaleLowerCase("en").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^\p{L}\p{N}\s-]/gu," ").replace(/\s+/g," ").trim();
const stopWords=new Set(["how","what","where","when","can","could","please","help","the","for","with","about","my","ako","paano","saan","ano","po","ba","ang","ng","sa","ko","ko?"]);

function relevant(entry:GuideEntry,question:string):number {
  const keys=entry.keys.map(normalize);
  let score=0;
  for(const key of keys) {
    if(question.includes(key))score=Math.max(score,Math.min(1,key.length/16)+0.4);
    const terms=key.split(" ").filter(word=>word.length>2&&!stopWords.has(word));
    if(!terms.length)continue;
    const matches=terms.filter(term=>question.split(" ").some(token=>token===term||((term.length>=6||token.length>=6)&&((term.startsWith(token)&&token.length>=4)||(token.startsWith(term)&&term.length>=4)))));
    const overlap=matches.length/terms.length;
    score=Math.max(score,overlap*(terms.length===1?0.9:1));
  }
  return score;
}

export function getHrisGuideAnswer(input:string,role?:Role,language:GuideLanguage="fil"):HrisGuideAnswer {
  const question=normalize(input);
  if(!question)return {text:"I-type ang tanong mo tungkol sa PNU HRIS. Maaari rin akong mag-guide sa leave, payslip, DTR, PDS, recruitment, training, performance, awards, wellness, reports, o account access."};
  const suggestedTopic = role && portalPrompts[role].find(([, filipino, english]) =>
    normalize(filipino) === question || normalize(english) === question
  )?.[0];
  const scored=guides.map(entry=>({entry,score:entry.keys[0] === suggestedTopic ? 2 : relevant(entry,question)})).sort((a,b)=>b.score-a.score);
  const match=scored[0];
  if(!match||match.score<0.44) {
    if(language==="en") return {text:"Which PNU HRIS workflow do you need help with? Try asking about a payslip, leave request, DTR correction, or training nomination."};
    return {text:"Hindi ko pa matukoy kung aling PNU HRIS workflow ang tinutukoy mo. Subukan ang mas tiyak na tanong—halimbawa: “Paano magsumite ng leave?”, “Saan makita ang DTR?”, “Paano i-approve ang training nomination?”, o sabihin ang portal at hakbang kung saan ka na-stuck.\n\nSasagot ako batay sa demo workflows; para sa opisyal na patakaran o sensitibong account issue, kumpirmahin sa kaukulang PNU office."};
  }
  let page=match.entry.page;
  let pageLabel=match.entry.label;
  if(page==="profile"&&role&&role!=="employee") {
    page=role==="hr_records"?"hr-records":"employees";
    pageLabel=role==="hr_records"?"Buksan ang HR Records Office":"Buksan ang Employee Records";
  }
  if(page==="payslip"&&role&&role!=="employee") {page="payroll";pageLabel="Buksan ang Payroll Management";}
  if(page==="wellness"&&role&&role!=="employee"&&role!=="wellness") {page="hr-records";pageLabel="Buksan ang HR Records Office";}
  if(language==="en") return {text:englishAnswers[match.entry.keys[0]],page,pageLabel:page ? "Open related page" : undefined};
  return {text:match.entry.answer,page,pageLabel};
}
