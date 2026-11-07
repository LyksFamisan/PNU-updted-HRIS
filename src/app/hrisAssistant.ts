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

export function getHrisGuideAnswer(input:string,role?:Role):HrisGuideAnswer {
  const question=normalize(input);
  if(!question)return {text:"I-type ang tanong mo tungkol sa PNU HRIS. Maaari rin akong mag-guide sa leave, payslip, DTR, PDS, recruitment, training, performance, awards, wellness, reports, o account access."};
  const scored=guides.map(entry=>({entry,score:relevant(entry,question)})).sort((a,b)=>b.score-a.score);
  const match=scored[0];
  if(!match||match.score<0.44) {
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
  return {text:match.entry.answer,page,pageLabel};
}

export const HRIS_GUIDE_SUGGESTIONS=[
  "Paano mag-file ng leave?",
  "Paano makita ang payslip at contributions?",
  "Paano magpa-correct ng DTR?",
  "Saan mag-update ng PDS?",
  "Paano mag-apply sa vacancy?",
  "Saan makita ang training nomination?",
  "Paano isumite ang IPCR o IDP?",
  "Anong portal ang dapat kong gamitin?",
];
