import { useState } from "react";
import { supabase } from "./supabaseClient";

type Page =
  | "dashboard" | "pesquisa" | "selecionados" | "ideias" | "gerar"
  | "historico" | "conta" | "planos" | "admin" | "livros"
  | "processamento" | "conhecimentos" | "usuarios";

const results = [
  { id: 1, type: "VENDAS", title: "Princípios fundamentais de vendas", book: "As 5 habilidades essenciais do relacionamento", author: "Dale Carnegie", page: 142, excerpt: "Ao tratar com pessoas, devemos nos lembrar de que estamos lidando com seres humanos...", note: "Aplicável à construção de confiança antes de apresentar uma proposta." },
  { id: 2, type: "LIDERANÇA", title: "Liderar pelo exemplo", book: "As 5 habilidades essenciais do relacionamento", author: "Dale Carnegie", page: 179, excerpt: "A liderança começa pela forma como o próprio líder se comporta diante das situações.", note: "Use este princípio para transformar liderança em comportamento observável." },
  { id: 3, type: "NEGÓCIOS", title: "Conheça profundamente seu cliente", book: "Biblioteca de negócios", author: "Biblioteca Content Brain", page: 88, excerpt: "Compreender necessidades reais muda a qualidade das decisões comerciais.", note: "Ajuda a construir perguntas melhores e propostas mais relevantes." }
];

function Logo() {
  return <div className="app-logo"><span>content</span><b>brain</b></div>;
}

function SideNav({ page, setPage, admin = false }: { page: Page; setPage: (p: Page) => void; admin?: boolean }) {
  const items = admin
    ? [["admin","Visão geral"],["livros","Biblioteca"],["processamento","Processamento"],["conhecimentos","Conhecimentos"],["usuarios","Usuários"]] as [Page,string][]
    : [["dashboard","Início"],["pesquisa","Pesquisar"],["selecionados","Selecionados"],["ideias","Ideias de conteúdo"],["gerar","Gerar conteúdo"],["historico","Histórico"]] as [Page,string][];
  return <aside className="sidebar">
    <Logo />
    <div className="side-section">{admin ? "ADMINISTRAÇÃO" : "CONTENT BRAIN"}</div>
    <nav>{items.map(([key,label]) => <button key={key} className={page===key ? "side-link active" : "side-link"} onClick={()=>setPage(key)}><span className="side-icon">{key==="pesquisa"?"⌕":key==="dashboard"||key==="admin"?"◫":key==="selecionados"?"□":key==="ideias"?"✦":key==="gerar"?"↗":key==="historico"?"◷":key==="livros"?"▤":key==="processamento"?"◌":key==="conhecimentos"?"≡":"○"}</span>{label}</button>)}</nav>
    {!admin && <div className="side-bottom">
      <button className={page==="planos" ? "side-link active" : "side-link"} onClick={()=>setPage("planos")}><span className="side-icon">◇</span>Planos</button>
      <button className={page==="conta" ? "side-link active" : "side-link"} onClick={()=>setPage("conta")}><span className="side-icon">○</span>Minha conta</button>
    </div>}
    <div className="sidebar-user"><div className="avatar">J</div><div><strong>Minha conta</strong><small>20 créditos</small></div><span>•••</span></div>
  </aside>;
}

function Topbar({ title, setPage }: { title: string; setPage: (p:Page)=>void }) {
  return <header className="topbar"><div><div className="breadcrumb">CONTENT BRAIN / <span>{title.toUpperCase()}</span></div><h1>{title}</h1></div><button className="credit-pill" onClick={()=>setPage("planos")}><b>20</b> créditos <span>+</span></button></header>;
}

function UserLayout({ page, setPage, children }: {page:Page;setPage:(p:Page)=>void;children:React.ReactNode}) {
  const titles: Record<string,string> = {dashboard:"Início",pesquisa:"Pesquisar conhecimento",selecionados:"Conhecimentos selecionados",ideias:"Ideias de conteúdo",gerar:"Gerar conteúdo",historico:"Histórico",conta:"Minha conta",planos:"Planos"};
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

function Pesquisa({setPage}:{setPage:(p:Page)=>void}) {
 const [selected,setSelected]=useState<number[]>([]);
 return <div className="content"><section className="search-page-head"><div className="search-input-large"><span>⌕</span><span>Técnicas de vendas</span><button>×</button></div><span className="result-count">40 conhecimentos encontrados</span></section>
 <div className="results-toolbar"><span>Resultados relevantes</span><div><button>Filtrar</button><button>Mais relevantes⌄</button></div></div>
 <div className="results-list">{results.map(r=><article className={selected.includes(r.id)?"knowledge-card selected":"knowledge-card"} key={r.id} onClick={()=>setSelected(s=>s.includes(r.id)?s.filter(x=>x!==r.id):[...s,r.id])}><div className="check">{selected.includes(r.id)?"✓":""}</div><div className="knowledge-main"><div className="knowledge-meta"><span>{r.type}</span><span>•</span><span>{r.book}</span><span>•</span><span>p. {r.page}</span></div><h3>{r.title}</h3><p className="excerpt">“{r.excerpt}”</p><div className="application"><b>NOTA DE APLICAÇÃO</b><span>{r.note}</span></div><small>{r.author}</small></div><span className="card-arrow">↗</span></article>)}</div>
 <div className="more-results"><button onClick={()=>setPage("pesquisa")}>+ Procurar mais resultados</button><span>{selected.length} selecionado{selected.length!==1?"s":""}</span></div>
 {selected.length>0 && <div className="selection-bar"><span><b>{selected.length}</b> conhecimentos selecionados</span><button onClick={()=>setPage("selecionados")}>Revisar seleção →</button></div>}
 </div>;
}

function Selecionados({setPage}:{setPage:(p:Page)=>void}) {
 return <div className="content"><section className="empty-selection"><div className="empty-mark">□</div><h2>Seus conhecimentos selecionados</h2><p>Os conhecimentos que você escolher durante uma pesquisa aparecerão aqui para revisão e organização.</p><button className="primary-large" onClick={()=>setPage("pesquisa")}>Voltar para pesquisa <b>→</b></button></section></div>
}

function Ideas({setPage}:{setPage:(p:Page)=>void}) {
 const ideas=["5 erros de quem tenta vender sem entender o cliente","O princípio de liderança que muda a forma de conduzir uma equipe","Como transformar uma técnica de vendas em uma conversa natural"];
 return <div className="content"><div className="section-intro"><div><span className="eyebrow">A PARTIR DO CONHECIMENTO</span><h2>Ideias para transformar conhecimento em conteúdo.</h2><p>Use os conhecimentos selecionados como ponto de partida.</p></div></div><div className="idea-grid">{ideas.map((x,i)=><article className="idea-card" key={x}><span>0{i+1}</span><h3>{x}</h3><p>Uma possibilidade de conteúdo construída a partir dos conhecimentos da biblioteca.</p><button onClick={()=>setPage("gerar")}>Usar esta ideia →</button></article>)}</div></div>
}

function Gerar({setPage}:{setPage:(p:Page)=>void}) {
 return <div className="content"><div className="generator-grid"><section className="panel generator-form"><span className="eyebrow">CONTENT BRAIN / IA</span><h2>Transforme conhecimento em conteúdo.</h2><label>O que você quer criar?<textarea placeholder="Ex.: Crie um roteiro de Reels sobre técnicas de vendas..."/></label><div className="form-row"><label>Formato<select><option>Roteiro de vídeo</option><option>Post para Instagram</option><option>Artigo</option><option>Carrossel</option></select></label><label>Tom<select><option>Profissional</option><option>Direto</option><option>Educativo</option></select></label></div><div className="selected-source"><b>CONHECIMENTOS UTILIZADOS</b><span>3 conhecimentos selecionados</span></div><button className="primary-large">Gerar conteúdo <b>→</b></button></section><section className="panel output-placeholder"><span>RESULTADO</span><div className="placeholder-line wide"/><div className="placeholder-line"/><div className="placeholder-line"/><p>O conteúdo gerado aparecerá aqui.</p></section></div></div>
}

function Historico(){return <div className="content"><div className="panel history-panel"><div className="panel-label">ATIVIDADE RECENTE</div><div className="empty-row"><span>◷</span><div><strong>Nenhuma atividade ainda</strong><p>Suas pesquisas e conteúdos gerados aparecerão aqui.</p></div></div></div></div>}
function Conta(){return <div className="content"><div className="account-grid"><section className="panel account-card"><div className="profile-avatar">J</div><h2>Minha conta</h2><p>Gerencie seus dados e acompanhe seu plano.</p><label>Nome<input placeholder="Seu nome"/></label><label>E-mail<input placeholder="seu@email.com" disabled/></label><button className="primary-large">Salvar alterações</button></section><section className="panel account-plan"><span className="eyebrow">PLANO ATUAL</span><h2>Gratuito</h2><strong>20 créditos</strong><p>Comece explorando a biblioteca. Quando precisar de mais recursos, escolha um plano.</p><button onClick={()=>location.hash="planos"}>Ver planos →</button></section></div></div>}
function Planos(){return <div className="content"><div className="plans-intro"><span className="eyebrow">ESCOLHA SEU ACESSO</span><h2>Mais conhecimento, sem limitar sua criação.</h2><p>Os planos são ativados manualmente após a solicitação.</p></div><div className="plans-grid"><article className="plan-card"><span>GRATUITO</span><h3>R$ 0</h3><p>Para começar</p><ul><li>20 créditos iniciais</li><li>Pesquisa na biblioteca</li><li>Seleção de conhecimentos</li></ul><button>Plano atual</button></article><article className="plan-card featured"><span>PLUS</span><h3>R$ 15</h3><p>7 dias de acesso</p><ul><li>Geração ilimitada</li><li>Exportações ilimitadas</li><li>Ativação manual</li></ul><button>Solicitar Plus →</button></article><article className="plan-card"><span>MENSAL</span><h3>R$ 49</h3><p>1 mês de acesso</p><ul><li>Geração ilimitada</li><li>Exportações ilimitadas</li><li>Ativação manual</li></ul><button>Solicitar mensal →</button></article></div></div>}

function Admin({setPage}:{setPage:(p:Page)=>void}){return <div className="content"><div className="stats admin-stats"><div><small>USUÁRIOS</small><strong>0</strong><span>Contas cadastradas</span></div><div><small>LIVROS</small><strong>1</strong><span>Na biblioteca</span></div><div><small>CONHECIMENTOS</small><strong>0</strong><span>Prontos para pesquisa</span></div><div><small>PROCESSAMENTO</small><strong>0%</strong><span>Nenhum livro em fila</span></div></div><div className="admin-grid"><section className="panel admin-action"><span>01</span><h3>Biblioteca</h3><p>Gerencie os livros que alimentam o Content Brain.</p><button onClick={()=>setPage("livros")}>Abrir biblioteca →</button></section><section className="panel admin-action"><span>02</span><h3>Conhecimentos</h3><p>Revise os conhecimentos extraídos dos livros.</p><button onClick={()=>setPage("conhecimentos")}>Ver conhecimentos →</button></section><section className="panel admin-action"><span>03</span><h3>Usuários</h3><p>Controle créditos, planos e status das contas.</p><button onClick={()=>setPage("usuarios")}>Gerenciar usuários →</button></section></div></div>}
function AdminList({type}:{type:"livros"|"processamento"|"conhecimentos"|"usuarios"}){const cfg={livros:["BIBLIOTECA","Livros cadastrados","Seu acervo de livros será gerenciado aqui."],processamento:["PROCESSAMENTO","Fila de processamento","Acompanhe a extração de páginas e conhecimentos."],conhecimentos:["CONHECIMENTOS","Base de conhecimento","Revise e organize os conhecimentos extraídos."],usuarios:["USUÁRIOS","Usuários cadastrados","Gerencie contas, créditos e planos."]}[type];return <div className="content"><div className="admin-list-head"><div><span className="eyebrow">{cfg[0]}</span><h2>{cfg[1]}</h2><p>{cfg[2]}</p></div><button className="primary-large">{type==="livros"?"Adicionar livro":"Nova ação"} <b>+</b></button></div><div className="panel table-placeholder"><div className="table-head"><span>NOME</span><span>STATUS</span><span>ATUALIZAÇÃO</span><span>AÇÕES</span></div><div className="empty-row"><span>○</span><div><strong>Nenhum registro para exibir</strong><p>Esta área já está preparada para os dados reais do Supabase.</p></div></div></div></div>}

function Landing({open}:{open:(t:"login"|"signup")=>void}) {
 return <div className="page"><header className="header"><Logo/><nav><a href="#como">Como funciona</a><a href="#conhecimento">Conhecimento</a><a href="#recursos">Recursos</a></nav><button className="btn btn-outline" onClick={()=>open("login")}>Fazer login</button></header><main><section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="dot"/> BIBLIOTECA INTELIGENTE DE CONHECIMENTO</div><h1>Transforme livros em <em>conhecimento aplicável.</em></h1><p>Pesquise ideias, princípios e técnicas dentro de uma biblioteca selecionada de livros de negócios — e encontre conhecimento organizado para colocar em prática.</p><div className="actions"><button className="btn btn-primary" onClick={()=>open("signup")}>Cadastre-se grátis <span>→</span></button><button className="btn btn-link" onClick={()=>open("login")}>Já tenho uma conta</button></div><div className="trust"><span>✓</span> Comece com 20 créditos gratuitos</div></div><div className="preview-shell"><div className="preview-top"><span className="window-dot"/><span className="window-dot"/><span className="window-dot"/><span className="credits">20 créditos</span></div><div className="search-box"><span>⌕</span><span className="placeholder">O que você quer aprender?</span><kbd>⌘ K</kbd></div><div className="result-label">CONHECIMENTOS ENCONTRADOS</div>{results.slice(0,2).map(e=><div className="result" key={e.title}><div className="result-tag">{e.type}</div><h3>{e.title}</h3><p>{e.book}</p><div className="result-arrow">↗</div></div>)}<div className="more">+ procurar mais resultados</div></div></section><section id="como" className="steps"><div><span>01</span><h2>Pesquise</h2><p>Digite um tema, técnica ou princípio que deseja estudar.</p></div><div><span>02</span><h2>Selecione</h2><p>Encontre e organize os conhecimentos relevantes da biblioteca.</p></div><div><span>03</span><h2>Aplique</h2><p>Use os conhecimentos selecionados para criar e tomar decisões.</p></div></section><section id="conhecimento" className="statement"><p>Uma biblioteca feita para quem quer sair da informação e chegar à <strong>aplicação.</strong></p></section></main></div>;
}

export default function App(){
 const [mode,setMode]=useState<"landing"|"user"|"admin">("landing");
 const [page,setPage]=useState<Page>("dashboard");
 const [modal,setModal]=useState<"login"|"signup"|null>(null);
 void supabase.auth.getSession();
 const open=(t:"login"|"signup")=>setModal(t);
 if(mode==="landing") return <><Landing open={open}/>{modal&&<AuthModal type={modal} close={()=>setModal(null)} onEnter={(admin)=>{setModal(null);setMode(admin?"admin":"user");setPage(admin?"admin":"dashboard")}}/>}<button className="dev-preview" onClick={()=>{setMode("user");setPage("dashboard")}}>Pré-visualizar app</button></>;
 if(mode==="admin") return <AdminLayout page={page} setPage={setPage}>{page==="admin"?<Admin setPage={setPage}/>:<AdminList type={page as "livros"|"processamento"|"conhecimentos"|"usuarios"}/>}</AdminLayout>;
 return <UserLayout page={page} setPage={setPage}>{page==="dashboard"?<Dashboard setPage={setPage}/>:page==="pesquisa"?<Pesquisa setPage={setPage}/>:page==="selecionados"?<Selecionados setPage={setPage}/>:page==="ideias"?<Ideas setPage={setPage}/>:page==="gerar"?<Gerar setPage={setPage}/>:page==="historico"?<Historico/>:page==="conta"?<Conta/>:<Planos/>}</UserLayout>;
}

function AuthModal({type,close,onEnter}:{type:"login"|"signup";close:()=>void;onEnter:(admin:boolean)=>void}){
 const signup=type==="signup"; return <div className="modal-backdrop" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={close}>×</button><div className="modal-logo"><span>content</span><strong>brain</strong></div><h2>{signup?"Crie sua conta":"Bem-vindo de volta"}</h2><p>{signup?"Comece com 20 créditos gratuitos.":"Entre para continuar sua pesquisa."}</p>{signup&&<label>Nome<input placeholder="Seu nome"/></label>}<label>E-mail<input type="email" placeholder="seu@email.com"/></label><label>Senha<input type="password" placeholder="••••••••"/></label><button className="btn btn-primary full" onClick={()=>onEnter(false)}>{signup?"Criar conta":"Entrar"} <span>→</span></button><button className="demo-admin" onClick={()=>onEnter(true)}>Entrar na prévia administrativa</button><small>{signup?"Já tem uma conta? ":"Ainda não tem uma conta? "}<button className="switch" onClick={close}>{signup?"Fazer login":"Cadastre-se"}</button></small></div></div>;
}
