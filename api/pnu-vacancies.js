// Read-only server-side sync from PNU's public Careers page.
// Never modifies HRIPS employee records or internal recruitment data.
const SOURCE = "https://www.pnu.edu.ph/careerspnu/";
const decode = (s) => s.replace(/&nbsp;|&#160;/gi," ").replace(/&amp;/gi,"&").replace(/&ndash;/gi,"–").replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n))).replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
const isoDate = (s) => { const d = new Date(s); return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0,10); };
export default async function handler(req,res) {
  res.setHeader("Cache-Control","s-maxage=3600, stale-while-revalidate=3600");
  if(req.method!=="GET") return res.status(405).json({error:"Method not allowed"});
  try {
    const upstream = await fetch(SOURCE,{headers:{"User-Agent":"PNU-HRIPS-Prototype/1.0 (public careers reference)"}});
    if(!upstream.ok) throw new Error("PNU careers page unavailable");
    const html = await upstream.text();
    const rows = [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
    const vacancies = [];
    for(const row of rows) {
      const cells = [...row[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>decode(m[1]));
      if(cells.length<8 || !/^\d+$/.test(cells[0])) continue;
      const [number,position,itemNo,grade,salary,department,posted,closing]=cells;
      const deadline=isoDate(closing), publicationDate=isoDate(posted);
      if(!position || !deadline || !publicationDate) continue;
      vacancies.push({id:"PNU-OFFICIAL-"+itemNo.replace(/[^A-Za-z0-9-]/g,""),position,department,salaryGrade:Number(grade)||0,employmentType:"Plantilla",slots:1,deadline,status:deadline>=new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Manila"})?"Open":"Closed",applicants:0,qualifications:"See official PNU Careers announcement for eligibility, qualifications and documentary requirements.",classification:"Plantilla",publicationStatus:"Published",publicationDate,requiredDocuments:[],officialSource:SOURCE,salary,itemNo});
    }
    if(!vacancies.length) return res.status(502).json({error:"No verifiable vacancy rows found; existing records were not changed.",source:SOURCE});
    return res.status(200).json({source:SOURCE,fetchedAt:new Date().toISOString(),vacancies});
  } catch(e) { return res.status(502).json({error:"Official PNU vacancies temporarily unavailable.",source:SOURCE}); }
}
