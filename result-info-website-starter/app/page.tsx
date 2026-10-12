import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import NotificationOptIn from "@/components/NotificationOptIn";

export const revalidate = 0;
type Game = {id:string;name:string;result_time:string;sort_order:number};
type Result = {id:string;game_id:string;result_date:string;result_value:string;published:boolean};
function dateLabel(d:string){return new Date(d+"T12:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});}
async function getData(){
  try {
    const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const [{data:games},{data:results}]=await Promise.all([
      sb.from("games").select("id,name,result_time,sort_order").eq("is_active",true).order("sort_order"),
      sb.from("results").select("id,game_id,result_date,result_value,published").eq("published",true).order("result_date",{ascending:false}).limit(1000)
    ]);
    return {games:(games||[]) as Game[],results:(results||[]) as Result[]};
  } catch { return {games:[] as Game[],results:[] as Result[]}; }
}
export default async function Home(){
 const {games,results}=await getData();
 const today=new Date().toLocaleDateString("en-CA");
 const current=games.map(g=>({game:g,result:results.find(r=>r.game_id===g.id&&r.result_date===today)}));
 const recent=[...results].slice(0,14);
 const month=new Date().toISOString().slice(0,7);
 const monthly=results.filter(r=>r.result_date.startsWith(month));
 return <><header className="nav"><div className="container navin"><Link href="/" className="brand"><span className="brandmark">R</span><span>RESULT<span style={{color:"var(--yellow)"}}>DESK</span></span></Link><nav className="navlinks"><a href="#home">Home</a><a href="#charts">Charts</a><a href="#history">History</a><Link href="/admin/login" className="secondary">Admin</Link></nav></div></header>
 <main id="home"><section className="hero"><div className="container"><span className="pill">● DAILY INFORMATION BOARD</span><h1>Daily Results. Clear History.</h1><p>Published result information and date-wise monthly records in one place.</p><div style={{marginTop:22}}><NotificationOptIn/></div></div></section>
 <section className="section"><div className="container"><div className="sectionhead"><div><div className="eyebrow muted">Updated by site administrator</div><h2>Today’s Results</h2></div><span className="muted small">{dateLabel(today)}</span></div>
 {games.length===0?<div className="notice">Database is not connected yet. Follow README setup steps to connect Supabase and publish records.</div>:<div className="result-grid">{current.map(({game,result})=><article className="result-card" key={game.id}><div className="result-top"><h3>{game.name}</h3><span className="status">{result?"PUBLISHED":"PENDING"}</span></div><div className="result-number">{result?.result_value||"— —"}</div><div className="result-bottom"><span>{game.result_time}</span><span>{result?"Result available":"Awaiting update"}</span></div></article>)}</div>}
 </div></section>
 <section className="section" id="charts" style={{background:"#101318",borderTop:"1px solid #252a32",borderBottom:"1px solid #252a32"}}><div className="container"><div className="sectionhead"><div><div className="eyebrow muted">Date-wise archive</div><h2>{new Date().toLocaleDateString("en-IN",{month:"long",year:"numeric"})} Monthly Chart</h2></div><span className="pill">{monthly.length} published records</span></div>
 <div className="tablewrap"><table><thead><tr><th>Date</th>{games.map(g=><th key={g.id}>{g.name}</th>)}</tr></thead><tbody>{Array.from({length:new Date().getDate()},(_,i)=>{const d=`${month}-${String(i+1).padStart(2,"0")}`;return <tr key={d}><td>{String(i+1).padStart(2,"0")}-{month.slice(5)}</td>{games.map(g=>{const r=results.find(x=>x.game_id===g.id&&x.result_date===d);return <td key={g.id}>{r?.result_value||"—"}</td>})}</tr>})}</tbody></table></div>
 </div></section>
 <section className="section" id="history"><div className="container"><div className="sectionhead"><div><div className="eyebrow muted">Latest published entries</div><h2>Recent Result History</h2></div></div><div className="tablewrap"><table><thead><tr><th>Date</th><th>Game</th><th>Published result</th></tr></thead><tbody>{recent.length?recent.map(r=><tr key={r.id}><td>{dateLabel(r.result_date)}</td><td>{games.find(g=>g.id===r.game_id)?.name||"Game"}</td><td style={{color:"var(--yellow)",fontWeight:800}}>{r.result_value}</td></tr>):<tr><td colSpan={3}><div className="empty">No results published yet.</div></td></tr>}</tbody></table></div><p className="seo-note" style={{marginTop:18}}>This website publishes informational result records and historical archives. Entries are maintained by the site administrator. Always verify information from an authoritative source.</p></div></section></main>
 <footer className="footer"><div className="container" style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}><span>© {new Date().getFullYear()} Result Desk</span><span>Informational website · No betting or payment features</span></div></footer></>;
}