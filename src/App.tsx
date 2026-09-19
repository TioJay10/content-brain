import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "./supabaseClient";

type Page =
  | "dashboard" | "pesquisa" | "selecionados" | "ideias"
  | "historico" | "conta" | "planos" | "admin" | "livros"
  | "processamento" | "conhecimentos" | "usuarios";

const results = [
  { id: 1, type: "VENDAS", title: "Princípios fundamentais de vendas", book: "As 5 habilidades essenciais do relacionamento", author: "Dale Carnegie", page: 142, excerpt: "Ao tratar com pessoas, devemos nos lembrar de que estamos lidando com seres humanos...", note: "Aplicável à construção de confiança antes de apresentar uma proposta." },
  { id: 2, type: "LIDERANÇA", title: "Liderar pelo exemplo", book: "As 5 habilidades essenciais do relacionamento", author: "Dale Carnegie", page: 179, excerpt: "A liderança começa pela forma como o próprio líder se comporta diante das situações.", note: "Use este princípio para transformar liderança em comportamento observável." },
  { id: 3, type: "NEGÓCIOS", title: "Conheça profundamente seu cliente", book: "Biblioteca de negócios", author: "Biblioteca Content Brain", page: 88, excerpt: "Compreender necessidades reais muda a qualidade das decisões comerciais.", note: "Ajuda a construir perguntas melhores e propostas mais relevantes." }
];


type Knowledge = {
  id: string;
  titulo: string | null;
  tipo: string | null;
  tema: string | null;
  trecho: string | null;
  conteudo: string | null;
  analise_aplicacao: string | null;
  relevancia: number | null;
  pagina: number | null;
  livro: string;
  autor: string;
};

function Logo() {
  return <div className="app-logo"><span>content</span><b>brain</b></div>;
}

function SideNav({ page, setPage, admin = false, mobileOpen = false, onClose = () => {} }: { page: Page; setPage: (p: Page) => void; admin?: boolean; mobileOpen?: boolean; onClose?: () => void }) {
  const signOut = async () => { await supabase.auth.signOut(); window.location.reload(); };
  const navigate = (p: Page) => { setPage(p); onClose(); };
  const items = admin
    ? [["admin","Visão geral"],["livros","Biblioteca"],["processamento","Processamento"],["conhecimentos","Conhecimentos"],["usuarios","Usuários"]] as [Page,string][]
    : [["dashboard","Início"],["pesquisa","Pesquisar"],["selecionados","Selecionados"],["ideias","Ideias de conteúdo"],["historico","Histórico"]] as [Page,string][];
  return <>
    <div className={mobileOpen ? "mobile-nav-overlay open" : "mobile-nav-overlay"} onClick={onClose} />
    <aside className={mobileOpen ? "sidebar mobile-open" : "sidebar"}>
      <div className="mobile-menu-head"><Logo /><button className="mobile-menu-close" onClick={onClose} aria-label="Fechar menu">×</button></div>
      <div className="desktop-logo"><Logo /></div>
      <div className="side-section">{admin ? "ADMINISTRAÇÃO" : "CONTENT BRAIN"}</div>
      <nav>{items.map(([key,label]) => <button key={key} className={page===key ? "side-link active" : "side-link"} onClick={()=>navigate(key)}><span className="side-icon">{key==="pesquisa"?"⌕":key==="dashboard"||key==="admin"?"◫":key==="selecionados"?"□":key==="ideias"?"✦":key==="historico"?"◷":key==="livros"?"▤":key==="processamento"?"◌":key==="conhecimentos"?"≡":"○"}</span>{label}</button>)}</nav>
      {!admin && <div className="side-bottom">
        <button className={page==="planos" ? "side-link active" : "side-link"} onClick={()=>navigate("planos")}><span className="side-icon">◇</span>Planos</button>
        <button className={page==="conta" ? "side-link active" : "side-link"} onClick={()=>navigate("conta")}><span className="side-icon">○</span>Minha conta</button>
      </div>}
      <div className="sidebar-user"><div className="avatar">J</div><div><strong>{admin?"Administrador":"Minha conta"}</strong><small>{admin?"Acesso administrativo":"Acesso ativo"}</small></div><button className="sidebar-logout" title="Sair" onClick={signOut}>↪</button></div>
    </aside>
  </>;
}

function Topbar({ title, setPage, admin=false, onMenu }: { title: string; setPage: (p:Page)=>void; admin?: boolean; onMenu?: () => void }) {
  const [creditos,setCreditos]=useState(20);
  useEffect(()=>{if(admin)return;(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;const {data}=await supabase.from("usuarios").select("creditos,plano,plano_expira_em").eq("id",user.id).maybeSingle();if(data)setCreditos(data.creditos??0);})()},[admin]);
  return <header className="topbar"><button className="mobile-menu-button" onClick={onMenu} aria-label="Abrir menu">☰</button><div><div className="breadcrumb">CONTENT BRAIN / <span>{title.toUpperCase()}</span></div><h1>{title}</h1></div>{admin?<div className="admin-top-badge"><span>●</span> Administrador</div>:<button className="credit-pill" onClick={()=>setPage("planos")}><span className="credit-icon">✦</span><span><b>{creditos}</b> créditos</span><i>Adicionar</i></button>}</header>;
}

function UserLayout({ page, setPage, children }: {page:Page;setPage:(p:Page)=>void;children:ReactNode}) {
  const [mobileMenu,setMobileMenu]=useState(false);
  const titles: Record<string,string> = {dashboard:"Início",pesquisa:"Pesquisar conhecimento",selecionados:"Conhecimentos selecionados",ideias:"Ideias de conteúdo",historico:"Histórico",conta:"Minha conta",planos:"Planos"};
  return <div className="app-shell"><SideNav page={page} setPage={setPage} mobileOpen={mobileMenu} onClose={()=>setMobileMenu(false)}/><main className="workspace"><Topbar title={titles[page] || "Content Brain"} setPage={setPage} onMenu={()=>setMobileMenu(true)}/>{children}</main></div>;
}

function AdminLayout({ page, setPage, children }: {page:Page;setPage:(p:Page)=>void;children:React.ReactNode}) {
  const [mobileMenu,setMobileMenu]=useState(false);
  const titles: Record<string,string> = {admin:"Visão geral",livros:"Biblioteca",processamento:"Processamento",conhecimentos:"Conhecimentos",usuarios:"Usuários"};
  return <div className="app-shell"><SideNav page={page} setPage={setPage} admin mobileOpen={mobileMenu} onClose={()=>setMobileMenu(false)}/><main className="workspace"><Topbar title={titles[page] || "Administração"} setPage={setPage} admin onMenu={()=>setMobileMenu(true)}/>{children}</main></div>;
}

function Dashboard({setPage}:{setPage:(p:Page)=>void}) {
 const [stats,setStats]=useState({creditos:20,plano:"gratuito",pesquisas:0,selecionados:0});
 useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;const [{data:u},{count:p},{count:s}]=await Promise.all([
   supabase.from("usuarios").select("creditos,plano,plano_expira_em").eq("id",user.id).maybeSingle(),
   supabase.from("pesquisas").select("id",{count:"exact",head:true}).eq("usuario_id",user.id),
   supabase.from("selecoes").select("id",{count:"exact",head:true}).eq("usuario_id",user.id)
 ]);setStats({creditos:u?.creditos??0,plano:u?.plano??"gratuito",pesquisas:p??0,selecionados:s??0});})()},[]);
 return <div className="content">
   <section className="welcome"><div><span className="eyebrow">SEU ESPAÇO DE CONHECIMENTO</span><h2>Olá, seja bem-vindo.</h2><p>Pesquise na biblioteca e transforme conhecimento em aplicação.</p></div><button className="primary-large" onClick={()=>setPage("pesquisa")}>Nova pesquisa <b>→</b></button></section>
   <div className="stats"><div><small>CRÉDITOS DISPONÍVEIS</small><strong>{stats.creditos}</strong><span>Plano {stats.plano}</span></div><div><small>PESQUISAS REALIZADAS</small><strong>{stats.pesquisas}</strong><span>{stats.pesquisas?"Pesquisas registradas":"Comece sua primeira pesquisa"}</span></div><div><small>SELECIONADOS</small><strong>{stats.selecionados}</strong><span>{stats.selecionados?"Conhecimentos guardados":"Nenhum conhecimento ainda"}</span></div></div>
   <div className="dashboard-grid"><section className="panel main-search"><div className="panel-label">PESQUISA RÁPIDA</div><h3>O que você quer aprender?</h3><div className="big-search" onClick={()=>setPage("pesquisa")}><span>⌕</span><span>Digite um tema, técnica ou princípio...</span><kbd>⌘ K</kbd></div><div className="suggestions"><span>Ex.: Técnicas de vendas</span><span>Fechamento de vendas</span><span>Princípios de liderança</span></div></section><section className="panel"><div className="panel-label">COMECE POR AQUI</div><div className="mini-step"><b>01</b><div><strong>Pesquise</strong><p>Encontre conhecimento relevante.</p></div></div><div className="mini-step"><b>02</b><div><strong>Selecione</strong><p>Organize os melhores resultados.</p></div></div><div className="mini-step"><b>03</b><div><strong>Aplique</strong><p>Transforme conhecimento em conteúdo.</p></div></div></section></div>
 </div>
}

function Pesquisa({setPage, selected, setSelected, initialQuery, autoRun}:{setPage:(p:Page)=>void; selected:Knowledge[]; setSelected:(items:Knowledge[])=>void; initialQuery?:string; autoRun?:boolean}) {
 const [query,setQuery]=useState(initialQuery||"Técnicas de vendas");
 const [items,setItems]=useState<Knowledge[]>([]);
 const [loading,setLoading]=useState(false);
 const [searched,setSearched]=useState(false);
 const [error,setError]=useState("");
 const [filterOpen,setFilterOpen]=useState(false);
 const [filterType,setFilterType]=useState("todos");
 const [sortMode,setSortMode]=useState("relevantes");

 const mapResults=(data:any[]) => (data||[]).map((r:any)=>({
   id:r.id,titulo:r.titulo,tipo:r.tipo,tema:r.tema,trecho:r.trecho,conteudo:r.conteudo,
   analise_aplicacao:r.analise_aplicacao,relevancia:r.relevancia,pagina:r.pagina??null,
   livro:r.livro??"Livro não informado",autor:r.autor??"Autor não informado"
 })) as Knowledge[];

 const runSearch=async(consume=true)=>{
   if(loading)return;
   setLoading(true); setError("");
   const term=query.trim();
   if(!term){setError("Digite um tema, técnica ou princípio para pesquisar.");setSearched(false);setLoading(false);return;}
   try{
     let pesquisaId:string|undefined;
     if(consume){
       const {data:consumo,error:consumoError}=await supabase.rpc("consumir_credito_e_registrar_pesquisa",{p_consulta:term,p_resultados:0});
       if(consumoError){
         if(consumoError.message?.includes("CRÉDITOS_INSUFICIENTES")) setError("Você ficou sem créditos. Escolha um plano para continuar pesquisando.");
         else setError(consumoError.message||"Não foi possível iniciar a pesquisa agora.");
         setItems([]);setSearched(false);return;
       }
       pesquisaId=consumo?.pesquisa_id as string|undefined;
     }
     const {data,error:searchError}=await supabase.rpc("buscar_conhecimentos",{p_consulta:term});
     if(searchError){setError(searchError.message||"Não foi possível carregar os conhecimentos.");setItems([]);setSearched(true);return;}
     const mapped=mapResults(data||[]);
     setItems(mapped);setSearched(true);
     if(pesquisaId) await supabase.from("pesquisas").update({resultados:mapped.length}).eq("id",pesquisaId);
   }catch(e:any){setError(e?.message||"Não foi possível concluir a pesquisa.");setItems([]);setSearched(true);}
   finally{setLoading(false);}
 };

 useEffect(()=>{
   if(autoRun && initialQuery){setQuery(initialQuery);void runSearch(false);}
 },[initialQuery,autoRun]);

 const visibleItems=items
   .filter(r=>filterType==="todos"||((r.tipo||"").trim().toLowerCase()==filterType.toLowerCase()))
   .sort((a,b)=>sortMode==="recentes" ? (Number(b.pagina||0)-Number(a.pagina||0)) : sortMode==="alfabetico" ? String(a.titulo||a.tema||"").localeCompare(String(b.titulo||b.tema||"")) : Number(b.relevancia||0)-Number(a.relevancia||0));

 const filterTypes=Array.from(new Set(items.map(r=>(r.tipo||"CONHECIMENTO").trim()).filter(Boolean)));

 return <div className="content">
   <section className="search-page-head">
     <div className="search-input-large"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")runSearch(true)}} placeholder="Digite um tema, técnica ou princípio..." /><button onClick={()=>{setQuery("");setItems([]);setSearched(false);setError("");setFilterOpen(false)}}>×</button></div>
     <button className="primary-large" onClick={()=>runSearch(true)}>{loading?"Buscando...":"Pesquisar"}</button>
   </section>
   <div className="results-toolbar">
     <span>{searched ? visibleItems.length+" conhecimentos encontrados" : "Pesquise na biblioteca"}</span>
     <div className="results-tools">
       <button className={filterOpen?"tool-button active":"tool-button"} onClick={()=>setFilterOpen(v=>!v)}>Filtrar⌄</button>
       <button className="tool-button" onClick={()=>setSortMode(v=>v==="relevantes"?"recentes":v==="recentes"?"alfabetico":"relevantes")}>{
         sortMode==="relevantes"?"Mais relevantes⌄":sortMode==="recentes"?"Mais recentes⌄":"Alfabético⌄"
       }</button>
     </div>
   </div>
   {filterOpen&&searched&&<div className="search-filters">
     <button className={filterType==="todos"?"filter-chip active":"filter-chip"} onClick={()=>setFilterType("todos")}>Todos</button>
     {filterTypes.map(t=><button key={t} className={filterType.toLowerCase()===t.toLowerCase()?"filter-chip active":"filter-chip"} onClick={()=>setFilterType(t)}>{t}</button>)}
   </div>}
   {error&&<div className="search-error">{error}</div>}
   {!searched&&<section className="search-empty"><div className="empty-mark">⌕</div><h2>O que você quer aprender?</h2><p>Digite um tema, técnica ou princípio para encontrar conhecimentos organizados na biblioteca.</p></section>}
   {searched&&!loading&&visibleItems.length===0&&!error&&<section className="search-empty"><div className="empty-mark">○</div><h2>Nenhum conhecimento encontrado</h2><p>Não encontramos resultados para “{query}” com os filtros atuais.</p></section>}
   {loading&&<div className="search-empty"><h2>Consultando a biblioteca...</h2><p>Estamos buscando nos conhecimentos cadastrados no Supabase.</p></div>}
   <div className="results-list">{visibleItems.map(r=>{
     const isSelected=selected.some(x=>x.id===r.id);
     return <article className={isSelected?"knowledge-card selected":"knowledge-card"} key={r.id} onClick={async()=>{
       const next=isSelected?selected.filter(x=>x.id!==r.id):[...selected,r];setSelected(next);
       const {data:{user}}=await supabase.auth.getUser();
       if(user){if(isSelected) await supabase.from("selecoes").delete().eq("usuario_id",user.id).eq("conhecimento_id",r.id);else await supabase.from("selecoes").insert({usuario_id:user.id,conhecimento_id:r.id});}
     }}>
       <div className="check">{isSelected?"✓":""}</div><div className="knowledge-main">
         <div className="knowledge-meta"><span>{r.tipo||"CONHECIMENTO"}</span><span>•</span><span>{r.livro}</span>{r.pagina&&<><span>•</span><span>p. {r.pagina}</span></>}</div>
         <h3>{r.titulo||r.tema||"Conhecimento"}</h3><p className="excerpt">“{r.trecho||r.conteudo||"Conteúdo não informado."}”</p>
         {r.analise_aplicacao&&<div className="application"><b>NOTA DE APLICAÇÃO</b><span>{r.analise_aplicacao}</span></div>}
         <small>{r.autor}</small>
       </div><span className="card-arrow">↗</span>
     </article>;
   })}</div>
   {searched&&visibleItems.length>0&&<div className="more-results"><button onClick={()=>runSearch(true)}>+ Procurar mais resultados</button><span>{selected.length} selecionado{selected.length!==1?"s":""}</span></div>}
   {selected.length>0&&<div className="selection-bar"><span><b>{selected.length}</b> conhecimentos selecionados</span><button onClick={()=>setPage("selecionados")}>Revisar seleção →</button></div>}
 </div>;
}

function Selecionados({setPage, selected, setSelected}:{setPage:(p:Page)=>void; selected:Knowledge[]; setSelected:(items:Knowledge[])=>void}) {
 const [copied,setCopied]=useState(false);
 const [clearConfirm,setClearConfirm]=useState(false);
 const [loading,setLoading]=useState(true);

 useEffect(()=>{(async()=>{
   const {data:{user}}=await supabase.auth.getUser();
   if(!user){setLoading(false);return;}
   const {data,error}=await supabase.from("selecoes").select("id,conhecimento_id,criado_em,conhecimentos(id,titulo,tipo,tema,trecho,conteudo,analise_aplicacao,relevancia,pagina_id,livro_id,paginas(numero_pagina),livros(titulo,autor))").eq("usuario_id",user.id).order("criado_em",{ascending:false});
   if(!error){
     const mapped=(data||[]).map((x:any)=>{const r=x.conhecimentos;return r?{id:r.id,titulo:r.titulo,tipo:r.tipo,tema:r.tema,trecho:r.trecho,conteudo:r.conteudo,analise_aplicacao:r.analise_aplicacao,relevancia:r.relevancia,pagina:r.paginas?.numero_pagina??null,livro:r.livros?.titulo??"Livro não informado",autor:r.livros?.autor??"Autor não informado"}:null}).filter(Boolean) as Knowledge[];
     setSelected(mapped);
   }
   setLoading(false);
 })()},[setSelected]);

 const copySelected=async()=>{ const text=selected.map((r,i)=>["["+(i+1)+"] "+(r.titulo||r.tema||"Conhecimento"),"Tipo: "+(r.tipo||"Conhecimento"),"Livro: "+r.livro,"Autor: "+r.autor,"Página: "+(r.pagina??"não informada"),"Trecho: “"+(r.trecho||r.conteudo||"")+"”","Nota de aplicação: "+(r.analise_aplicacao||"não informada")].join("\n")).join("\n\n"); try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),1800); } catch {} };
 const exportPdf=async()=>{if(!selected.length)return;const {data,error}=await supabase.rpc("consumir_credito_exportacao",{p_itens:selected.length});if(error){setCopied(false);alert(error.message?.includes("CRÉDITOS_INSUFICIENTES")?"Você ficou sem créditos. Escolha um plano para exportar.":error.message);return;}const win=window.open("","_blank");if(!win)return;const esc=(s:string)=>s.replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[m]||m));win.document.write("<!doctype html><html><head><title>Content Brain — Conhecimentos selecionados</title><style>body{font-family:Arial,sans-serif;color:#17171b;max-width:800px;margin:40px auto;padding:0 25px}h1{font-size:25px}h2{font-size:17px;margin-bottom:7px}.meta{font-size:11px;color:#666;margin-bottom:14px}.item{border-bottom:1px solid #ddd;padding:0 0 25px;margin-bottom:25px}.quote{font-size:13px;line-height:1.7}.note{background:#f5f3ff;border-left:3px solid #635bff;padding:12px;font-size:12px;line-height:1.6}small{color:#888}</style></head><body><h1>Content Brain</h1><p>Conhecimentos selecionados</p>"+selected.map((r,i)=>"<div class='item'><h2>"+(i+1)+". "+esc(r.titulo||r.tema||"Conhecimento")+"</h2><div class='meta'>"+esc(r.tipo||"Conhecimento")+" • "+esc(r.livro)+" • "+esc(r.autor)+" • p. "+esc(String(r.pagina??"não informada"))+"</div><p class='quote'>“"+esc(r.trecho||r.conteudo||"")+"”</p>"+(r.analise_aplicacao?"<div class='note'><b>NOTA DE APLICAÇÃO</b><br>"+esc(r.analise_aplicacao)+"</div>":"")+"</div>").join("")+"</body></html>");win.document.close();win.focus();setTimeout(()=>win.print(),350);};
 const clear=async()=>{if(!window.confirm("Tem certeza que deseja limpar todos os conhecimentos selecionados? Esta ação não pode ser desfeita."))return;const {data:{user}}=await supabase.auth.getUser();if(user) await supabase.from("selecoes").delete().eq("usuario_id",user.id);setSelected([]);setClearConfirm(false);};
 const remove=async(id:string)=>{const {data:{user}}=await supabase.auth.getUser();if(user) await supabase.from("selecoes").delete().eq("usuario_id",user.id).eq("conhecimento_id",id);setSelected(selected.filter(x=>x.id!==id));};

 return <div className="content"><section className="section-intro"><div><span className="eyebrow">SUA CURADORIA</span><h2>Conhecimentos selecionados.</h2><p>Revise, organize e copie os conhecimentos que você quer levar para o seu trabalho.</p></div></section>
 {loading?<section className="empty-selection"><h2>Carregando seleção...</h2><p>Recuperando seus conhecimentos salvos.</p></section>:selected.length===0 ? <section className="empty-selection"><div className="empty-mark">□</div><h2>Nenhum conhecimento selecionado</h2><p>Durante uma pesquisa, clique nos conhecimentos que deseja guardar. Eles aparecerão aqui para revisão e cópia.</p><button className="primary-large" onClick={()=>setPage("pesquisa")}>Voltar para pesquisa <b>→</b></button></section> :
 <><div className="selected-actions"><span className="selected-count"><b>{selected.length}</b><span>conhecimento{selected.length!==1?"s":""} selecionado{selected.length!==1?"s":""}</span></span><div className="selected-action-buttons"><button className="secondary-action" onClick={()=>setPage("pesquisa")}>← Voltar para pesquisa</button><button className="secondary-action" onClick={clear}>Limpar seleção</button><button className="primary-large" onClick={copySelected}>{copied?"Copiado ✓":"Copiar conhecimentos"}</button><button className="secondary-action" onClick={exportPdf}>Exportar PDF</button></div></div>
 <div className="results-list">{selected.map(r=><article className="knowledge-card selected" key={r.id}><div className="check">✓</div><div className="knowledge-main"><div className="knowledge-meta"><span>{r.tipo||"CONHECIMENTO"}</span><span>•</span><span>{r.livro}</span>{r.pagina&&<><span>•</span><span>p. {r.pagina}</span></>}</div><h3>{r.titulo||r.tema||"Conhecimento"}</h3><p className="excerpt">“{r.trecho||r.conteudo||""}”</p>{r.analise_aplicacao&&<div className="application"><b>NOTA DE APLICAÇÃO</b><span>{r.analise_aplicacao}</span></div>}<small>{r.autor}</small></div><button className="remove-selected" title="Remover dos selecionados" aria-label={"Remover "+(r.titulo||r.tema||"conhecimento")+" dos selecionados"} onClick={()=>remove(r.id)}>×</button></article>)}</div></>}
 </div>;
}

function Ideas({setPage}:{setPage:(p:Page)=>void}) {
 const ideas=["5 erros de quem tenta vender sem entender o cliente","O princípio de liderança que muda a forma de conduzir uma equipe","Como transformar uma técnica de vendas em uma conversa natural"];
 return <div className="content"><div className="section-intro"><div><span className="eyebrow">A PARTIR DO CONHECIMENTO</span><h2>Ideias para transformar conhecimento em conteúdo.</h2><p>Use os conhecimentos selecionados como ponto de partida.</p></div></div><div className="idea-grid">{ideas.map((x,i)=><article className="idea-card" key={x}><span>0{i+1}</span><h3>{x}</h3><p>Uma possibilidade de conteúdo construída a partir dos conhecimentos da biblioteca.</p><button onClick={()=>setPage("selecionados")}>Ver conhecimentos →</button></article>)}</div></div>
}

function Historico({setPage,setHistoryQuery}:{setPage:(p:Page)=>void;setHistoryQuery:(q:string)=>void}){
 const [items,setItems]=useState<any[]>([]); const [loading,setLoading]=useState(true);
 useEffect(()=>{(async()=>{const {data}=await supabase.from("pesquisas").select("id,consulta,resultados,credito_consumido,criado_em").order("criado_em",{ascending:false}).limit(50);setItems(data||[]);setLoading(false);})()},[]);
 const reopen=(consulta:string)=>{setHistoryQuery(consulta);setPage("pesquisa");};
 return <div className="content"><div className="panel history-panel"><div className="panel-label">ATIVIDADE RECENTE</div>{loading?<div className="empty-row"><span>◌</span><div><strong>Carregando histórico...</strong><p>Consultando suas pesquisas.</p></div></div>:items.length===0?<div className="empty-row"><span>◷</span><div><strong>Nenhuma atividade ainda</strong><p>Suas pesquisas aparecerão aqui.</p></div></div>:items.map(x=><button className="empty-row history-item" key={x.id} onClick={()=>reopen(x.consulta)}><span>⌕</span><div><strong>{x.consulta}</strong><p>{x.resultados} resultado(s) • {new Date(x.criado_em).toLocaleString("pt-BR")}</p></div><b>→</b></button>)}</div></div>
}

function Conta(){
 const [nome,setNome]=useState(""); const [email,setEmail]=useState(""); const [creditos,setCreditos]=useState(20); const [plano,setPlano]=useState("gratuito"); const [status,setStatus]=useState("");
 useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;setEmail(user.email||"");const {data}=await supabase.from("usuarios").select("nome,email,creditos,plano").eq("id",user.id).maybeSingle();if(data){setNome(data.nome||"");setCreditos(data.creditos??20);setPlano(data.plano||"gratuito");}})()},[]);
 const save=async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;const {error}=await supabase.from("usuarios").update({nome,atualizado_em:new Date().toISOString()}).eq("id",user.id);setStatus(error?error.message:"Dados salvos com sucesso.");};
 const logout=async()=>{await supabase.auth.signOut();window.location.reload();};
 return <div className="content"><div className="account-grid"><section className="panel account-card"><div className="profile-avatar">{(nome||email||"J").charAt(0).toUpperCase()}</div><h2>Minha conta</h2><p>Gerencie seus dados e acompanhe seu plano.</p><label>Nome<input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Seu nome"/></label><label>E-mail<input value={email} disabled/></label>{status&&<div className="search-error">{status}</div>}<button className="primary-large" onClick={save}>Salvar alterações</button><button className="secondary-action" onClick={logout}>Sair da conta</button></section><section className="panel account-plan"><span className="eyebrow">PLANO ATUAL</span><h2>{plano==="gratuito"?"Gratuito":plano}</h2><strong>{creditos} créditos</strong><p>Seu plano e seus créditos são controlados pela conta.</p><button onClick={()=>location.hash="planos"}>Ver planos →</button></section></div></div>
}
function Planos(){
 const [message,setMessage]=useState("");
 const solicitar=async(plano:string,valor:number)=>{
   const {data:{user}}=await supabase.auth.getUser(); if(!user)return;
   const {error}=await supabase.from("assinaturas").insert({usuario_id:user.id,plano,valor,status:"pendente"});
   setMessage(error?error.message:"Solicitação registrada. A ativação será feita manualmente.");
 };
 return <div className="content"><div className="plans-intro"><span className="eyebrow">ESCOLHA SEU ACESSO</span><h2>Mais conhecimento, sem limitar sua criação.</h2><p>Os planos são ativados manualmente após a solicitação.</p>{message&&<div className="search-error">{message}</div>}</div><div className="plans-grid"><article className="plan-card"><span>GRATUITO</span><h3>R$ 0</h3><p>Para começar</p><ul><li>20 créditos iniciais</li><li>Pesquisa na biblioteca</li><li>Seleção de conhecimentos</li></ul><button disabled>Plano atual</button></article><article className="plan-card featured"><span>PLUS</span><h3>R$ 15</h3><p>7 dias de acesso</p><ul><li>Acesso ampliado</li><li>Exportações quando disponíveis</li><li>Ativação manual</li></ul><button onClick={()=>solicitar("plus",15)}>Solicitar Plus →</button></article><article className="plan-card"><span>MENSAL</span><h3>R$ 49</h3><p>1 mês de acesso</p><ul><li>Acesso ampliado</li><li>Exportações quando disponíveis</li><li>Ativação manual</li></ul><button onClick={()=>solicitar("mensal",49)}>Solicitar mensal →</button></article></div></div>}

function Admin({setPage}:{setPage:(p:Page)=>void}){
 const [stats,setStats]=useState({users:0,books:0,knowledge:0,pending:0});
 useEffect(()=>{(async()=>{const [{count:users},{count:books},{count:knowledge},{count:pending}]=await Promise.all([
   supabase.from("usuarios").select("*",{count:"exact",head:true}),
   supabase.from("livros").select("*",{count:"exact",head:true}),
   supabase.from("conhecimentos").select("*",{count:"exact",head:true}),
   supabase.from("livros").select("*",{count:"exact",head:true}).eq("status","Processando")
 ]);setStats({users:users||0,books:books||0,knowledge:knowledge||0,pending:pending||0});})()},[]);
 return <div className="content"><div className="stats admin-stats"><div><small>USUÁRIOS</small><strong>{stats.users}</strong><span>Contas cadastradas</span></div><div><small>LIVROS</small><strong>{stats.books}</strong><span>Na biblioteca</span></div><div><small>CONHECIMENTOS</small><strong>{stats.knowledge}</strong><span>Prontos para pesquisa</span></div><div><small>PROCESSAMENTO</small><strong>{stats.pending?"Em andamento":"0%"}</strong><span>{stats.pending?"Livro em processamento":"Nenhum livro em fila"}</span></div></div><div className="admin-grid"><section className="panel admin-action"><span>01</span><h3>Biblioteca</h3><p>Gerencie os livros que alimentam o Content Brain.</p><button onClick={()=>setPage("livros")}>Abrir biblioteca →</button></section><section className="panel admin-action"><span>02</span><h3>Conhecimentos</h3><p>Revise os conhecimentos extraídos dos livros.</p><button onClick={()=>setPage("conhecimentos")}>Ver conhecimentos →</button></section><section className="panel admin-action"><span>03</span><h3>Usuários</h3><p>Controle créditos, planos e status das contas.</p><button onClick={()=>setPage("usuarios")}>Gerenciar usuários →</button></section></div></div>}
function AdminList({type}:{type:"livros"|"processamento"|"conhecimentos"|"usuarios"}) {
 const [livros,setLivros]=useState<any[]>([]);
 const [loading,setLoading]=useState(type==="livros"||type==="processamento");
 const [processing,setProcessing]=useState<string|null>(null);
 const [progress,setProgress]=useState<Record<string,{done:number,total:number}>>({});
 const [message,setMessage]=useState(""); const [rows,setRows]=useState<any[]>([]); const [rowsLoading,setRowsLoading]=useState(false); const [saving,setSaving]=useState<string|null>(null);
 const [creditAmounts,setCreditAmounts]=useState<Record<string,string>>({}); const [assinaturas,setAssinaturas]=useState<any[]>([]);
 const [showUserForm,setShowUserForm]=useState(false);
 const [newUser,setNewUser]=useState({nome:"",email:"",password:"",plano:"gratuito",creditos:20});
 const [userActionLoading,setUserActionLoading]=useState(false);
 const [showBookForm,setShowBookForm]=useState(false);
 const [bookUploading,setBookUploading]=useState(false);
 const [newBook,setNewBook]=useState({titulo:"",autor:""});
 const [bookFile,setBookFile]=useState<File|null>(null);

 const loadLivros=async()=>{
   setLoading(true);
   const {data,error}=await supabase.from("livros").select("id,titulo,autor,status,total_paginas,data_upload,arquivo_path").order("data_upload",{ascending:false,nullsLast:true});
   if(error) setMessage("Não foi possível carregar a biblioteca.");
   else setLivros(data||[]);
   setLoading(false);
 };

 const uploadBook=async()=>{
   if(!bookFile){setMessage("Selecione um arquivo PDF.");return;}
   if(bookFile.type!=="application/pdf" && !bookFile.name.toLowerCase().endsWith(".pdf")){setMessage("A biblioteca aceita apenas arquivos PDF.");return;}
   setBookUploading(true);setMessage("");
   try{
     const safeName=bookFile.name.replace(/[^a-zA-Z0-9._-]/g,"_");
     const path=Date.now()+"_"+safeName;
     const {error:uploadError}=await supabase.storage.from("livros").upload(path,bookFile,{contentType:"application/pdf",upsert:false});
     if(uploadError) throw uploadError;
     const titulo=newBook.titulo.trim() || bookFile.name.replace(/\.pdf$/i,"");
     const {error:insertError}=await supabase.from("livros").insert({titulo,autor:newBook.autor.trim()||null,status:"Pendente",data_upload:new Date().toISOString().slice(0,10),arquivo_path:path});
     if(insertError){await supabase.storage.from("livros").remove([path]);throw insertError;}
     setShowBookForm(false);setNewBook({titulo:"",autor:""});setBookFile(null);setMessage("Livro adicionado à biblioteca. Agora você pode processá-lo.");
     await loadLivros();
   }catch(e:any){setMessage(e?.message||"Não foi possível adicionar o livro.");}
   finally{setBookUploading(false);}
 };

 const processar=async(livro:any)=>{
   setProcessing(livro.id);
   setMessage("");
   let inicio=1;
   let finished=false;
   try {
     while(!finished) {
       const {data,error}=await supabase.functions.invoke("processar-livro",{body:{livro_id:livro.id,inicio,limite:25}});
       if(error) throw error;
       if(!data?.sucesso) throw new Error(data?.erro||"Falha no processamento.");
       const fim=Number(data.fim||inicio);
       const total=Number(data.total_paginas||livro.total_paginas||0);
       setProgress(p=>({...p,[livro.id]:{done:fim,total}}));

       const {data:knowledgeData,error:knowledgeError}=await supabase.functions.invoke("gerar-conhecimentos",{
         body:{livro_id:livro.id,inicio,limite:25}
       });
       if(knowledgeError) throw knowledgeError;
       if(!knowledgeData?.sucesso) throw new Error(knowledgeData?.erro||"Falha ao gerar conhecimentos.");

       finished=Boolean(data.concluido);
       if(!finished) inicio=Number(data.proxima_pagina||fim+1);
     }
     setMessage("Processamento concluído.");
     await loadLivros();
   } catch(e:any) {
     setMessage(e?.message||"Não foi possível processar o livro.");
     await loadLivros();
   } finally {
     setProcessing(null);
   }
 };

 useEffect(()=>{if(type==="livros"||type==="processamento") void loadLivros();if(type==="conhecimentos"||type==="usuarios") void loadRows();},[type]);
 const loadRows=async()=>{setRowsLoading(true);if(type==="conhecimentos"){const {data,error}=await supabase.from("conhecimentos").select("id,titulo,tipo,tema,relevancia,criado_em,livros(titulo,autor)").order("relevancia",{ascending:false,nullsLast:true}).limit(200);if(error)setMessage(error.message);else setRows(data||[]);}else{const [{data,error},{data:subs,error:subError}]=await Promise.all([supabase.from("usuarios").select("id,nome,email,creditos,plano,status,plano_expira_em,criado_em").order("criado_em",{ascending:false}).limit(200),supabase.from("assinaturas").select("id,usuario_id,plano,valor,inicio_em,expira_em,status,criado_em").order("criado_em",{ascending:false}).limit(100)]);if(error)setMessage(error.message);else setRows(data||[]);if(!subError)setAssinaturas(subs||[]);}setRowsLoading(false);};

 if(type==="livros"||type==="processamento"){
   return <div className="content">
     <div className="admin-list-head">
       <div><span className="eyebrow">{type==="livros"?"BIBLIOTECA":"PROCESSAMENTO"}</span><h2>{type==="livros"?"Livros cadastrados":"Fila de processamento"}</h2><p>{type==="livros"?"Seu acervo de livros alimenta a base do Content Brain.":"Processe os livros em lotes de até 25 páginas."}</p></div>
       {type==="livros"&&<button className="admin-add-user admin-add-book" onClick={()=>setShowBookForm(true)}><span>＋</span> Adicionar livro</button>}
     </div>
     {message&&<div className="search-error">{message}</div>}
     {loading?<div className="panel table-placeholder"><div className="empty-row"><span>◌</span><div><strong>Carregando biblioteca...</strong><p>Consultando o Supabase.</p></div></div></div>:
     <div className="results-list">
       {livros.map(l=><article className="knowledge-card" key={l.id}>
         <div className="knowledge-main">
           <div className="knowledge-meta"><span>{l.status||"SEM STATUS"}</span><span>•</span><span>{l.autor||"Autor não informado"}</span></div>
           <h3>{l.titulo||"Livro sem título"}</h3>
           <p className="excerpt">{l.total_paginas?l.total_paginas+" páginas":"Número de páginas ainda não calculado."}</p>
           {progress[l.id]&&<div className="application"><b>PROGRESSO</b><span>{progress[l.id].done} de {progress[l.id].total} páginas ({progress[l.id].total?Math.round(progress[l.id].done/progress[l.id].total*100):0}%)</span></div>}
           <small>{l.arquivo_path||"Arquivo não informado"}</small>
         </div>
         <div>
           {(l.status==="Pendente"||l.status==="Processando")&&<button className="primary-large" disabled={processing===l.id} onClick={()=>processar(l)}>{processing===l.id?"Processando...":"Processar livro →"}</button>}
           {l.status==="Processado"&&<span className="status-ok">Processado ✓</span>}
         </div>
       </article>)}
     </div>}
     {type==="livros"&&showBookForm&&<div className="modal-backdrop" onClick={()=>!bookUploading&&setShowBookForm(false)}><div className="modal admin-user-modal book-modal" onClick={e=>e.stopPropagation()}>
       <button className="close" onClick={()=>!bookUploading&&setShowBookForm(false)}>×</button>
       <div className="modal-logo"><span>content</span><strong>brain</strong></div>
       <span className="eyebrow">NOVA OBRA</span><h2>Adicionar livro</h2><p>Envie o PDF que fará parte da biblioteca de conhecimento.</p>
       <label>Título<input value={newBook.titulo} onChange={e=>setNewBook({...newBook,titulo:e.target.value})} placeholder="Título do livro"/></label>
       <label>Autor<input value={newBook.autor} onChange={e=>setNewBook({...newBook,autor:e.target.value})} placeholder="Nome do autor"/></label>
       <label>Arquivo PDF<input type="file" accept="application/pdf,.pdf" onChange={e=>setBookFile(e.target.files?.[0]||null)} disabled={bookUploading}/></label>
       {bookFile&&<div className="book-file-name">Arquivo selecionado: <b>{bookFile.name}</b></div>}
       <button className="btn btn-primary full" disabled={bookUploading||!bookFile} onClick={uploadBook}>{bookUploading?"Enviando...":"Adicionar livro"} <span>→</span></button>
     </div></div>}
   </div>;
 }

 const cfg={conhecimentos:["CONHECIMENTOS","Base de conhecimento","Revise e organize os conhecimentos extraídos."],usuarios:["USUÁRIOS","Usuários cadastrados","Gerencie contas, créditos e planos."]}[type];
 const updateUser=async(id:string,patch:any)=>{setSaving(id);const {error}=await supabase.from("usuarios").update({...patch,atualizado_em:new Date().toISOString()}).eq("id",id);if(error)setMessage(error.message);else await loadRows();setSaving(null);};
 const setUserPlan=async(id:string,plano:string)=>{
   const expira=plano==="plus"?new Date(Date.now()+7*86400000).toISOString():plano==="mensal"?new Date(Date.now()+30*86400000).toISOString():null;
   await updateUser(id,{plano,status:"ativo",plano_expira_em:expira});
 };
 const createUser=async()=>{
   setUserActionLoading(true);setMessage("");
   try{
     const {data,error}=await supabase.functions.invoke("gerenciar-usuarios",{body:{action:"create",...newUser,creditos:Number(newUser.creditos)}});
     if(error) throw error;
     if(!data?.sucesso) throw new Error(data?.erro||"Não foi possível criar o usuário.");
     setShowUserForm(false);setNewUser({nome:"",email:"",password:"",plano:"gratuito",creditos:20});await loadRows();
   }catch(e:any){setMessage(e?.message||"Não foi possível criar o usuário.");}
   finally{setUserActionLoading(false);}
 };
 const deleteUser=async(id:string)=>{
   if(!window.confirm("Remover este usuário e o acesso dele ao Content Brain?")) return;
   setSaving(id);setMessage("");
   try{
     const {data,error}=await supabase.functions.invoke("gerenciar-usuarios",{body:{action:"delete",user_id:id}});
     if(error) throw error;
     if(!data?.sucesso) throw new Error(data?.erro||"Não foi possível remover o usuário.");
     await loadRows();
   }catch(e:any){setMessage(e?.message||"Não foi possível remover o usuário.");}
   finally{setSaving(null);}
 };
 const approve=async(s:any)=>{setSaving(s.id);const days=s.plano==="plus"?7:30;const inicio=new Date();const expira=new Date(inicio.getTime()+days*86400000);const {error}=await supabase.from("assinaturas").update({status:"ativa",inicio_em:inicio.toISOString(),expira_em:expira.toISOString()}).eq("id",s.id);if(!error) await supabase.from("usuarios").update({plano:s.plano,status:"ativo",plano_expira_em:expira.toISOString(),atualizado_em:new Date().toISOString()}).eq("id",s.usuario_id);if(error)setMessage(error.message);else await loadRows();setSaving(null);};
 const reject=async(s:any)=>{setSaving(s.id);const {error}=await supabase.from("assinaturas").update({status:"recusada"}).eq("id",s.id);if(error)setMessage(error.message);else await loadRows();setSaving(null);};
 return <div className="content"><div className="admin-list-head"><div><span className="eyebrow">{cfg[0]}</span><h2>{cfg[1]}</h2><p>{cfg[2]}</p></div>{type==="usuarios"&&<button className="admin-add-user" onClick={()=>setShowUserForm(true)}><span>＋</span> Adicionar usuário</button>}</div>{message&&<div className="search-error">{message}</div>}{rowsLoading?<div className="panel table-placeholder"><div className="empty-row"><span>◌</span><div><strong>Carregando...</strong><p>Consultando o Supabase.</p></div></div></div>:<><div className="panel table-placeholder"><div className="table-head"><span>NOME</span><span>STATUS</span><span>ATUALIZAÇÃO</span><span>AÇÕES</span></div>{rows.length===0?<div className="empty-row"><span>○</span><div><strong>Nenhum registro para exibir</strong><p>Quando houver dados, eles aparecerão aqui.</p></div></div>:rows.map((r:any)=><div className="table-row" key={r.id}><span><strong>{type==="usuarios"?(r.nome||r.email||"Usuário"):(r.titulo||r.tema||"Conhecimento")}</strong><small>{type==="usuarios"?r.email:(r.livros?.titulo||"Livro não informado")}</small></span><span>{type==="usuarios"?(r.plano+" • "+r.creditos+" créditos"):(r.tipo||"Conhecimento")}</span><span>{r.criado_em?new Date(r.criado_em).toLocaleDateString("pt-BR"):"—"}</span><span>{type==="usuarios"?<div className="admin-user-actions">
 <button className="credit-minus" title="Remover 1 crédito" disabled={saving===r.id} onClick={()=>updateUser(r.id,{creditos:Math.max(0,r.creditos-1)})}>−</button>
 <span className="credit-number">{r.creditos}</span>
 <button className="credit-plus" title="Adicionar 1 crédito" disabled={saving===r.id} onClick={()=>updateUser(r.id,{creditos:r.creditos+1})}>+</button>
 <div className="credit-add-group" title="Adicionar vários créditos">
   <input type="number" min="1" placeholder="Qtd." value={creditAmounts[r.id]||""} disabled={saving===r.id} onChange={e=>setCreditAmounts({...creditAmounts,[r.id]:e.target.value})} onClick={e=>e.stopPropagation()} onKeyDown={e=>{if(e.key==="Enter"){const n=Math.max(0,Number(creditAmounts[r.id]||0));if(n>0){updateUser(r.id,{creditos:r.creditos+n});setCreditAmounts({...creditAmounts,[r.id]:""});}}}} />
   <button className="credit-add-button" title="Adicionar quantidade informada" disabled={saving===r.id||!(Number(creditAmounts[r.id]||0)>0)} onClick={e=>{e.stopPropagation();const n=Math.max(0,Number(creditAmounts[r.id]||0));if(n>0){updateUser(r.id,{creditos:r.creditos+n});setCreditAmounts({...creditAmounts,[r.id]:""});}}}>Adicionar</button>
 </div>
 <select className="plan-select" value={r.plano} disabled={saving===r.id} onChange={e=>setUserPlan(r.id,e.target.value)}>
   <option value="gratuito">Gratuito</option><option value="plus">Plus · 7 dias</option><option value="mensal">Mensal · 30 dias</option>
 </select>
 <button className="user-status-button" data-action={r.status==="ativo"?"bloquear":"ativar"} disabled={saving===r.id} onClick={()=>updateUser(r.id,{status:r.status==="ativo"?"inativo":"ativo"})}>{r.status==="ativo"?"Bloquear":"Ativar"}</button>
 <button className="user-delete-button" title="Remover usuário" disabled={saving===r.id} onClick={()=>deleteUser(r.id)}>⌫</button>
 </div>:<span>—</span>}</span></div>)}</div>{type==="usuarios"&&<section className="panel table-placeholder" style={{marginTop:24}}><div className="panel-label">SOLICITAÇÕES DE PLANOS</div>{assinaturas.length===0?<div className="empty-row"><span>◇</span><div><strong>Nenhuma solicitação</strong><p>As solicitações dos usuários aparecerão aqui.</p></div></div>:assinaturas.map((s:any)=><div className="table-row" key={s.id}><span><strong>{s.plano.toUpperCase()} • R$ {Number(s.valor).toFixed(2)}</strong><small>{s.usuario_id}</small></span><span>{s.status}</span><span>{new Date(s.criado_em).toLocaleDateString("pt-BR")}</span><span>{s.status==="pendente"?<div className="admin-user-actions"><button disabled={saving===s.id} onClick={()=>approve(s)}>Ativar</button><button disabled={saving===s.id} onClick={()=>reject(s)}>Recusar</button></div>:<span>—</span>}</span></div>)}</section>}
 {type==="usuarios"&&showUserForm&&<div className="modal-backdrop" onClick={()=>!userActionLoading&&setShowUserForm(false)}><div className="modal admin-user-modal" onClick={e=>e.stopPropagation()}>
   <button className="close" onClick={()=>setShowUserForm(false)}>×</button>
   <div className="modal-logo"><span>content</span><strong>brain</strong></div>
   <span className="eyebrow">NOVO USUÁRIO</span><h2>Adicionar usuário</h2><p>Crie o acesso e já defina o plano.</p>
   <label>Nome<input value={newUser.nome} onChange={e=>setNewUser({...newUser,nome:e.target.value})} placeholder="Nome do usuário"/></label>
   <label>E-mail<input type="email" value={newUser.email} onChange={e=>setNewUser({...newUser,email:e.target.value})} placeholder="email@exemplo.com"/></label>
   <label>Senha inicial<input type="password" value={newUser.password} onChange={e=>setNewUser({...newUser,password:e.target.value})} placeholder="Mínimo 6 caracteres"/></label>
   <div className="form-row"><label>Plano<select value={newUser.plano} onChange={e=>setNewUser({...newUser,plano:e.target.value})}><option value="gratuito">Gratuito</option><option value="plus">Plus · 7 dias</option><option value="mensal">Mensal · 30 dias</option></select></label><label>Créditos<input type="number" min="0" value={newUser.creditos} onChange={e=>setNewUser({...newUser,creditos:Number(e.target.value)})}/></label></div>
   <button className="btn btn-primary full" disabled={userActionLoading} onClick={createUser}>{userActionLoading?"Criando...":"Criar usuário"} <span>→</span></button>
 </div></div>}
 </>}
 </div>;
}

function Landing({open}:{open:(t:"login"|"signup")=>void}) {
 return <div className="page"><header className="header"><Logo/><nav><a href="#como">Como funciona</a><a href="#conhecimento">Conhecimento</a><a href="#recursos">Recursos</a></nav><button className="btn btn-outline" onClick={()=>open("login")}>Fazer login</button></header><main><section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="dot"/> BIBLIOTECA INTELIGENTE DE CONHECIMENTO</div><h1>Transforme livros em <em>conhecimento aplicável.</em></h1><p>Pesquise ideias, princípios e técnicas dentro de uma biblioteca selecionada de livros de negócios — e encontre conhecimento organizado para colocar em prática.</p><div className="actions"><button className="btn btn-primary" onClick={()=>open("signup")}>Cadastre-se grátis <span>→</span></button><button className="btn btn-link" onClick={()=>open("login")}>Já tenho uma conta</button></div><div className="trust"><span>✓</span> Comece com 20 créditos gratuitos</div></div><div className="preview-shell"><div className="preview-top"><span className="window-dot"/><span className="window-dot"/><span className="window-dot"/><span className="credits">20 créditos</span></div><div className="search-box"><span>⌕</span><span className="placeholder">O que você quer aprender?</span><kbd>⌘ K</kbd></div><div className="result-label">CONHECIMENTOS ENCONTRADOS</div>{results.slice(0,2).map(e=><div className="result" key={e.title}><div className="result-tag">{e.type}</div><h3>{e.title}</h3><p>{e.book}</p><div className="result-arrow">↗</div></div>)}<div className="more">+ procurar mais resultados</div></div></section><section id="como" className="steps"><div><span>01</span><h2>Pesquise</h2><p>Digite um tema, técnica ou princípio que deseja estudar.</p></div><div><span>02</span><h2>Selecione</h2><p>Encontre e organize os conhecimentos relevantes da biblioteca.</p></div><div><span>03</span><h2>Aplique</h2><p>Use os conhecimentos selecionados para criar e tomar decisões.</p></div></section><section id="conhecimento" className="statement"><p>Uma biblioteca feita para quem quer sair da informação e chegar à <strong>aplicação.</strong></p></section></main></div>;
}

export default function App(){
 const [mode,setMode]=useState<"landing"|"user"|"admin">("landing");
 const [page,setPage]=useState<Page>("dashboard");
 const [modal,setModal]=useState<"login"|"signup"|null>(null);
 const [selected,setSelected]=useState<Knowledge[]>([]);
 const [historyQuery,setHistoryQuery]=useState<string>("");
 const open=(t:"login"|"signup")=>setModal(t);

 const navigate=(next:Page)=>{
   setPage(next);
   try{
     const key=next==="admin"||["livros","processamento","conhecimentos","usuarios"].includes(next)?"content-brain-page-admin":"content-brain-page-user";
     localStorage.setItem(key,next);
   }catch{}
 };

 const storedPage=(isAdmin:boolean):Page=>{
   try{
     const key=isAdmin?"content-brain-page-admin":"content-brain-page-user";
     const saved=localStorage.getItem(key) as Page|null;
     if(isAdmin && saved && ["admin","livros","processamento","conhecimentos","usuarios"].includes(saved)) return saved;
     if(!isAdmin && saved && ["dashboard","pesquisa","selecionados","ideias","historico","conta","planos"].includes(saved)) return saved;
   }catch{}
   return isAdmin?"admin":"dashboard";
 };

 useEffect(()=>{
   let active=true;
   supabase.auth.getSession().then(async ({data})=>{
     if(!active || !data.session) return;
     const {data:userData}=await supabase.auth.getUser();
     if(!active || !userData.user) return;
     const isAdmin=userData.user.app_metadata?.role==="admin";
     setMode(isAdmin?"admin":"user");
     setPage(storedPage(isAdmin));
   });
   const {data:{subscription}}=supabase.auth.onAuthStateChange(async (_event,session)=>{
     if(!active || !session?.user) return;
     const isAdmin=session.user.app_metadata?.role==="admin";
     setMode(isAdmin?"admin":"user");
     setPage(storedPage(isAdmin));
     setModal(null);
   });
   return ()=>{active=false;subscription.unsubscribe();};
 },[]);

 if(mode==="landing") return <><Landing open={open}/>{modal&&<AuthModal type={modal} close={()=>setModal(null)} switchType={(next)=>setModal(next)} onEnter={(admin)=>{setModal(null);setMode(admin?"admin":"user");navigate(admin?"admin":"dashboard")}}/>}</>;
 if(mode==="admin") return <AdminLayout page={page} setPage={navigate}>{page==="admin"?<Admin setPage={navigate}/>:<AdminList type={page as "livros"|"processamento"|"conhecimentos"|"usuarios"}/>}</AdminLayout>;
 return <UserLayout page={page} setPage={navigate}>{page==="dashboard"?<Dashboard setPage={navigate}/>:page==="pesquisa"?<Pesquisa setPage={navigate} selected={selected} setSelected={setSelected} initialQuery={historyQuery||undefined} autoRun={Boolean(historyQuery)}/>:page==="selecionados"?<Selecionados setPage={navigate} selected={selected} setSelected={setSelected}/>:page==="ideias"?<Ideas setPage={navigate}/>:page==="historico"?<Historico setPage={navigate} setHistoryQuery={(q)=>setHistoryQuery(q)}/>:page==="conta"?<Conta/>:<Planos/>}</UserLayout>;
}


function AuthModal({type,close,switchType,onEnter}:{type:"login"|"signup";close:()=>void;switchType:(type:"login"|"signup")=>void;onEnter:(admin:boolean)=>void}){
 const signup=type==="signup";
 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");
 const [nome,setNome]=useState("");
 const [error,setError]=useState("");
 const [loading,setLoading]=useState(false);

 const submit=async()=>{
   setLoading(true); setError("");
   try {
     if(signup){
       const {data,error}=await supabase.auth.signUp({email,password,options:{data:{nome}}});
       if(error) throw error;
       if(data.session){
         onEnter(data.user?.app_metadata?.role==="admin");
       } else {
         setError("Conta criada. Se a confirmação de e-mail estiver ativa, confirme seu e-mail antes de entrar.");
       }
     } else {
       const {data,error}=await supabase.auth.signInWithPassword({email,password});
       if(error) throw error;
       onEnter(data.user?.app_metadata?.role==="admin");
     }
   } catch(e:any) {
     setError(e?.message||"Não foi possível concluir o acesso.");
   } finally { setLoading(false); }
 };

 return <div className="modal-backdrop" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}>
   <button className="close" onClick={close}>×</button>
   <div className="modal-logo"><span>content</span><strong>brain</strong></div>
   <h2>{signup?"Crie sua conta":"Bem-vindo de volta"}</h2>
   <p>{signup?"Comece com 20 créditos gratuitos.":"Entre para continuar sua pesquisa."}</p>
   {signup&&<label>Nome<input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Seu nome"/></label>}
   <label>E-mail<input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="seu@email.com"/></label>
   <label>Senha<input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••"/></label>
   {error&&<div className="search-error">{error}</div>}
   <button className="btn btn-primary full" disabled={loading} onClick={submit}>{loading?"Entrando...":signup?"Criar conta":"Entrar"} <span>→</span></button>
   <><div className="oauth-divider"><span>ou</span></div><button className="google-login" disabled={loading} onClick={async()=>{setLoading(true);setError("");const {error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}});if(error)setError(error.message);setLoading(false);}}><span className="google-mark">G</span> Continuar com Google</button></>
   <small>{signup?"Já tem uma conta? ":"Ainda não tem uma conta? "}<button className="switch" onClick={()=>switchType(signup?"login":"signup")}>{signup?"Fazer login":"Cadastre-se"}</button></small>
 </div></div>;
}

