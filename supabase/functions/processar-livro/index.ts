import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@^1";
import { getDocumentProxy } from "npm:unpdf@1.8.1";

const MAX_PAGES_PER_RUN = 25;

export default {
  fetch: withSupabase(
    { auth: ["publishable", "secret"] },
    async (req, ctx) => {
      try {
        const url = new URL(req.url);
        const livroId = url.searchParams.get("livro_id");
        const inicio = Math.max(1, Number(url.searchParams.get("inicio") ?? "1"));
        const limite = Math.min(
          MAX_PAGES_PER_RUN,
          Math.max(1, Number(url.searchParams.get("limite") ?? String(MAX_PAGES_PER_RUN))),
        );

        let query = ctx.supabase
          .from("livros")
          .select("id,titulo,autor,arquivo_path,status,total_paginas")
          .limit(1);

        if (livroId) {
          query = query.eq("id", livroId);
        } else {
          query = query.eq("status", "Pendente");
        }

        const { data: livro, error: erroLivro } = await query.maybeSingle();

        if (erroLivro) {
          return Response.json(
            { sucesso: false, etapa: "buscar_livro", erro: erroLivro.message },
            { status: 500 },
          );
        }

        if (!livro) {
          return Response.json(
            { sucesso: false, etapa: "buscar_livro", erro: "Livro não encontrado." },
            { status: 404 },
          );
        }

        if (!livro.arquivo_path) {
          return Response.json(
            { sucesso: false, etapa: "baixar_pdf", erro: "O livro não possui arquivo_path." },
            { status: 422 },
          );
        }

        const { data: arquivo, error: erroArquivo } = await ctx.supabase.storage
          .from("livros")
          .download(livro.arquivo_path);

        if (erroArquivo || !arquivo) {
          return Response.json(
            {
              sucesso: false,
              etapa: "baixar_pdf",
              erro: erroArquivo?.message ?? "PDF não encontrado no Storage.",
            },
            { status: 500 },
          );
        }

        const dadosPDF = new Uint8Array(await arquivo.arrayBuffer());
        const pdf = await getDocumentProxy(dadosPDF);

        const totalPaginas = pdf.numPages;
        const paginaFinal = Math.min(totalPaginas, inicio + limite - 1);

        if (inicio === 1) {
          await ctx.supabase.from("paginas").delete().eq("livro_id", livro.id);
        }

        await ctx.supabase
          .from("livros")
          .update({ status: "Processando", total_paginas: totalPaginas })
          .eq("id", livro.id);

        const paginas = [];

        for (let numeroPagina = inicio; numeroPagina <= paginaFinal; numeroPagina++) {
          const pagina = await pdf.getPage(numeroPagina);
          const content = await pagina.getTextContent();

          const texto = content.items
            .map((item: any) => ("str" in item ? String(item.str) : ""))
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();

          if (texto) {
            paginas.push({
              livro_id: livro.id,
              texto,
              numero_pagina: numeroPagina,
            });
          }

          pagina.cleanup();
        }

        await pdf.destroy();

        if (paginas.length > 0) {
          const { error: erroInsert } = await ctx.supabase
            .from("paginas")
            .insert(paginas);

          if (erroInsert) {
            return Response.json(
              { sucesso: false, etapa: "salvar_paginas", erro: erroInsert.message },
              { status: 500 },
            );
          }
        }

        const concluido = paginaFinal >= totalPaginas;

        if (concluido) {
          await ctx.supabase
            .from("livros")
            .update({
              status: "Processado",
              total_paginas: totalPaginas,
            })
            .eq("id", livro.id);
        }

        return Response.json({
          sucesso: true,
          etapa: concluido ? "processamento_concluido" : "lote_concluido",
          livro: livro.titulo,
          autor: livro.autor,
          total_paginas: totalPaginas,
          inicio,
          fim: paginaFinal,
          paginas_com_texto: paginas.length,
          proxima_pagina: concluido ? null : paginaFinal + 1,
          concluido,
        });
      } catch (error) {
        console.error("Erro inesperado:", error);

        return Response.json(
          {
            sucesso: false,
            etapa: "erro_inesperado",
            erro: error instanceof Error ? error.message : String(error),
          },
          { status: 500 },
        );
      }
    },
  ),
};
