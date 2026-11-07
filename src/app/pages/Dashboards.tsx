import { useState } from "react";
import {
  Users, Wallet, UserCheck, AlertTriangle, Calendar, Clock, BarChart2,
  GraduationCap, Target, Award, Heart, BookOpen, Settings, Shield,
  UserPlus, TrendingUp, CreditCard, AlertCircle, CheckCircle, Activity,
  FileText, ArrowRight, ClipboardList, Building2
} from "lucide-react";
import { Badge, Av, StatCard, SectionHeader, AttendanceClock, ChartArea, ChartDonut, ChartStackedBar } from "../shared";
import { fc, fd, computePayslip, monthlyPayrollData, employmentTypePieData, EMP_TYPE_COLORS, weekAttendanceData } from "../data";
import type { Role, Page, Employee, LeaveRequest, PayrollRun } from "../types";

function AdminDashboard({ setPage, employees, leaves, payrolls }: { setPage:(p:Page)=>void; employees:Employee[]; leaves:LeaveRequest[]; payrolls:PayrollRun[] }) {
  const pending = leaves.filter(l=>l.status==="Pending");
  const active = employees.filter(e=>e.status==="Active");
  const latestRun = payrolls.find(p=>p.status==="Released")||payrolls[0];
  const MODULES = [
    { icon:Users, label:"Employee Management", sub:`${employees.length} records`, page:"employees" as Page, color:"#2563EB" },
    { icon:UserPlus, label:"Recruitment", sub:"5 open vacancies", page:"recruitment" as Page, color:"#7C3AED" },
    { icon:Wallet, label:"Payroll", sub:"₱37.1M gross", page:"payroll" as Page, color:"#059669" },
    { icon:Calendar, label:"Leave Management", sub:`${pending.length} pending`, page:"leave" as Page, color:"#D97706" },
    { icon:GraduationCap, label:"Learning & Dev", sub:"5 programs", page:"training" as Page, color:"#0891B2" },
    { icon:Target, label:"Performance", sub:"IPCR/OPCR active", page:"performance" as Page, color:"#3B82F6" },
    { icon:Award, label:"Rewards", sub:"6 nominations", page:"rewards" as Page, color:"#C8A84B" },
    { icon:Heart, label:"Health & Wellness", sub:"7 records", page:"wellness" as Page, color:"#DC2626" },
    { icon:BookOpen, label:"Faculty Mgmt", sub:"9 faculty profiles", page:"faculty" as Page, color:"#6366F1" },
    { icon:BarChart2, label:"Reports", sub:"Analytics & exports", page:"reports" as Page, color:"#14B8A6" },
    { icon:Shield, label:"Audit Trail", sub:"Compliance logs", page:"audit" as Page, color:"#64748B" },
    { icon:Settings, label:"Settings", sub:"System config", page:"settings" as Page, color:"#475569" },
  ];
  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-5 text-white relative overflow-hidden" style={{background:"linear-gradient(135deg,#0D1F3C 0%,#1B3A6B 60%,#2563EB 100%)"}}>
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:"radial-gradient(circle at 80% 50%, #C8A84B 0%, transparent 60%)"}}/>
        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label:"Total Employees", value:employees.length, sub:`${active.length} active`, icon:Users },
            { label:"Monthly Payroll", value:"₱37.1M", sub:"Net ₱30.6M released", icon:Wallet },
            { label:"Attendance Rate", value:"96.7%", sub:"819 present today", icon:UserCheck },
            { label:"Pending Items", value:pending.length+2, sub:"Leaves + payroll", icon:AlertTriangle },
          ].map(s=>(
            <div key={s.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/10">
                <s.icon className="w-5 h-5 text-white"/>
              </div>
              <div>
                <p className="text-2xl font-bold text-white leading-none">{s.value}</p>
                <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
                <p className="text-[11px] font-medium mt-0.5" style={{color:"#C8A84B"}}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="text-sm font-semibold">Monthly Payroll Trend</h3><p className="text-xs text-muted-foreground">Gross vs Net (₱M) · FY 2024</p></div>
            <Badge variant="gold">FY 2024</Badge>
          </div>
          <div style={{height:190}}><ChartArea data={monthlyPayrollData} k1="gross" k2="net" c1="#3B82F6" c2="#C8A84B" l1="Gross Pay" l2="Net Pay"/></div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-1">Workforce by Type</h3>
          <p className="text-xs text-muted-foreground mb-3">Employment categories · Aug 2024</p>
          <div className="flex justify-center" style={{height:140}}><ChartDonut data={employmentTypePieData} colors={EMP_TYPE_COLORS} ir={40} or={65}/></div>
          <div className="space-y-1.5 mt-2">
            {employmentTypePieData.map((e,i)=>(
              <div key={e.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{backgroundColor:EMP_TYPE_COLORS[i]}}/><span className="text-muted-foreground">{e.name}</span></div>
                <span className="font-bold">{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Weekly Attendance (Aug 12–16, 2024)</h3>
            <button onClick={()=>setPage("attendance")} className="text-xs font-medium hover:underline" style={{color:"#C8A84B"}}>Full DTR</button>
          </div>
          <div style={{height:160}}><ChartStackedBar data={weekAttendanceData}/></div>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl p-4 text-white relative overflow-hidden" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/5 -mr-6 -mt-6"/>
            <p className="text-xs font-medium text-white/60">Latest Payroll Run</p>
            <p className="text-base font-bold mt-1 text-white truncate">{latestRun?.period}</p>
            <p className="text-2xl font-black mt-1" style={{color:"#C8A84B"}}>{latestRun?fc(latestRun.netPay):"—"}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-white/40">{latestRun?.employees} employees</span>
              <Badge variant={latestRun?.status||"Draft"}>{latestRun?.status}</Badge>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 shadow-sm">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Leave Summary</h3>
            {[{label:"Pending",v:pending.length,c:"text-amber-600"},{label:"Approved",v:leaves.filter(l=>l.status==="Approved").length,c:"text-green-600"},{label:"Rejected",v:leaves.filter(l=>l.status==="Rejected").length,c:"text-red-500"}].map(s=>(
              <div key={s.label} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <span className={`text-sm font-bold ${s.c}`}>{s.v}</span>
              </div>
            ))}
            <button onClick={()=>setPage("leave")} className="mt-2 text-xs font-medium hover:underline w-full text-left" style={{color:"#C8A84B"}}>Manage Leaves →</button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">System Module Launchpad</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {MODULES.map(m=>(
            <button key={m.label} onClick={()=>setPage(m.page)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-transparent hover:shadow-md transition-all text-center"
              onMouseEnter={e=>(e.currentTarget.style.backgroundColor=`${m.color}10`)}
              onMouseLeave={e=>(e.currentTarget.style.backgroundColor="")}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{backgroundColor:`${m.color}15`}}>
                <m.icon className="w-5 h-5" style={{color:m.color}}/>
              </div>
              <p className="text-[11px] font-semibold leading-tight text-foreground">{m.label}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{m.sub}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <h3 className="text-sm font-semibold">Recent Leave Requests</h3>
          <button onClick={()=>setPage("leave")} className="text-xs font-medium hover:underline" style={{color:"#C8A84B"}}>View All</button>
        </div>
        <div className="divide-y divide-border">
          {leaves.slice(0,5).map(lr=>(
            <div key={lr.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
              <Av name={lr.employeeName} size="sm"/>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{lr.employeeName}</p>
                <p className="text-xs text-muted-foreground">{lr.leaveType} · {lr.days} day{lr.days!==1?"s":""} · {fd(lr.startDate)}</p>
              </div>
              <Badge variant={lr.status}>{lr.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HRDashboard({ setPage, leaves, employees }: { setPage:(p:Page)=>void; leaves:LeaveRequest[]; employees:Employee[] }) {
  const pending = leaves.filter(l=>l.status==="Pending");
  const onLeave = leaves.filter(l=>l.status==="Approved"&&l.startDate<="2024-08-16"&&l.endDate>="2024-08-16");
  const HRMODULES = [
    { icon:UserPlus, label:"Recruitment", sub:"Post vacancies & track applicants", page:"recruitment" as Page, color:"#7C3AED" },
    { icon:GraduationCap, label:"Learning & Dev", sub:"Nominate for trainings", page:"training" as Page, color:"#0891B2" },
    { icon:Target, label:"Performance", sub:"Review IPCR/OPCR submissions", page:"performance" as Page, color:"#059669" },
    { icon:Award, label:"Rewards", sub:"Process award nominations", page:"rewards" as Page, color:"#C8A84B" },
    { icon:Heart, label:"Health & Wellness", sub:"Monitor employee wellness", page:"wellness" as Page, color:"#DC2626" },
    { icon:BookOpen, label:"Faculty Mgmt", sub:"Faculty profiles & evaluation", page:"faculty" as Page, color:"#6366F1" },
  ];
  const empByDept: Record<string,number> = {};
  employees.forEach(e=>{ empByDept[e.department]=(empByDept[e.department]||0)+1; });
  const topDepts = Object.entries(empByDept).sort((a,b)=>b[1]-a[1]).slice(0,5);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Employees" value={String(employees.length)} sub={`${employees.filter(e=>e.employmentType==="Permanent").length} permanent`} icon={Users} trend="+3" color="blue"/>
        <StatCard label="Pending Leaves" value={String(pending.length)} sub="Requires your action" icon={Calendar} color="red"/>
        <StatCard label="On Leave Today" value={String(onLeave.length)} sub="Approved absences" icon={Clock} color="gold"/>
        <StatCard label="Expiring Contracts" value="6" sub="Within 30 days" icon={AlertTriangle} color="purple"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <h3 className="text-sm font-semibold">Pending Leave Approvals</h3>
            <button onClick={()=>setPage("leave")} className="text-xs font-medium hover:underline" style={{color:"#C8A84B"}}>Manage All</button>
          </div>
          {pending.length===0
            ? <div className="py-10 text-center text-sm text-muted-foreground">All leave requests are processed</div>
            : <div className="divide-y divide-border">
                {pending.map(lr=>(
                  <div key={lr.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors">
                    <Av name={lr.employeeName} size="sm"/>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{lr.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{lr.leaveType} · {lr.days} day{lr.days!==1?"s":""}</p>
                      <p className="text-xs text-muted-foreground">{fd(lr.startDate)} — {fd(lr.endDate)}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={()=>setPage("leave")} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors">Approve</button>
                      <button onClick={()=>setPage("leave")} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-1">Employment Type</h3>
          <p className="text-xs text-muted-foreground mb-3">Workforce composition</p>
          <div className="flex justify-center" style={{height:150}}><ChartDonut data={employmentTypePieData} colors={EMP_TYPE_COLORS} ir={40} or={65}/></div>
          <div className="space-y-1.5 mt-3">
            {employmentTypePieData.map((e,i)=>(
              <div key={e.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{backgroundColor:EMP_TYPE_COLORS[i]}}/><span className="text-muted-foreground">{e.name}</span></div>
                <span className="font-bold">{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Headcount by Department (Top 5)</h3>
          {topDepts.map(([dept,count])=>(
            <div key={dept} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs truncate max-w-[220px]" title={dept}>{dept}</span>
                <span className="text-xs font-bold ml-2 shrink-0">{count}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{width:`${(count/employees.length)*100}%`,backgroundColor:"#C8A84B"}}/>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">HR Module Shortcuts</h3>
          <div className="grid grid-cols-2 gap-2">
            {HRMODULES.map(m=>(
              <button key={m.label} onClick={()=>setPage(m.page)}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-border hover:shadow-sm transition-all text-left"
                onMouseEnter={e=>(e.currentTarget.style.backgroundColor=`${m.color}08`)}
                onMouseLeave={e=>(e.currentTarget.style.backgroundColor="")}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor:`${m.color}15`}}>
                  <m.icon className="w-4 h-4" style={{color:m.color}}/>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold leading-tight">{m.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight truncate">{m.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <h3 className="text-sm font-semibold">Recent Employees (by Date Hired)</h3>
          <button onClick={()=>setPage("employees")} className="text-xs font-medium hover:underline" style={{color:"#C8A84B"}}>View All</button>
        </div>
        <div className="divide-y divide-border">
          {[...employees].sort((a,b)=>b.dateHired.localeCompare(a.dateHired)).slice(0,5).map(e=>(
            <div key={e.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
              <Av name={e.fullName} color={e.color} size="sm"/>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{e.fullName}</p>
                <p className="text-xs text-muted-foreground">{e.position} · {e.department}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-semibold">{fd(e.dateHired)}</p>
                <Badge variant={e.employmentType}>{e.employmentType}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PayrollDashboard({ setPage, payrolls, employees }: { setPage:(p:Page)=>void; payrolls:PayrollRun[]; employees:Employee[] }) {
  const forApproval = payrolls.filter(p=>p.status==="For Approval");
  const released = payrolls.filter(p=>p.status==="Released");
  const latestReleased = released[0];
  const ps = latestReleased ? (() => {
    const gross = latestReleased.grossPay;
    const gsis = Math.round(gross * 0.09);
    const ph = Math.min(Math.round(gross * 0.02), latestReleased.employees * 1800);
    const pi = latestReleased.employees * 100;
    return { gsis, ph, pi, tax: latestReleased.totalDeductions - gsis - ph - pi };
  })() : null;
  const REMITTANCE = [
    { agency:"GSIS", rate:"9% employee + 12% employer", due:"Aug 31, 2024", amount:"₱4,892,100", status:"Due" },
    { agency:"PhilHealth", rate:"2% employee + 2% employer", due:"Aug 31, 2024", amount:"₱1,527,480", status:"Due" },
    { agency:"Pag-IBIG", rate:"₱100/₱100 per employee", due:"Aug 31, 2024", amount:"₱169,800", status:"Due" },
    { agency:"BIR (EWT)", rate:"TRAIN Law brackets", due:"Sept 10, 2024", amount:"₱2,214,200", status:"Upcoming" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Latest Gross Pay" value="₱37.1M" sub="Aug 2024 · 1st Half" icon={Wallet} color="blue"/>
        <StatCard label="Net Disbursement" value="₱30.6M" sub={`${payrolls.find(p=>p.status==="For Approval")?.employees||849} employees`} icon={CreditCard} color="green"/>
        <StatCard label="For Approval" value={String(forApproval.length)} sub="Awaiting authorization" icon={AlertCircle} color="red"/>
        <StatCard label="YTD Payroll" value="₱297M" sub="Jan–Aug 2024" icon={TrendingUp} trend="+2.3%" color="gold"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="text-sm font-semibold">Monthly Payroll Trend</h3><p className="text-xs text-muted-foreground">Gross vs Net (₱M) · FY 2024</p></div>
            <button onClick={()=>setPage("reports")} className="text-xs font-medium hover:underline" style={{color:"#C8A84B"}}>Full Report</button>
          </div>
          <div style={{height:190}}><ChartArea data={monthlyPayrollData} k1="gross" k2="net" c1="#3B82F6" c2="#C8A84B" l1="Gross Pay" l2="Net Pay"/></div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-1">Deduction Breakdown</h3>
          <p className="text-xs text-muted-foreground mb-3">Latest released run</p>
          {ps&&latestReleased&&[
            { label:"GSIS (9%)", value:ps.gsis, color:"#3B82F6" },
            { label:"PhilHealth (2%)", value:ps.ph, color:"#2563EB" },
            { label:"Pag-IBIG (₱100)", value:ps.pi, color:"#7C3AED" },
            { label:"BIR Withholding", value:Math.max(ps.tax,0), color:"#DC2626" },
          ].map(d=>(
            <div key={d.label} className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">{d.label}</span>
                <span className="text-xs font-mono font-bold">{fc(d.value)}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{width:`${Math.min(100,(d.value/latestReleased.totalDeductions)*100)}%`,backgroundColor:d.color}}/>
              </div>
            </div>
          ))}
          <div className="border-t border-border pt-2 mt-3 flex justify-between">
            <span className="text-xs font-semibold">Total Deductions</span>
            <span className="text-xs font-bold font-mono text-red-600">{latestReleased?fc(latestReleased.totalDeductions):"—"}</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <h3 className="text-sm font-semibold">Payroll Runs — FY 2024</h3>
          <button onClick={()=>setPage("payroll")} className="text-xs font-medium hover:underline" style={{color:"#C8A84B"}}>Process Payroll</button>
        </div>
        <div className="divide-y divide-border">
          {payrolls.map(pr=>(
            <div key={pr.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors">
              <div className="w-2 h-2 rounded-full shrink-0" style={{backgroundColor:pr.status==="Released"?"#059669":pr.status==="Approved"?"#2563EB":pr.status==="For Approval"?"#D97706":"#94A3B8"}}/>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{pr.period}</p>
                <p className="text-xs text-muted-foreground">Pay Date: {pr.payDate} · {pr.employees} employees</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold font-mono">{pr.netPay>0?fc(pr.netPay):"(Draft)"}</p>
                <p className="text-xs text-muted-foreground">Net Pay</p>
              </div>
              <Badge variant={pr.status}>{pr.status}</Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="px-5 py-3.5 border-b border-border">
          <h3 className="text-sm font-semibold">Government Remittances — Due This Month</h3>
        </div>
        <div className="divide-y divide-border">
          {REMITTANCE.map(r=>(
            <div key={r.agency} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs text-white" style={{backgroundColor:"#C8A84B",color:"#0B1120"}}>{r.agency}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{r.agency} Remittance</p>
                <p className="text-xs text-muted-foreground">{r.rate} · Due: {r.due}</p>
              </div>
              <p className="text-sm font-bold font-mono shrink-0">{r.amount}</p>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 ${r.status==="Due"?"bg-amber-100 text-amber-700":"bg-blue-100 text-blue-700"}`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeptHeadDashboard({ setPage, employees, leaves }: { setPage:(p:Page)=>void; employees:Employee[]; leaves:LeaveRequest[] }) {
  const myDept = employees.filter(e=>e.department==="College of Teacher Education");
  const pending = leaves.filter(l=>l.department==="College of Teacher Education"&&l.status==="Pending");

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-5 relative overflow-hidden" style={{background:"linear-gradient(135deg,#0D1F3C,#1B3A6B)"}}>
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:"radial-gradient(circle at 70% 50%, #C8A84B, transparent 55%)"}}/>
        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-white/60 text-xs font-medium uppercase tracking-widest">Department Head Portal</p>
            <h2 className="text-xl font-bold text-white mt-1">College of Teacher Education</h2>
            <p className="text-white/50 text-sm mt-0.5">Semester 1, AY 2024–2025</p>
          </div>
          <div className="flex gap-6">
            {[{label:"Faculty & Staff",value:myDept.length},{label:"Active",value:myDept.filter(e=>e.status==="Active").length},{label:"Pending Approvals",value:pending.length}].map(s=>(
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Department Staff" value={String(myDept.length)} sub="CTE total headcount" icon={Users} color="blue"/>
        <StatCard label="Teaching Load" value="47 classes" sub="Active this semester" icon={BookOpen} color="green"/>
        <StatCard label="Leave Requests" value={String(pending.length)} sub="Pending your approval" icon={Calendar} color="red"/>
        <StatCard label="IPCR Submitted" value="4/4" sub="Q2 2024 complete" icon={Target} color="gold"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <h3 className="text-sm font-semibold">My Department — Faculty & Staff</h3>
            <button onClick={()=>setPage("employees")} className="text-xs font-medium hover:underline" style={{color:"#C8A84B"}}>View All</button>
          </div>
          <div className="divide-y divide-border">
            {myDept.map(e=>(
              <div key={e.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
                <Av name={e.fullName} color={e.color} size="sm"/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{e.fullName}</p>
                  <p className="text-xs text-muted-foreground">{e.rank} · SG-{e.salaryGrade}</p>
                </div>
                <Badge variant={e.status}>{e.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500"/>Pending Leaves
            </h3>
            {pending.length===0
              ? <p className="text-xs text-muted-foreground text-center py-4">No pending requests</p>
              : pending.map(lr=>(
                  <div key={lr.id} className="mb-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <p className="text-xs font-bold">{lr.employeeName.split(" ").slice(-2).join(" ")}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{lr.leaveType} · {lr.days} days</p>
                    <p className="text-xs text-muted-foreground">{fd(lr.startDate)}</p>
                    <div className="flex gap-1.5 mt-2">
                      <button onClick={()=>setPage("leave")} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-green-600 text-white">Approve</button>
                      <button onClick={()=>setPage("leave")} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-red-500 text-white">Reject</button>
                    </div>
                  </div>
                ))
            }
          </div>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <h3 className="text-sm font-semibold mb-2">Quick Actions</h3>
            {([
              [Target,"IPCR Ratings","performance","text-[#C8A84B]"],
              [GraduationCap,"Training Nominations","training","text-blue-600"],
              [Clock,"Attendance DTR","attendance","text-teal-600"],
              [BarChart2,"Department Reports","reports","text-green-600"],
            ] as const).map(([Icon,label,pg,cls])=>(
              <button key={label} onClick={()=>setPage(pg as Page)} className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted transition-colors text-left mb-0.5">
                <Icon className={`w-4 h-4 ${cls}`}/><span className="text-sm flex-1">{label}</span><ArrowRight className="w-3 h-3 text-muted-foreground"/>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-[#C8A84B]"/>Q2 2024 IPCR Submission Status — CTE</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {myDept.slice(0,4).map((e,i)=>{
            const rating = [4.6,4.3,3.9,4.1][i];
            const adj = rating>=4.5?"Outstanding":"Very Satisfactory";
            const done = i<3;
            return (
              <div key={e.id} className={`p-3 rounded-xl border ${done?"border-green-200 bg-green-50":"border-amber-200 bg-amber-50"}`}>
                <div className="flex items-center gap-1.5 mb-2">
                  {done?<CheckCircle className="w-3.5 h-3.5 text-green-600"/>:<Clock className="w-3.5 h-3.5 text-amber-600"/>}
                  <span className="text-[11px] font-semibold">{done?"Submitted":"Pending"}</span>
                </div>
                <p className="text-xs font-bold truncate">{e.fullName.split(". ").pop()?.split(",")[0]}</p>
                {done&&<p className="text-xs text-muted-foreground mt-1">{adj} · {rating.toFixed(2)}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EmployeeSelfDashboard({ employees, leaves }: { employees: Employee[]; leaves: LeaveRequest[] }) {
  const emp = employees[4] || employees[0];
  if (!emp) return null;
  const ps = computePayslip(emp.monthlySalary);
  const myLeaves = leaves.filter(l=>l.employeeId===emp.id);
  const ANNOUNCEMENTS = [
    { title:"Payslip Available", body:"August 2024 — 1st Half payslip is now available for download.", time:"2 hours ago", type:"success" },
    { title:"Upcoming Training", body:"'Strengthening Classroom Assessment Practices' on Aug 19–20. You are nominated.", time:"1 day ago", type:"info" },
    { title:"Leave Request Update", body:"Your Sick Leave request for July 22–23 is Pending approval.", time:"3 days ago", type:"warning" },
    { title:"PNU Wellness Program", body:"Zumba/Aerobics every Friday at 4:30 PM — PNU Sports Center. Join now!", time:"5 days ago", type:"info" },
  ];
  const typeIcon: Record<string,string> = { success:"✅", info:"📢", warning:"⚠️" };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl overflow-hidden shadow-sm border border-border">
        <div className="p-5 text-white relative" style={{background:"linear-gradient(135deg,#0D1F3C,#1B3A6B)"}}>
          <div className="absolute inset-0 opacity-10" style={{backgroundImage:"radial-gradient(circle at 85% 50%, #C8A84B, transparent 55%)"}}/>
          <div className="relative flex items-center gap-4">
            <Av name={emp.fullName} color={emp.color} size="xl"/>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white leading-tight">{emp.fullName}</h2>
              <p className="text-white/60 text-sm">{emp.position}</p>
              <p className="text-white/40 text-xs mt-0.5">{emp.department}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-white/10 text-white/80">SG-{emp.salaryGrade} Step {emp.step}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-white/10 text-white/80">{emp.employmentType}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{backgroundColor:"rgba(200,168,75,0.25)",color:"#C8A84B"}}>Employee No. {emp.employeeNo}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
          {[
            { label:"Gross Pay", value:fc(emp.monthlySalary), sub:"Monthly salary" },
            { label:"Net Pay", value:fc(ps.netPay), sub:"After deductions" },
            { label:"Vacation Leave", value:`${emp.vacationLeave} days`, sub:"Available balance" },
            { label:"Sick Leave", value:`${emp.sickLeave} days`, sub:"Available balance" },
          ].map(s=>(
            <div key={s.label} className="px-4 py-3 text-center">
              <p className="text-base font-bold text-foreground">{s.value}</p>
              <p className="text-[11px] font-medium text-muted-foreground">{s.label}</p>
              <p className="text-[10px] text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-4">Latest Payslip — July 2024 (1st Half)</h3>
            <div className="space-y-2">
              {[
                { label:"Basic Monthly Salary", value:fc(emp.monthlySalary), type:"gross" },
                { label:"GSIS (Personal Share — 9%)", value:`-${fc(ps.gsis)}`, type:"deduction" },
                { label:"PhilHealth (Employee Share — 2%)", value:`-${fc(ps.philhealth)}`, type:"deduction" },
                { label:"Pag-IBIG (Fixed — ₱100)", value:`-${fc(ps.pagibig)}`, type:"deduction" },
                { label:"BIR Withholding Tax (TRAIN Law)", value:`-${fc(ps.tax)}`, type:"deduction" },
              ].map(item=>(
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className={`text-sm font-mono font-semibold ${item.type==="deduction"?"text-red-500":"text-foreground"}`}>{item.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold">Net Pay</span>
                <span className="text-lg font-black font-mono text-green-600">{fc(ps.netPay)}</span>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border shadow-sm">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold">My Leave Requests</h3>
            </div>
            {myLeaves.length===0
              ? <p className="text-sm text-muted-foreground text-center py-6">No leave requests filed</p>
              : <div className="divide-y divide-border">
                  {myLeaves.map(lr=>(
                    <div key={lr.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20">
                      <Calendar className="w-4 h-4 text-muted-foreground shrink-0"/>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{lr.leaveType}</p>
                        <p className="text-xs text-muted-foreground">{fd(lr.startDate)} — {fd(lr.endDate)} · {lr.days} day{lr.days!==1?"s":""}</p>
                      </div>
                      <Badge variant={lr.status}>{lr.status}</Badge>
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>
        <div className="space-y-4">
          <AttendanceClock/>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <h3 className="text-sm font-semibold mb-3">Announcements</h3>
            <div className="space-y-2.5">
              {ANNOUNCEMENTS.map((a,i)=>(
                <div key={i} className="flex items-start gap-2">
                  <span className="text-base leading-none mt-0.5 shrink-0">{typeIcon[a.type]}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold">{a.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-snug">{a.body}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditorDashboard({ setPage, payrolls, employees }: { setPage:(p:Page)=>void; payrolls:PayrollRun[]; employees:Employee[] }) {
  const FINDINGS = [
    { id:"F-2024-001", desc:"GSIS exemption applied for EMP-003 without proper authorization documentation", severity:"High", status:"Open", date:"July 12, 2024", module:"Payroll" },
    { id:"F-2024-002", desc:"3 employees with dual employment type (Permanent + COS) — potential duplicate records", severity:"Medium", status:"Under Review", date:"July 25, 2024", module:"Employee Records" },
    { id:"F-2024-003", desc:"Leave without pay deduction missing from June 2024 — 2nd Half payroll run", severity:"Low", status:"Resolved", date:"June 30, 2024", module:"Payroll" },
  ];
  const TRAIL = [
    { action:"Payroll Released — Aug 2024 1st Half", user:"B.R.T. Castillo", time:"Aug 20, 2024 8:42 AM", module:"Payroll", flag:false },
    { action:"Employee Record Modified — EMP-010 Status Changed", user:"P.A.M. Flores", time:"July 15, 2024 10:15 AM", module:"Employees", flag:false },
    { action:"GSIS Deduction Override — EMP-003 (No Auth Docs)", user:"B.R.T. Castillo", time:"July 12, 2024 2:30 PM", module:"Payroll", flag:true },
    { action:"DTR Import — Aug 1st Half · 849 records via BIO-TIME", user:"admin", time:"Aug 1, 2024 7:30 AM", module:"Attendance", flag:false },
    { action:"Leave Approved — LR-2024-005 · 105-day Maternity Leave", user:"P.A.M. Flores", time:"July 15, 2024 9:00 AM", module:"Leave", flag:false },
    { action:"Payroll Status Changed: For Approval → Approved", user:"Dr. J.A.B. Reyes", time:"Aug 6, 2024 4:15 PM", module:"Payroll", flag:false },
  ];
  const releasedTotal = payrolls.filter(p=>p.status==="Released").reduce((s,p)=>s+p.netPay,0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Payroll Runs Audited" value={String(payrolls.filter(p=>p.status==="Released").length)} sub="FY 2024 to date" icon={FileText} color="blue"/>
        <StatCard label="COA Findings" value={String(FINDINGS.filter(f=>f.status!=="Resolved").length)} sub={`${FINDINGS.filter(f=>f.severity==="High").length} high severity`} icon={AlertTriangle} color="red"/>
        <StatCard label="Compliance Score" value="98.2%" sub="Above DBM threshold" icon={CheckCircle} color="green"/>
        <StatCard label="Total Released YTD" value={`₱${(releasedTotal/1000000).toFixed(1)}M`} sub="Jan–Aug 2024 net" icon={Wallet} color="gold"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">COA Findings & Observations</h3>
          <div className="space-y-3">
            {FINDINGS.map(f=>(
              <div key={f.id} className={`p-3 rounded-xl border ${f.severity==="High"?"border-red-200 bg-red-50":f.severity==="Medium"?"border-amber-100 bg-amber-50":"border-border bg-muted/20"}`}>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-mono text-muted-foreground">{f.id}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${f.severity==="High"?"bg-red-200 text-red-700":f.severity==="Medium"?"bg-amber-200 text-amber-700":"bg-blue-100 text-blue-700"}`}>{f.severity}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${f.status==="Resolved"?"bg-green-100 text-green-700":"bg-gray-100 text-gray-600"}`}>{f.status}</span>
                  <span className="text-[11px] text-muted-foreground ml-auto">{f.module}</span>
                </div>
                <p className="text-xs leading-snug">{f.desc}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{f.date}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Compliance Metrics</h3>
          {[
            { label:"GSIS Remittance Timeliness", pct:100, good:true },
            { label:"PhilHealth Remittance Timeliness", pct:100, good:true },
            { label:"Pag-IBIG Remittance Timeliness", pct:100, good:true },
            { label:"BIR Withholding Tax Accuracy", pct:99.1, good:true },
            { label:"Payroll Authorization Compliance", pct:94.3, good:false },
            { label:"DTR Documentation Completeness", pct:97.8, good:true },
          ].map(m=>(
            <div key={m.label} className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">{m.label}</span>
                <span className={`text-xs font-bold font-mono ${m.good&&m.pct>=98?"text-green-600":m.pct>=95?"text-amber-600":"text-red-600"}`}>{m.pct}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{width:`${m.pct}%`,backgroundColor:m.pct>=98?"#059669":m.pct>=95?"#D97706":"#DC2626"}}/>
              </div>
            </div>
          ))}
          <div className="mt-3 p-3 rounded-xl border border-green-200 bg-green-50">
            <p className="text-xs font-bold text-green-700">Overall COA Compliance: 98.2%</p>
            <p className="text-[11px] text-green-600 mt-0.5">Above the 95% DBM benchmark. 1 area requires attention.</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <h3 className="text-sm font-semibold">Payroll Verification — FY 2024</h3>
          <button onClick={()=>setPage("payroll")} className="text-xs font-medium hover:underline" style={{color:"#C8A84B"}}>View Payroll</button>
        </div>
        <div className="divide-y divide-border">
          {payrolls.map(pr=>(
            <div key={pr.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors">
              <div className={`w-2 h-2 rounded-full shrink-0 ${pr.status==="Released"?"bg-green-500":pr.status==="Approved"?"bg-blue-500":pr.status==="For Approval"?"bg-amber-500":"bg-gray-400"}`}/>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{pr.period}</p>
                <p className="text-xs text-muted-foreground">{pr.employees} employees · Created by {pr.createdBy.split(" ").slice(-2).join(" ")}</p>
              </div>
              <div className="text-right shrink-0 hidden sm:block">
                <p className="text-sm font-bold font-mono">{pr.netPay>0?fc(pr.netPay):"—"}</p>
                <p className="text-xs text-muted-foreground">Net Pay</p>
              </div>
              <Badge variant={pr.status}>{pr.status}</Badge>
              {pr.status==="Released"&&<CheckCircle className="w-4 h-4 text-green-500 shrink-0"/>}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <h3 className="text-sm font-semibold">Recent Audit Trail</h3>
          <button onClick={()=>setPage("audit")} className="text-xs font-medium hover:underline" style={{color:"#C8A84B"}}>Full Log</button>
        </div>
        <div className="divide-y divide-border">
          {TRAIL.map((item,i)=>(
            <div key={i} className={`flex items-start gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors ${item.flag?"bg-red-50/50":""}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.flag?"bg-red-100":"bg-blue-50"}`}>
                {item.flag?<AlertTriangle className="w-3.5 h-3.5 text-red-500"/>:<Activity className="w-3.5 h-3.5 text-[#C8A84B]"/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium">{item.action}</p>
                  {item.flag&&<Badge variant="error">⚠ Flagged</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">By: {item.user} · {item.module} · {item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Dashboard({ role, setPage, employees, payrolls, leaves }: { role:Role; setPage:(p:Page)=>void; employees:Employee[]; payrolls:PayrollRun[]; leaves:LeaveRequest[] }) {
  const titles: Record<Role,string> = {
    admin:"System Administrator Dashboard",
    hr_records:"HR Records Staff Dashboard",
    timekeeping:"Timekeeping Staff Dashboard",
    leave_management:"Leave Management Staff Dashboard",
    payroll:"Payroll Staff Dashboard",
    recruitment:"Recruitment Staff Dashboard",
    training:"Training Staff Dashboard",
    performance:"Performance Management Staff Dashboard",
    rewards:"Rewards and Recognition Staff Dashboard",
    wellness:"Health and Wellness Staff Dashboard",
    management:"Executive Dashboard",
    employee:"Employee / Faculty Self-Service Portal",
    faculty_management:"Faculty Management Staff Dashboard",
  };
  const subtitles: Record<Role,string> = {
    admin:"Full system overview · Philippine Normal University",
    hr_records:"Employee information, personnel records & workforce data",
    timekeeping:"Attendance, DTR records & timekeeping operations",
    leave_management:"Leave applications, approvals & employee leave balances",
    payroll:"Payroll processing, deductions & government remittances",
    recruitment:"Job vacancies, applicant pipeline & placement tracking",
    training:"L&D programs, nominations & staff development",
    performance:"IPCR/OPCR ratings, evaluations & performance reports",
    rewards:"Employee awards, recognition programs & nominations",
    wellness:"Employee health services, wellness programs & records",
    management:"Strategic KPIs, analytics & decision-support overview",
    employee:"Personal HR self-service for PNU employees and faculty",
    faculty_management:"Faculty profiles, teaching loads & academic records",
  };
  return (
    <div>
      <SectionHeader title={titles[role]||"Dashboard"} subtitle={subtitles[role]||"Philippine Normal University · PNU HRIPS"}/>
      {role==="admin"&&<AdminDashboard setPage={setPage} employees={employees} leaves={leaves} payrolls={payrolls}/>}
      {(role==="hr_records"||role==="timekeeping"||role==="leave_management"||role==="rewards"||role==="wellness"||role==="faculty_management")&&<HRDashboard setPage={setPage} leaves={leaves} employees={employees}/>}
      {role==="payroll"&&<PayrollDashboard setPage={setPage} payrolls={payrolls} employees={employees}/>}
      {role==="recruitment"&&<AdminDashboard setPage={setPage} employees={employees} leaves={leaves} payrolls={payrolls}/>}
      {role==="training"&&<HRDashboard setPage={setPage} leaves={leaves} employees={employees}/>}
      {role==="performance"&&<HRDashboard setPage={setPage} leaves={leaves} employees={employees}/>}
      {role==="management"&&<AuditorDashboard setPage={setPage} payrolls={payrolls} employees={employees}/>}
      {role==="employee"&&<EmployeeSelfDashboard employees={employees} leaves={leaves}/>}
    </div>
  );
}
