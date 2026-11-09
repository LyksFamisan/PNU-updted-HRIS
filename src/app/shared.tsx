import { useState, useEffect, useRef } from "react";
import {
  X, ArrowUpRight, ArrowDownRight, CheckCircle,
  Fingerprint, Sunrise, AlarmClock, Timer, CheckSquare, RefreshCw,
  Bot, MessageSquare, Send
} from "lucide-react";
import { getInitials } from "./data";
import { getHrisGuideAnswer, getHrisGuideSuggestions, type GuideLanguage, type GuidePortal } from "./hrisAssistant";
import type { AIMessage, Page, Role } from "./types";

export function ChartArea({ data, k1, k2, c1, c2, l1, l2 }: {
  data: { month: string; [k: string]: number | string }[];
  k1: string; k2: string; c1: string; c2: string; l1: string; l2: string;
}) {
  const W=500, H=190, PL=48, PR=10, PT=10, PB=30;
  const cW=W-PL-PR, cH=H-PT-PB;
  const all=data.flatMap(d=>[Number(d[k1]),Number(d[k2])]);
  const min=Math.min(...all)*0.96, max=Math.max(...all)*1.03;
  const x=(i:number)=>PL+(i/(data.length-1))*cW;
  const y=(v:number)=>PT+cH*(1-(v-min)/(max-min));
  const mkPath=(k:string)=>data.map((d,i)=>`${i===0?"M":"L"}${x(i).toFixed(1)},${y(Number(d[k])).toFixed(1)}`).join(" ");
  const mkArea=(k:string)=>`${mkPath(k)} L${x(data.length-1).toFixed(1)},${(PT+cH).toFixed(1)} L${x(0).toFixed(1)},${(PT+cH).toFixed(1)}Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      {[0,0.25,0.5,0.75,1].map((t,i)=>(
        <g key={i}>
          <line x1={PL} x2={W-PR} y1={PT+cH*(1-t)} y2={PT+cH*(1-t)} stroke="rgba(255,255,255,0.07)" strokeDasharray="3 3"/>
          {t%0.5===0&&<text x={PL-4} y={PT+cH*(1-t)+4} textAnchor="end" fontSize={10} fill="#6A8FBF">₱{(min+(max-min)*t).toFixed(1)}M</text>}
        </g>
      ))}
      {data.map((d,i)=><text key={i} x={x(i)} y={H-6} textAnchor="middle" fontSize={10} fill="#6A8FBF">{String(d.month)}</text>)}
      <path d={mkArea(k1)} fill={c1} fillOpacity={0.12}/><path d={mkPath(k1)} fill="none" stroke={c1} strokeWidth={2} strokeLinejoin="round"/>
      <path d={mkArea(k2)} fill={c2} fillOpacity={0.12}/><path d={mkPath(k2)} fill="none" stroke={c2} strokeWidth={2} strokeLinejoin="round"/>
      <g transform={`translate(${PL},${H-2})`}>
        <rect x={0} y={-9} width={14} height={5} rx={2} fill={c1} fillOpacity={0.8}/><text x={18} y={0} fontSize={10} fill="#6A8FBF">{l1}</text>
        <rect x={90} y={-9} width={14} height={5} rx={2} fill={c2} fillOpacity={0.8}/><text x={108} y={0} fontSize={10} fill="#6A8FBF">{l2}</text>
      </g>
    </svg>
  );
}

export function ChartStackedBar({ data }: { data:{day:string;present:number;late:number;absent:number}[] }) {
  const W=420, H=160, PL=40, PR=10, PT=8, PB=28;
  const cW=W-PL-PR, cH=H-PT-PB;
  const max=Math.max(...data.map(d=>d.present+d.late+d.absent))*1.05;
  const gap=cW/data.length; const bw=gap*0.62;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      {[0,0.5,1].map((t,i)=>(
        <g key={i}>
          <line x1={PL} x2={W-PR} y1={PT+cH*(1-t)} y2={PT+cH*(1-t)} stroke="rgba(255,255,255,0.07)" strokeDasharray="3 3"/>
          <text x={PL-4} y={PT+cH*(1-t)+4} textAnchor="end" fontSize={10} fill="#6A8FBF">{Math.round(max*t)}</text>
        </g>
      ))}
      {data.map((d,i)=>{
        const bx=PL+gap*i+(gap-bw)/2;
        const ph=cH*d.present/max; const lh=cH*d.late/max; const ah=cH*d.absent/max;
        return (
          <g key={i}>
            <rect x={bx} y={PT+cH-ph-lh-ah} width={bw} height={ah} rx={2} fill="#EF4444"/>
            <rect x={bx} y={PT+cH-ph-lh} width={bw} height={lh} fill="#F59E0B"/>
            <rect x={bx} y={PT+cH-ph} width={bw} height={ph} fill="#1B3A6B"/>
            <text x={bx+bw/2} y={H-6} textAnchor="middle" fontSize={10} fill="#6A8FBF">{d.day}</text>
          </g>
        );
      })}
      <g transform={`translate(${PL},${H-2})`}>
        <rect x={0} y={-9} width={10} height={6} rx={1} fill="#1B3A6B"/><text x={14} y={0} fontSize={9} fill="#6A8FBF">Present</text>
        <rect x={70} y={-9} width={10} height={6} rx={1} fill="#F59E0B"/><text x={84} y={0} fontSize={9} fill="#6A8FBF">Late</text>
        <rect x={120} y={-9} width={10} height={6} rx={1} fill="#EF4444"/><text x={134} y={0} fontSize={9} fill="#6A8FBF">Absent</text>
      </g>
    </svg>
  );
}

export function ChartDonut({ data, colors, ir=40, or:outerR=65 }: {
  data:{name:string;value:number}[]; colors:string[]; ir?:number; or?:number;
}) {
  const total=data.reduce((s,d)=>s+d.value,0);
  const cx=80, cy=80; let a=-Math.PI/2;
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      {data.map((d,i)=>{
        const sweep=2*Math.PI*d.value/total;
        const x1=cx+outerR*Math.cos(a), y1=cy+outerR*Math.sin(a);
        const ix1=cx+ir*Math.cos(a), iy1=cy+ir*Math.sin(a);
        a+=sweep;
        const x2=cx+outerR*Math.cos(a), y2=cy+outerR*Math.sin(a);
        const ix2=cx+ir*Math.cos(a), iy2=cy+ir*Math.sin(a);
        const lg=sweep>Math.PI?1:0;
        const path=`M${x1.toFixed(2)},${y1.toFixed(2)} A${outerR},${outerR} 0 ${lg},1 ${x2.toFixed(2)},${y2.toFixed(2)} L${ix2.toFixed(2)},${iy2.toFixed(2)} A${ir},${ir} 0 ${lg},0 ${ix1.toFixed(2)},${iy1.toFixed(2)} Z`;
        return <path key={i} d={path} fill={colors[i]} stroke="rgba(255,255,255,0.15)" strokeWidth={1.5}/>;
      })}
    </svg>
  );
}

const BADGE_MAP: Record<string,string> = {
  default:"bg-primary/15 text-primary border border-primary/20", success:"bg-emerald-500/15 text-emerald-400", warning:"bg-amber-500/15 text-amber-400",
  error:"bg-red-500/15 text-red-400", info:"bg-blue-500/15 text-blue-400", gold:"bg-amber-500/15 text-[#C8A84B] border border-amber-500/20",
  Active:"bg-emerald-500/15 text-emerald-400", Inactive:"bg-slate-500/15 text-slate-400", "On Leave":"bg-amber-500/15 text-amber-400",
  Suspended:"bg-red-500/15 text-red-400", Retired:"bg-slate-500/15 text-slate-400", Pending:"bg-amber-500/15 text-amber-400",
  Approved:"bg-emerald-500/15 text-emerald-400", Rejected:"bg-red-500/15 text-red-400", Released:"bg-blue-500/15 text-blue-400",
  Draft:"bg-slate-500/15 text-slate-400", "For Approval":"bg-purple-500/15 text-purple-400", Permanent:"bg-blue-500/15 text-blue-400",
  Contractual:"bg-orange-500/15 text-orange-400", COS:"bg-slate-500/15 text-slate-400", "Part-time":"bg-teal-500/15 text-teal-400",
  Present:"bg-emerald-500/15 text-emerald-400", Late:"bg-amber-500/15 text-amber-400", Absent:"bg-red-500/15 text-red-400", Holiday:"bg-blue-500/15 text-blue-400",
};

export function Badge({ children, variant="default", className="" }: { children: React.ReactNode; variant?: string; className?: string }) {
  return <span className={`inline-flex items-center rounded-full text-xs font-medium px-2.5 py-0.5 ${BADGE_MAP[variant]||BADGE_MAP.default} ${className}`}>{children}</span>;
}

export function Btn({ children, variant="primary", size="md", onClick, className="", disabled=false, type="button" }: {
  children: React.ReactNode; variant?: string; size?: string; onClick?: () => void;
  className?: string; disabled?: boolean; type?: "button"|"submit"|"reset";
}) {
  const V: Record<string,string> = {
    primary:"bg-[#C8A84B] text-[#0B1120] hover:bg-[#b8973d] font-semibold", secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
    ghost:"text-muted-foreground hover:bg-muted hover:text-foreground", destructive:"bg-red-600 text-white hover:bg-red-700",
    gold:"bg-[#C8A84B] text-[#0B1120] hover:bg-[#b8973d] font-semibold", outline:"border border-border bg-transparent text-foreground hover:bg-muted",
  };
  const S: Record<string,string> = { sm:"px-3 py-1.5 text-xs", md:"px-4 py-2 text-sm", lg:"px-6 py-2.5 text-sm" };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${V[variant]||V.primary} ${S[size]||S.md} ${className}`}>
      {children}
    </button>
  );
}

export function Av({ name, color="#1B3A6B", size="md" }: { name: string; color?: string; size?: string }) {
  const S: Record<string,string> = { sm:"w-7 h-7 text-xs", md:"w-9 h-9 text-sm", lg:"w-11 h-11 text-base", xl:"w-16 h-16 text-xl" };
  return (
    <div className={`${S[size]||S.md} rounded-full flex items-center justify-center font-semibold text-white shrink-0`} style={{ backgroundColor:color }}>
      {getInitials(name)}
    </div>
  );
}

export function Modal({ open, onClose, title, children, size="md" }: { open:boolean; onClose:()=>void; title:string; children:React.ReactNode; size?:string }) {
  if (!open) return null;
  const W: Record<string,string> = { sm:"max-w-md", md:"max-w-lg", lg:"max-w-2xl", xl:"max-w-4xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
      <div className={`relative rounded-2xl shadow-2xl w-full ${W[size]||W.md} max-h-[90vh] overflow-y-auto border border-border`} style={{backgroundColor:"#152044"}}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"><X className="w-4 h-4"/></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function StatCard({ label, value, sub, icon:Icon, trend, color="blue" }: {
  label:string; value:string; sub?:string; icon:React.ElementType; trend?:string; color?:string;
}) {
  const C: Record<string,{bg:string;ic:string;bd:string}> = {
    blue:{bg:"bg-blue-500/10",ic:"text-blue-400",bd:"border-blue-500/20"}, gold:{bg:"bg-amber-500/10",ic:"text-[#C8A84B]",bd:"border-amber-500/20"},
    green:{bg:"bg-emerald-500/10",ic:"text-emerald-400",bd:"border-emerald-500/20"}, red:{bg:"bg-red-500/10",ic:"text-red-400",bd:"border-red-500/20"},
    purple:{bg:"bg-purple-500/10",ic:"text-purple-400",bd:"border-purple-500/20"}, teal:{bg:"bg-teal-500/10",ic:"text-teal-400",bd:"border-teal-500/20"},
  };
  const c=C[color]||C.blue;
  return (
    <div className={`bg-card rounded-xl p-4 border ${c.bd} shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="mt-1 text-xl font-bold text-foreground font-mono leading-tight">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
          {trend && <p className={`mt-1 text-xs font-medium flex items-center gap-1 ${trend.startsWith("+")?"text-green-600":"text-red-500"}`}>{trend.startsWith("+")?<ArrowUpRight className="w-3 h-3"/>:<ArrowDownRight className="w-3 h-3"/>}{trend} vs last month</p>}
        </div>
        <div className={`${c.bg} p-2.5 rounded-xl ml-3 shrink-0`}><Icon className={`w-5 h-5 ${c.ic}`}/></div>
      </div>
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }: { title:string; subtitle?:string; action?:React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div><h1 className="text-xl font-bold text-foreground">{title}</h1>{subtitle&&<p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}</div>
      {action&&<div className="ml-4 shrink-0">{action}</div>}
    </div>
  );
}

export function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-medium"
      style={{ backgroundColor:"#152044", border:"1px solid rgba(200,168,75,0.3)" }}>
      <CheckCircle className="w-4 h-4 shrink-0" style={{ color:"#C8A84B" }}/>
      <span>{msg}</span>
      <button onClick={onClose} className="ml-2 text-white/60 hover:text-white transition-colors"><X className="w-3.5 h-3.5"/></button>
    </div>
  );
}

export function AttendanceClock() {
  const [timeIn, setTimeIn] = useState<string|null>(null);
  const [timeOut, setTimeOut] = useState<string|null>(null);
  const [now, setNow] = useState(new Date());
  const [scanning, setScanning] = useState(false);

  useEffect(() => { const t=setInterval(()=>setNow(new Date()),1000); return ()=>clearInterval(t); },[]);

  const handleClock = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const t=now.toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
      if (!timeIn) setTimeIn(t);
      else if (!timeOut) setTimeOut(t);
    }, 1500);
  };

  const elapsed = timeIn && !timeOut ? Math.floor((now.getTime() - new Date(`2024-08-14 ${timeIn}`).getTime())/1000/60) : null;

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-border">
      <div className="p-5 text-white" style={{ backgroundColor:"#1B3A6B" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5" style={{ color:"#C8A84B" }}/>
            <span className="text-sm font-semibold">Biometric Attendance</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>Online
          </div>
        </div>
        <p className="text-3xl font-bold font-mono text-center mt-2" style={{ color:"#C8A84B" }}>
          {now.toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
        </p>
        <p className="text-xs text-white/40 text-center mt-1">{now.toLocaleDateString("en-PH",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
      </div>
      <div className="bg-white p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={`rounded-xl p-3 border ${timeIn?"border-green-200 bg-green-50":"border-border bg-muted/30"}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <Sunrise className="w-3.5 h-3.5 text-green-600"/>
              <span className="text-xs font-medium text-muted-foreground">Time In</span>
            </div>
            <p className={`text-sm font-bold font-mono ${timeIn?"text-green-700":"text-muted-foreground"}`}>{timeIn||"--:--:-- --"}</p>
          </div>
          <div className={`rounded-xl p-3 border ${timeOut?"border-red-200 bg-red-50":"border-border bg-muted/30"}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <AlarmClock className="w-3.5 h-3.5 text-red-500"/>
              <span className="text-xs font-medium text-muted-foreground">Time Out</span>
            </div>
            <p className={`text-sm font-bold font-mono ${timeOut?"text-red-600":"text-muted-foreground"}`}>{timeOut||"--:--:-- --"}</p>
          </div>
        </div>
        {elapsed !== null && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 mb-3">
            <Timer className="w-4 h-4 text-blue-600"/>
            <span className="text-xs text-blue-700 font-medium">Work duration: {Math.floor(elapsed/60)}h {elapsed%60}m elapsed</span>
          </div>
        )}
        <button onClick={handleClock} disabled={!!timeOut||scanning}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${timeOut?"opacity-50 cursor-not-allowed bg-muted text-muted-foreground border border-border":""}`}
          style={timeOut||scanning?{}:{ backgroundColor: timeIn?"#DC2626":"#1B3A6B", color:"white" }}>
          {scanning ? <><RefreshCw className="w-4 h-4 animate-spin"/>Scanning...</>
            : timeOut ? <><CheckSquare className="w-4 h-4"/>Attendance Complete</>
            : timeIn ? <><AlarmClock className="w-4 h-4"/>Clock Out</>
            : <><Fingerprint className="w-4 h-4"/>Clock In</>}
        </button>
      </div>
    </div>
  );
}

const ASSISTANT_ROLE_LABEL:Record<GuidePortal,string>={
  careers:"PNU Careers",
  admin:"System Administrator",hr_records:"HR Records Office",timekeeping:"Timekeeping Staff",
  leave_management:"Leave Management Staff",payroll:"Payroll Staff",recruitment:"Recruitment Staff",
  training:"Training Staff",performance:"Performance Management Staff",rewards:"Rewards Unit",
  wellness:"Health and Wellness Office",management:"Management",employee:"Employee / Faculty",
  faculty_management:"Faculty Management Staff",
};

export function AIAssistantWidget({role,page,onNavigate}:{role:GuidePortal;page:Page;onNavigate?:(page:Page)=>void}) {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<GuideLanguage>("fil");
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const greeting: AIMessage = {
    id:"init", role:"bot",
    text:language==="en"
      ? `Hello! I’m the PNU HRIS Guide for ${ASSISTANT_ROLE_LABEL[role]}. Ask me how to find a feature, submit a request, or check its status. You’re on the ${role==="careers" ? "PNU Careers" : page} page.`
      : `Kumusta! Ako ang PNU HRIS Guide para sa ${ASSISTANT_ROLE_LABEL[role]}.\n\nMagtanong tungkol sa modules, pag-file, approval, status, o kung saan makikita ang isang feature. Sasagutin kita batay sa workflows ng system at ituturo sa kaugnay na page kapag available.\n\nNasa ${role==="careers" ? "PNU Careers" : page} page ka ngayon. Ang mga sagot ay para sa HRIS prototype; kumpirmahin sa PNU office ang opisyal na patakaran.`,
    time:""
  };
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timestamp=()=>new Date().toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit"});

  const sendMessage = (text: string) => {
    if (!text.trim()||typing) return;
    const sentAt=Date.now();
    setMessages(prev=>[...prev,{id:`user-${sentAt}`,role:"user",text:text.trim(),time:timestamp()}]);
    setInput(""); setTyping(true);
    setTimeout(()=>{
      const answer=getHrisGuideAnswer(text,role,language);
      setMessages(prev=>[...prev,{id:`bot-${sentAt}`,role:"bot",text:answer.text,time:timestamp(),page:answer.page,pageLabel:answer.pageLabel}]);
      setTyping(false);
    }, 700+Math.random()*700);
  };

  useEffect(()=>{ if(open) setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),100); },[messages,open]);
  useEffect(()=>{ if(open) setTimeout(()=>inputRef.current?.focus(),150); },[open]);

  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col items-end gap-3 select-none sm:bottom-6 sm:right-6">
      {open&&(
        <section aria-label="PNU HRIS Guide chat" className="flex flex-col bg-white rounded-2xl shadow-2xl border border-border overflow-hidden w-[min(94vw,390px)] h-[min(76vh,640px)]">
          <div className="flex items-center gap-2.5 px-4 py-3 shrink-0" style={{backgroundColor:"#1B3A6B"}}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{backgroundColor:"rgba(200,168,75,0.25)"}}>
              <Bot className="w-4 h-4" style={{color:"#C8A84B"}}/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white leading-none">PNU HRIS Guide</p>
              <p className="text-xs text-white/70 mt-0.5">{ASSISTANT_ROLE_LABEL[role]} · system guide</p>
            </div>
            <select aria-label="Assistant language" value={language} disabled={typing}
              onChange={event=>setLanguage(event.target.value as GuideLanguage)}
              className="rounded border border-white/40 bg-[#1B3A6B] px-2 py-1 text-xs text-white">
              <option value="fil">Filipino</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{backgroundColor:"#F8FAFC",scrollbarWidth:"none"}}>
            {[greeting, ...messages].map(m=>(
              <div key={m.id} className={`flex gap-2 ${m.role==="user"?"justify-end":"justify-start"}`}>
                {m.role==="bot"&&<div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{backgroundColor:"#1B3A6B"}}><Bot className="w-3 h-3 text-white"/></div>}
                <div className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${m.role==="user"?"rounded-tr-sm text-white":"bg-white border border-slate-300 text-slate-900 rounded-tl-sm shadow-sm"}`}
                  style={m.role==="user"?{backgroundColor:"#1B3A6B"}:{}}>
                  {m.text}
                  {m.role==="bot"&&m.page&&onNavigate&&<button onClick={()=>onNavigate(m.page!)} className="mt-2 flex w-full items-center justify-between gap-2 rounded-lg border border-[#1B3A6B]/30 bg-blue-50 px-2.5 py-2 text-left text-xs font-semibold text-[#1B3A6B] hover:bg-blue-100">{m.pageLabel||"Open related page"}<ArrowUpRight className="h-3.5 w-3.5 shrink-0"/></button>}
                  <p className={`text-[10px] mt-1.5 ${m.role==="user"?"text-white/70":"text-slate-600"}`}>{m.time}</p>
                </div>
              </div>
            ))}
            {typing&&(
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{backgroundColor:"#1B3A6B"}}><Bot className="w-3 h-3 text-white"/></div>
                <div className="bg-white border border-slate-300 rounded-2xl rounded-tl-sm px-3 py-2.5 flex gap-1 shadow-sm">
                  {[0,1,2].map(i=><div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{animationDelay:`${i*0.2}s`}}/>)}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>
          <div className="grid grid-cols-2 gap-1.5 px-3 py-2 bg-white border-t border-border shrink-0 max-h-28 overflow-y-auto">
            {getHrisGuideSuggestions(role,language).map(q=>(
              <button key={q} onClick={()=>sendMessage(q)} disabled={typing}
                className="text-[11px] px-2 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 transition-colors text-left text-slate-700 disabled:opacity-50">
                {q}
              </button>
            ))}
          </div>
          <div className="flex gap-2 px-3 pb-3 pt-2 bg-white border-t border-border shrink-0">
            <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
              aria-label="Ask the PNU HRIS Guide"
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage(input);}}}
              placeholder={language==="en" ? "Ask about PNU HRIS..." : "Magtanong tungkol sa PNU HRIS..."} className="min-w-0 flex-1 text-xs border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30 bg-muted/20"/>
            <button onClick={()=>sendMessage(input)} disabled={!input.trim()||typing}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 disabled:opacity-40 transition-colors"
              style={{backgroundColor:"#1B3A6B"}}>
              <Send className="w-3.5 h-3.5"/>
            </button>
          </div>
        </section>
      )}
      <button aria-label={open?"Close PNU HRIS Guide":"Open PNU HRIS Guide"} onClick={()=>setOpen(o=>!o)}
        className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative"
        style={{backgroundColor:"#1B3A6B"}}>
        {open?<X className="w-6 h-6 text-white"/>:<MessageSquare className="w-6 h-6 text-white"/>}
        {!open&&<div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"/>}
      </button>
    </div>
  );
}
