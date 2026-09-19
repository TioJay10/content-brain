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

function SideNav({ page, setPage, admin = false }: { page: Page; setPage: (p: Page) => void; admin?: boolean }) {
  const signOut = async () => { await supabase.auth.signOut(); window.location.reload(); };
  const items = admin
    ? [["admin","Visão geral"],["livros","Biblioteca"],["processamento","Processamento"],["conhecimentos","Conhecimentos"],["usuarios","Usuários"]] as [Page,string][]
    : [["dashboard","Início"],["pesquisa","Pesquisar"],["selecionados","Selecionados"],["ideias","Ideias de conteúdo"],["historico","Histórico"]] as [Page,string][];
  return <aside className="sidebar">
    <Logo />
    <div className="side-section">{admin ? "ADMINISTRAÇÃO" : "CONTENT BRAIN"}</div>
    <nav>{items.map(([key,label]) => <button key={key} className={page===key ? "side-link active" : "side-link"} onClick={()=>setPage(key)}><span className="side-icon">{key==="pesquisa"?"⌕":key==="dashboard"||key==="admin"?"◫":key==="selecionados"?"□":key==="ideias"?"✦":key==="historico"?"◷":key==="livros"?"▤":key==="processamento"?"◌":key==="conhecimentos"?"≡":"○"}</span>{label}</button>)}</nav>
    {!admin && <div className="side-bottom">
      <button className={page==="planos" ? "side-link active" : "side-link"} onClick={()=>setPage("planos")}><span className="side-icon">◇</span>Planos</button>
      <button className={page==="conta" ? "side-link active" : "side-link"} onClick={()=>setPage("conta")}><span className="side-icon">○</span>Minha conta</button>
    </div>}
    <div className="sidebar-user"><div className="avatar">J</div><div><strong>Minha conta</strong><small>Acesso ativo</small></div><button className="sidebar-logout" title="Sair" onClick={signOut}>↪</button></div>
  </aside>;
}

function Topbar({ title, setPage }: { title: string; setPage: (p:Page)=>void }) {
  return <header className="topbar"><div><div className="breadcrumb">CONTENT BRAIN / <span>{title.toUpperCase()}</span></div><h1>{title}</h1></div><button className="credit-pill" onClick={()=>setPage("planos")}><b>20</b> créditos <span>+</span></button></header>;
}

function UserLayout({ page, setPage, children }: {page:Page;setPage:(p:Page)=>void;children:ReactNode}) {
  const titles: Record<string,string> = {dashboard:"Início",pesquisa:"Pesquisar conhecimento",selecionados:"Conhecimentos selecionados",ideias:"Ideias de conteúdo",historico:"Histórico",conta:"Minha conta",planos:"Planos"};
  return <div className="app-shell"><SideNav page={page} setPage={setPage}/><main className="workspace"><Topbar title={titles[page] || "Content Brain"} setPage={setPage}/>{children}</main></div>;
}

function AdminLayout({ page, setPage, children }: {page:Page;setPage:(p:Page)=>void;children:React.ReactNode}) {
  const titles: Record<string,string> = {admin:"Visão geral",livros:"Biblioteca",processamento:"Processamento",conhecimentos:"Conhecimentos",usuarios:"Usuários"};
  return <div className="app-shell"><SideNav page={page} setPage={setPage} admin/><main className="workspace"><Topbar title={titles[page] || "Administração"} setPage={setPage}/>{children}</main></div>;
}

function Dashboard({setPage}:{setPage:(p:Page)=>void}) {
 return <div className="content">
   <section className="welcome"><div><span className="eyebrow">SEU ESPAÇO DE CONHECIMENTO</span><h2>Olá, seja bem-vindo.</h2><p>Pesquise na biblioteca e transforme conhecimento em aplicação.</p></div><button className="primary-large" onClick={()=>setPage("pesquisa")}>Nova pesquisa <b>→</b></button></section>
   <div className="stats"><div><small>CRÉDITOS DISPONÍVEIS</small><strong>20</strong><span>Plano gratuito</span></div><div><small>PESQUISAS REALIZADAS</small><strong>0</strong><span>Comece sua primeira pesquisa</span></div><div><small>CONTEÚDOS GERADOS</small><strong>0</strong><span>Nenhum conteúdo ainda</span></div></div>
   <div className="dashboard-grid"><section className="panel main-search"><div className="panel-label">PESQUISA RÁPIDA</div><h3>O que você quer aprender?</h3><div className="big-search" onClick={()=>setPage("pesquisa")}><span>⌕</span><span>Digite um tema, técnica ou princípio...</span><kbd>⌘ K</kbd></div><div className="suggestions"><span>Ex.: Técnicas de vendas</span><span>Fechamento de vendas</span><span>Princípios de liderança</span></div></section><section className="panel"><div className="panel-label">COMECE POR AQUI</div><div className="mini-step"><b>01</b><div><strong>Pesquise</strong><p>Encontre conhecimento relevante.</p></div></div><div className="mini-step"><b>02</b><div><strong>Selecione</strong><p>Organize os melhores resultados.</p></div></div><div className="mini-step"><b>03</b><div><strong>Aplique</strong><p>Transforme conhecimento em conteúdo.</p></div></div></section></div>
 </div>
}

function Pesquisa({setPage, selected, setSelected}:{setPage:(p:Page)=>void; selected:Knowledge[]; setSelected:(items:Knowledge[])=>void}) {
 const [query,setQuery]=useState("Técnicas de vendas");
 const [items,setItems]=useState<Knowledge[]>([]);
 const [loading,setLoading]=useState(false);
 const [searched,setSearched]=useState(false);
 const [error,setError]=useState("");
 const search=async()=>{
   setLoading(true); setError("");
   const term=query.trim();
   let request=supabase.from("conhecimentos").select("id,titulo,tipo,tema,trecho,conteudo,analise_aplicacao,relevancia,pagina_id,livro_id,paginas(numero_pagina),livros(titulo,autor)");
   if(term) request=request.or("titulo.ilike.%"+term+"%,tema.ilike.%"+term+"%,trecho.ilike.%"+term+"%,conteudo.ilike.%"+term+"%");
   const {data,error}=await request.order("relevancia",{ascending:false,nullsLast:true}).limit(40);
   if(error){ setError("Não foi possível carregar os conhecimentos agora."); setItems([]); }
   else {
     const mapped=(data||[]).map((r:any)=>({
       id:r.id,titulo:r.titulo,tipo:r.tipo,tema:r.tema,trecho:r.trecho,conteudo:r.conteudo,
       analise_aplicacao:r.analise_aplicacao,relevancia:r.relevancia,
       pagina:r.paginas?.numero_pagina ?? null, livro:r.livros?.titulo ?? "Livro não informado", autor:r.livros?.autor ?? "Autor não informado"
     }));
     setItems(mapped);
     const {data:{user}}=await supabase.auth.getUser();
     if(user && term) await supabase.from("pesquisas").insert({usuario_id:user.id,consulta:term,resultados:mapped.length,credito_consumido:false});
   }
   setSearched(true); setLoading(false);
 };
 return <div className="content">
   <section className="search-page-head">
     <div className="search-input-large"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")search()}} placeholder="Digite um tema, técnica ou princípio..." /><button onClick={()=>{setQuery("");setItems([]);setSearched(false)}}>×</button></div>
     <button className="primary-large" onClick={search}>{loading?"Buscando...":"Pesquisar"}</button>
   </section>
   <div className="results-toolbar"><span>{searched ? items.length+" conhecimentos encontrados" : "Pesquise na biblioteca"}</span><div><button>Filtrar</button><button>Mais relevantes⌄</button></div></div>
   {error && <div className="search-error">{error}</div>}
   {!searched && <section className="search-empty"><div className="empty-mark">⌕</div><h2>O que você quer aprender?</h2><p>Digite um tema, técnica ou princípio para encontrar conhecimentos organizados na biblioteca.</p></section>}
   {searched && !loading && items.length===0 && !error && <section className="search-empty"><div className="empty-mark">○</div><h2>Nenhum conhecimento encontrado</h2><p>Não encontramos resultados para “{query}”. Tente outro termo ou uma expressão mais curta.</p></section>}
   {loading && <div className="search-empty"><h2>Consultando a biblioteca...</h2><p>Estamos buscando nos conhecimentos cadastrados no Supabase.</p></div>}
   <div className="results-list">{items.map(r=>{
     const isSelected=selected.some(x=>x.id===r.id);
     return <article className={isSelected?"knowledge-card selected":"knowledge-card"} key={r.id} onClick={async()=>{const next=isSelected?selected.filter(x=>x.id!==r.id):[...selected,r];setSelected(next);const {data:{user}}=await supabase.auth.getUser();if(user){if(isSelected) await supabase.from("selecoes").delete().eq("usuario_id",user.id).eq("conhecimento_id",r.id);else await supabase.from("selecoes").insert({usuario_id:user.id,conhecimento_id:r.id});}}}>
       <div className="check">{isSelected?"✓":""}</div><div className="knowledge-main">
         <div className="knowledge-meta"><span>{r.tipo||"CONHECIMENTO"}</span><span>•</span><span>{r.livro}</span>{r.pagina&&<><span>•</span><span>p. {r.pagina}</span></>}</div>
         <h3>{r.titulo||r.tema||"Conhecimento"}</h3><p className="excerpt">“{r.trecho||r.conteudo||"Conteúdo não informado."}”</p>
         {r.analise_aplicacao&&<div className="application"><b>NOTA DE APLICAÇÃO</b><span>{r.analise_aplicacao}</span></div>}
         <small>{r.autor}</small>
       </div><span className="card-arrow">↗</span>
     </article>
   })}</div>
   {searched && items.length>0 && <div className="more-results"><button onClick={search}>+ Procurar mais resultados</button><span>{selected.length} selecionado{selected.length!==1?"s":""}</span></div>}
   {selected.length>0 && <div className="selection-bar"><span><b>{selected.length}</b> conhecimentos selecionados</span><button onClick={()=>setPage("selecionados")}>Revisar seleção →</button></div>}
 </div>;
}

function Selecionados({setPage, selected, setSelected}:{setPage:(p:Page)=>void; selected:Knowledge[]; setSelected:(items:Knowledge[])=>void}) {
 const [copied,setCopied]=useState(false);
 const copySelected=async()=>{ const text=selected.map((r,i)=>["["+(i+1)+"] "+(r.titulo||r.tema||"Conhecimento"),"Tipo: "+(r.tipo||"Conhecimento"),"Livro: "+r.livro,"Autor: "+r.autor,"Página: "+(r.pagina??"não informada"),"Trecho: “"+(r.trecho||r.conteudo||"")+"”","Nota de aplicação: "+(r.analise_aplicacao||"não informada")].join("\n")).join("\n\n"); try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),1800); } catch {} };
 return <div className="content"><section className="section-intro"><div><span className="eyebrow">SUA CURADORIA</span><h2>Conhecimentos selecionados.</h2><p>Revise, organize e copie os conhecimentos que você quer levar para o seu trabalho.</p></div></section>
 {selected.length===0 ? <section className="empty-selection"><div className="empty-mark">□</div><h2>Nenhum conhecimento selecionado</h2><p>Durante uma pesquisa, clique nos conhecimentos que deseja guardar. Eles aparecerão aqui para revisão e cópia.</p><button className="primary-large" onClick={()=>setPage("pesquisa")}>Voltar para pesquisa <b>→</b></button></section> :
 <><div className="selected-actions"><span><b>{selected.length}</b> conhecimento{selected.length!==1?"s":""}</span><div><button className="secondary-action" onClick={()=>setSelected([])}>Limpar seleção</button><button className="primary-large" onClick={copySelected}>{copied?"Copiado ✓":"Copiar conhecimentos"}</button></div></div>
 <div className="results-list">{selected.map(r=><article className="knowledge-card selected" key={r.id}><div className="check">✓</div><div className="knowledge-main"><div className="knowledge-meta"><span>{r.tipo||"CONHECIMENTO"}</span><span>•</span><span>{r.livro}</span>{r.pagina&&<><span>•</span><span>p. {r.pagina}</span></>}</div><h3>{r.titulo||r.tema||"Conhecimento"}</h3><p className="excerpt">“{r.trecho||r.conteudo||""}”</p>{r.analise_aplicacao&&<div className="application"><b>NOTA DE APLICAÇÃO</b><span>{r.analise_aplicacao}</span></div>}<small>{r.autor}</small></div><button className="remove-selected" onClick={()=>setSelected(selected.filter(x=>x.id!==r.id))}>×</button></article>)}</div></>}
 </div>;
}

function Ideas({setPage}:{setPage:(p:Page)=>void}) {
 const ideas=["5 erros de quem tenta vender sem entender o cliente","O princípio de liderança que muda a forma de conduzir uma equipe","Como transformar uma técnica de vendas em uma conversa natural"];
 return <div className="content"><div className="section-intro"><div><span className="eyebrow">A PARTIR DO CONHECIMENTO</span><h2>Ideias para transformar conhecimento em conteúdo.</h2><p>Use os conhecimentos selecionados como ponto de partida.</p></div></div><div className="idea-grid">{ideas.map((x,i)=><article className="idea-card" key={x}><span>0{i+1}</span><h3>{x}</h3><p>Uma possibilidade de conteúdo construída a partir dos conhecimentos da biblioteca.</p><button onClick={()=>setPage("selecionados")}>Ver conhecimentos →</button></article>)}</div></div>
}

function Historico(){
 const [items,setItems]=useState<any[]>([]); const [loading,setLoading]=useState(true);
 useEffect(()=>{(async()=>{const {data}=await supabase.from("pesquisas").select("id,consulta,resultados,credito_consumido,criado_em").order("criado_em",{ascending:false}).limit(50);setItems(data||[]);setLoading(false);})()},[]);
 return <div className="content"><div className="panel history-panel"><div className="panel-label">ATIVIDADE RECENTE</div>{loading?<div className="empty-row"><span>◌</span><div><strong>Carregando histórico...</strong><p>Consultando suas pesquisas.</p></div></div>:items.length===0?<div className="empty-row"><span>◷</span><div><strong>Nenhuma atividade ainda</strong><p>Suas pesquisas aparecerão aqui.</p></div></div>:items.map(x=><div className="empty-row" key={x.id}><span>⌕</span><div><strong>{x.consulta}</strong><p>{x.resultados} resultado(s) • {new Date(x.criado_em).toLocaleString("pt-BR")}</p></div></div>)}</div></div>
}
function Conta(){
 const [nome,setNome]=useState(""); const [email,setEmail]=useState(""); const [creditos,setCreditos]=useState(20); const [plano,setPlano]=useState("gratuito"); const [status,setStatus]=useState("");
 useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;setEmail(user.email||"");const {data}=await supabase.from("usuarios").select("nome,email,creditos,plano").eq("id",user.id).maybeSingle();if(data){setNome(data.nome||"");setCreditos(data.creditos??20);setPlano(data.plano||"gratuito");}})()},[]);
 const save=async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;const {error}=await supabase.from("usuarios").update({nome,atualizado_em:new Date().toISOString()}).eq("id",user.id);setStatus(error?error.message:"Dados salvos com sucesso.");};
 const logout=async()=>{await supabase.auth.signOut();window.location.reload();};
 return <div className="content"><div className="account-grid"><section className="panel account-card"><div className="profile-avatar">{(nome||email||"J").charAt(0).toUpperCase()}</div><h2>Minha conta</h2><p>Gerencie seus dados e acompanhe seu plano.</p><label>Nome<input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Seu nome"/></label><label>E-mail<input value={email} disabled/></label>{status&&<div className="search-error">{status}</div>}<button className="primary-large" onClick={save}>Salvar alterações</button><button className="secondary-action" onClick={logout}>Sair da conta</button></section><section className="panel account-plan"><span className="eyebrow">PLANO ATUAL</span><h2>{plano==="gratuito"?"Gratuito":plano}</h2><strong>{creditos} créditos</strong><p>Seu plano e seus créditos são controlados pela conta.</p><button onClick={()=>location.hash="planos"}>Ver planos →</button></section></div></div>
}
function Planos(){return <div className="content"><div className="plans-intro"><span className="eyebrow">ESCOLHA SEU ACESSO</span><h2>Mais conhecimento, sem limitar sua criação.</h2><p>Os planos são ativados manualmente após a solicitação.</p></div><div className="plans-grid"><article className="plan-card"><span>GRATUITO</span><h3>R$ 0</h3><p>Para começar</p><ul><li>20 créditos iniciais</li><li>Pesquisa na biblioteca</li><li>Seleção de conhecimentos</li></ul><button>Plano atual</button></article><article className="plan-card featured"><span>PLUS</span><h3>R$ 15</h3><p>7 dias de acesso</p><ul><li>Geração ilimitada</li><li>Exportações ilimitadas</li><li>Ativação manual</li></ul><button>Solicitar Plus →</button></article><article className="plan-card"><span>MENSAL</span><h3>R$ 49</h3><p>1 mês de acesso</p><ul><li>Geração ilimitada</li><li>Exportações ilimitadas</li><li>Ativação manual</li></ul><button>Solicitar mensal →</button></article></div></div>}

function Admin({setPage}:{setPage:(p:Page)=>void}){return <div className="content"><div className="stats admin-stats"><div><small>USUÁRIOS</small><strong>0</strong><span>Contas cadastradas</span></div><div><small>LIVROS</small><strong>1</strong><span>Na biblioteca</span></div><div><small>CONHECIMENTOS</small><strong>0</strong><span>Prontos para pesquisa</span></div><div><small>PROCESSAMENTO</small><strong>0%</strong><span>Nenhum livro em fila</span></div></div><div className="admin-grid"><section className="panel admin-action"><span>01</span><h3>Biblioteca</h3><p>Gerencie os livros que alimentam o Content Brain.</p><button onClick={()=>setPage("livros")}>Abrir biblioteca →</button></section><section className="panel admin-action"><span>02</span><h3>Conhecimentos</h3><p>Revise os conhecimentos extraídos dos livros.</p><button onClick={()=>setPage("conhecimentos")}>Ver conhecimentos →</button></section><section className="panel admin-action"><span>03</span><h3>Usuários</h3><p>Controle créditos, planos e status das contas.</p><button onClick={()=>setPage("usuarios")}>Gerenciar usuários →</button></section></div></div>}
function AdminList({type}:{type:"livros"|"processamento"|"conhecimentos"|"usuarios"}) {
 const [livros,setLivros]=useState<any[]>([]);
 const [loading,setLoading]=useState(type==="livros"||type==="processamento");
 const [processing,setProcessing]=useState<string|null>(null);
 const [progress,setProgress]=useState<Record<string,{done:number,total:number}>>({});
 const [message,setMessage]=useState(""); const [rows,setRows]=useState<any[]>([]); const [rowsLoading,setRowsLoading]=useState(false);

 const loadLivros=async()=>{
   setLoading(true);
   const {data,error}=await supabase.from("livros").select("id,titulo,autor,status,total_paginas,data_upload,arquivo_path").order("data_upload",{ascending:false,nullsLast:true});
   if(error) setMessage("Não foi possível carregar a biblioteca.");
   else setLivros(data||[]);
   setLoading(false);
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
 const loadRows=async()=>{setRowsLoading(true);if(type==="conhecimentos"){const {data,error}=await supabase.from("conhecimentos").select("id,titulo,tipo,tema,relevancia,criado_em,livros(titulo,autor)").order("relevancia",{ascending:false,nullsLast:true}).limit(200);if(error)setMessage(error.message);else setRows(data||[]);}else{const {data,error}=await supabase.from("usuarios").select("id,nome,email,creditos,plano,status,criado_em").order("criado_em",{ascending:false}).limit(200);if(error)setMessage(error.message);else setRows(data||[]);}setRowsLoading(false);};

 if(type==="livros"||type==="processamento"){
   return <div className="content">
     <div className="admin-list-head">
       <div><span className="eyebrow">{type==="livros"?"BIBLIOTECA":"PROCESSAMENTO"}</span><h2>{type==="livros"?"Livros cadastrados":"Fila de processamento"}</h2><p>{type==="livros"?"Seu acervo de livros alimenta a base do Content Brain.":"Processe os livros em lotes de até 25 páginas."}</p></div>
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
   </div>;
 }

 const cfg={conhecimentos:["CONHECIMENTOS","Base de conhecimento","Revise e organize os conhecimentos extraídos."],usuarios:["USUÁRIOS","Usuários cadastrados","Gerencie contas, créditos e planos."]}[type];
 return <div className="content"><div className="admin-list-head"><div><span className="eyebrow">{cfg[0]}</span><h2>{cfg[1]}</h2><p>{cfg[2]}</p></div><button className="primary-large">Nova ação <b>+</b></button></div><div className="panel table-placeholder"><div className="table-head"><span>NOME</span><span>STATUS</span><span>ATUALIZAÇÃO</span><span>AÇÕES</span></div>{rowsLoading?<div className="empty-row"><span>◌</span><div><strong>Carregando...</strong><p>Consultando o Supabase.</p></div></div>:rows.length===0?<div className="empty-row"><span>○</span><div><strong>Nenhum registro para exibir</strong><p>Quando houver dados, eles aparecerão aqui.</p></div></div>:rows.map((r:any)=><div className="table-row" key={r.id}><span><strong>{type==="usuarios"?(r.nome||r.email||"Usuário"):(r.titulo||r.tema||"Conhecimento")}</strong><small>{type==="usuarios"?r.email:(r.livros?.titulo||"Livro não informado")}</small></span><span>{type==="usuarios"?(r.plano+" • "+r.creditos+" créditos"):(r.tipo||"Conhecimento")}</span><span>{r.criado_em?new Date(r.criado_em).toLocaleDateString("pt-BR"):"—"}</span><span>—</span></div>)}</div></div>;
}

function Landing({open}:{open:(t:"login"|"signup")=>void}) {
 return <div className="page"><header className="header"><Logo/><nav><a href="#como">Como funciona</a><a href="#conhecimento">Conhecimento</a><a href="#recursos">Recursos</a></nav><button className="btn btn-outline" onClick={()=>open("login")}>Fazer login</button></header><main><section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="dot"/> BIBLIOTECA INTELIGENTE DE CONHECIMENTO</div><h1>Transforme livros em <em>conhecimento aplicável.</em></h1><p>Pesquise ideias, princípios e técnicas dentro de uma biblioteca selecionada de livros de negócios — e encontre conhecimento organizado para colocar em prática.</p><div className="actions"><button className="btn btn-primary" onClick={()=>open("signup")}>Cadastre-se grátis <span>→</span></button><button className="btn btn-link" onClick={()=>open("login")}>Já tenho uma conta</button></div><div className="trust"><span>✓</span> Comece com 20 créditos gratuitos</div></div><div className="preview-shell"><div className="preview-top"><span className="window-dot"/><span className="window-dot"/><span className="window-dot"/><span className="credits">20 créditos</span></div><div className="search-box"><span>⌕</span><span className="placeholder">O que você quer aprender?</span><kbd>⌘ K</kbd></div><div className="result-label">CONHECIMENTOS ENCONTRADOS</div>{results.slice(0,2).map(e=><div className="result" key={e.title}><div className="result-tag">{e.type}</div><h3>{e.title}</h3><p>{e.book}</p><div className="result-arrow">↗</div></div>)}<div className="more">+ procurar mais resultados</div></div></section><section id="como" className="steps"><div><span>01</span><h2>Pesquise</h2><p>Digite um tema, técnica ou princípio que deseja estudar.</p></div><div><span>02</span><h2>Selecione</h2><p>Encontre e organize os conhecimentos relevantes da biblioteca.</p></div><div><span>03</span><h2>Aplique</h2><p>Use os conhecimentos selecionados para criar e tomar decisões.</p></div></section><section id="conhecimento" className="statement"><p>Uma biblioteca feita para quem quer sair da informação e chegar à <strong>aplicação.</strong></p></section></main></div>;
}

export default function App(){
 const [mode,setMode]=useState<"landing"|"user"|"admin">("landing");
 const [page,setPage]=useState<Page>("dashboard");
 const [modal,setModal]=useState<"login"|"signup"|null>(null);
 const [selected,setSelected]=useState<Knowledge[]>([]);
 const open=(t:"login"|"signup")=>setModal(t);

 useEffect(()=>{
   let active=true;
   supabase.auth.getSession().then(async ({data})=>{
     if(!active || !data.session) return;
     const {data:userData}=await supabase.auth.getUser();
     if(!active || !userData.user) return;
     const isAdmin=userData.user.app_metadata?.role==="admin";
     setMode(isAdmin?"admin":"user");
     setPage(isAdmin?"admin":"dashboard");
   });
   const {data:{subscription}}=supabase.auth.onAuthStateChange(async (_event,session)=>{
     if(!active || !session?.user) return;
     const isAdmin=session.user.app_metadata?.role==="admin";
     setMode(isAdmin?"admin":"user");
     setPage(isAdmin?"admin":"dashboard");
     setModal(null);
   });
   return ()=>{active=false;subscription.unsubscribe();};
 },[]);

 if(mode==="landing") return <><Landing open={open}/>{modal&&<AuthModal type={modal} close={()=>setModal(null)} onEnter={(admin)=>{setModal(null);setMode(admin?"admin":"user");setPage(admin?"admin":"dashboard")}}/>}</>;
 if(mode==="admin") return <AdminLayout page={page} setPage={setPage}>{page==="admin"?<Admin setPage={setPage}/>:<AdminList type={page as "livros"|"processamento"|"conhecimentos"|"usuarios"}/>}</AdminLayout>;
 return <UserLayout page={page} setPage={setPage}>{page==="dashboard"?<Dashboard setPage={setPage}/>:page==="pesquisa"?<Pesquisa setPage={setPage} selected={selected} setSelected={setSelected}/>:page==="selecionados"?<Selecionados setPage={setPage} selected={selected} setSelected={setSelected}/>:page==="ideias"?<Ideas setPage={setPage}/>:page==="historico"?<Historico/>:page==="conta"?<Conta/>:<Planos/>}</UserLayout>;
}


function AuthModal({type,close,onEnter}:{type:"login"|"signup";close:()=>void;onEnter:(admin:boolean)=>void}){
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
   {!signup&&<><div className="oauth-divider"><span>ou</span></div><button className="google-login" disabled={loading} onClick={async()=>{setLoading(true);setError("");const {error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}});if(error)setError(error.message);setLoading(false);}}><span className="google-mark">G</span> Continuar com Google</button></>}
   <small>{signup?"Já tem uma conta? ":"Ainda não tem uma conta? "}<button className="switch" onClick={close}>{signup?"Fazer login":"Cadastre-se"}</button></small>
 </div></div>;
}

