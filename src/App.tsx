import { useState } from "react";

const examples=[
  {title:"Princípios fundamentais de vendas",book:"Conhecimento selecionado da biblioteca",tag:"VENDAS"},
  {title:"Liderar pelo exemplo",book:"Conhecimento selecionado da biblioteca",tag:"LIDERANÇA"}
];

export default function App(){
  const [login,setLogin]=useState(false);
  const [signup,setSignup]=useState(false);
  const open=(type:"login"|"signup")=>{setLogin(type==="login");setSignup(type==="signup")};

  return <div className="page">
    <header className="header">
      <a className="brand" href="#"><span>content</span><strong>brain</strong></a>
      <nav><a href="#como">Como funciona</a><a href="#conhecimento">Conhecimento</a><a href="#recursos">Recursos</a></nav>
      <button className="btn btn-outline" onClick={()=>open("login")}>Fazer login</button>
    </header>

    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="dot"/> BIBLIOTECA INTELIGENTE DE CONHECIMENTO</div>
          <h1>Transforme livros em <em>conhecimento aplicável.</em></h1>
          <p>Pesquise ideias, princípios e técnicas dentro de uma biblioteca selecionada de livros de negócios — e encontre conhecimento organizado para colocar em prática.</p>
          <div className="actions">
            <button className="btn btn-primary" onClick={()=>open("signup")}>Cadastre-se grátis <span>→</span></button>
            <button className="btn btn-link" onClick={()=>open("login")}>Já tenho uma conta</button>
          </div>
          <div className="trust"><span>✓</span> Comece com 20 créditos gratuitos</div>
        </div>

        <div className="preview-shell">
          <div className="preview-top"><span className="window-dot"/><span className="window-dot"/><span className="window-dot"/><span className="credits">20 créditos</span></div>
          <div className="search-box"><span>⌕</span><span className="placeholder">O que você quer aprender?</span><kbd>⌘ K</kbd></div>
          <div className="result-label">CONHECIMENTOS ENCONTRADOS</div>
          {examples.map((e,i)=><div className="result" key={e.title}><div className="result-tag">{e.tag}</div><h3>{e.title}</h3><p>{e.book}</p><div className="result-arrow">↗</div></div>)}
          <div className="more">+ procurar mais resultados</div>
        </div>
      </section>

      <section id="como" className="steps">
        <div><span>01</span><h2>Pesquise</h2><p>Digite um tema, técnica ou princípio que deseja estudar.</p></div>
        <div><span>02</span><h2>Selecione</h2><p>Encontre e organize os conhecimentos relevantes da biblioteca.</p></div>
        <div><span>03</span><h2>Aplique</h2><p>Use os conhecimentos selecionados para criar e tomar decisões.</p></div>
      </section>

      <section id="conhecimento" className="statement"><p>Uma biblioteca feita para quem quer sair da informação e chegar à <strong>aplicação.</strong></p></section>
    </main>

    {(login||signup)&&<div className="modal-backdrop" onClick={()=>{setLogin(false);setSignup(false)}}><div className="modal" onClick={e=>e.stopPropagation()}>
      <button className="close" onClick={()=>{setLogin(false);setSignup(false)}}>×</button>
      <div className="modal-logo"><span>content</span><strong>brain</strong></div>
      <h2>{signup?"Crie sua conta":"Bem-vindo de volta"}</h2>
      <p>{signup?"Comece com 20 créditos gratuitos.":"Entre para continuar sua pesquisa."}</p>
      <label>E-mail<input type="email" placeholder="seu@email.com"/></label>
      <label>Senha<input type="password" placeholder="••••••••"/></label>
      <button className="btn btn-primary full">{signup?"Criar conta":"Entrar"} <span>→</span></button>
      <small>{signup?"Já tem uma conta? ":"Ainda não tem uma conta? "}<button className="switch" onClick={()=>{setSignup(!signup);setLogin(!login)}}>{signup?"Fazer login":"Cadastre-se"}</button></small>
    </div></div>}
  </div>
}