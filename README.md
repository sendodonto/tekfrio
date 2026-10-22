# TekFrio Refrigeração e Climatização

Landing page de captação de orçamentos. HTML, CSS e JavaScript puros, sem build e sem
dependências. Para ver localmente, basta abrir o `index.html` no navegador.

```
index.html     conteúdo, SEO e dados estruturados (HVACBusiness)
styles.css     sistema visual completo
script.js      CONFIG dos contatos, mensagens, abas de serviços, menu, galeria
img/           fotos em WebP, mapa do litoral do RS e imagem de compartilhamento
favicon.svg    ícone da aba
```

---

## 1. Ligar WhatsApp e agendamento

Os dois contatos ficam em **um único lugar**, no topo do `script.js`:

```js
const CONFIG = {
  whatsapp: '',     // ex.: '5553987654321'  (55 + DDD + número, só dígitos)
  agendamento: '',  // o link de agendamento do perfil, completo: 'https://...'
  ...
};
```

- **WhatsApp vazio (hoje):** os 19 botões abrem o Direct do Instagram
  (`ig.me/m/tekfriooficial`) e os textos dizem "Instagram". Nenhum número inventado.
- **WhatsApp preenchido:** todos viram `wa.me` com mensagem por contexto (geral, cada
  categoria, cada cidade, "falar com a equipe", dúvida); os textos passam a dizer
  "WhatsApp" e o número aparece formatado no rodapé.
- **Agendamento vazio (hoje):** nenhum botão de agendamento aparece.
- **Agendamento preenchido:** aparecem "Agendar atendimento" (Como funciona), "Agendar"
  (chamada final), "Agendamento online" (rodapé) e uma frase na pergunta "Como agendar
  um serviço?". Só aceita link que começa com `https://`.

As mensagens estão em `MESSAGES`, logo abaixo do `CONFIG`.

Com o telefone confirmado, adicione também `"telephone"` ao JSON-LD no `<head>`.

## 2. Antes de publicar

| # | O que | Onde |
|---|---|---|
| 1 | WhatsApp e link de agendamento | `script.js`, `CONFIG` |
| 2 | Domínio | `index.html`: `canonical`, `og:url`, `og:image`, `twitter:image`, JSON-LD (marcados `TROCAR`). Hoje: `https://tekfrio.com.br/` |
| 3 | **Serviços de cada categoria** | ver seção 3 |
| 4 | Fotos reais | ver seção 4 |

## 3. Categorias de serviço

As quatro categorias (Climatização, Refrigeração, Instalação e infraestrutura,
Manutenção e higienização) e os textos são os do briefing. O perfil confirma
refrigeração e climatização, mas **não detalha o catálogo**: confirme com a TekFrio o
que entra em cada categoria.

Cada categoria é um bloco `<article class="svc__panel">` no `index.html`, com o botão
de aba correspondente (`<button class="svc__tab">`) logo acima. Para remover uma
categoria, apague o par (aba + painel). Para criar outra, copie um par, troque os
`id`/`aria-controls`/`aria-labelledby` e adicione a mensagem em `MESSAGES`.

No desktop as categorias funcionam como abas; no celular (e sem JavaScript) aparecem
empilhadas.

## 4. Trocar as fotos

Todas as fotos atuais são do Pexels, usadas como ilustração. A galeria avisa
"Imagens ilustrativas" e o rodapé cita a origem. **Esses avisos só saem quando as fotos
forem da TekFrio** (o Instagram tem serviços e antes e depois).

| Arquivo | Onde |
|---|---|
| `hero-1600.webp` + `hero-900.webp` | hero (recortada perto do quadrado; o aparelho deve ficar à direita) |
| `svc-climatizacao/refrigeracao/instalacao/manutencao.webp` | painéis de serviço |
| `cta.webp` | chamada final |
| `gal-*.webp` + `gal-*-lg.webp` | galeria (a `-lg` abre ampliada); `gal-manutencao` é o quadro alto |
| `og.jpg` | prévia ao compartilhar, 1200x630 |

Ao trocar, atualize `alt`, `width` e `height` da `<img>` e, na galeria, o `data-caption`.
Converter: `ffmpeg -i foto.jpg -vf scale=900:-2 -c:v libwebp -quality 78 gal-x.webp`

## 5. Decisões do projeto

- **Dados da empresa:** "10 anos" e "+10 mil clientes" vêm do perfil da TekFrio e
  aparecem sempre com a nota "Dados divulgados pela TekFrio".
- **Cores:** azul-marinho `#17265C` para estrutura e sofisticação; amarelo `#FFD943` só
  em botões e pequenos detalhes (marca-texto do título, filetes, marcadores).
- **Forma:** botões com 8px, cards e fotos com 16px, bloco da chamada final com 24px.
- **Ícones:** Tabler (traço linear), embutidos como sprite SVG.
- **Mapa:** recorte estático do OpenStreetMap com a atribuição obrigatória. Rio Grande e
  São José do Norte ficam a poucos quilômetros um do outro, por isso dividem um marcador.
- **Contato fixo:** no desktop, botão flutuante amarelo; no celular, a barra inferior
  tem o botão de orçamento e o atalho redondo de contato (o `body` reserva o espaço).
- **Sem listener de scroll**: tudo por `IntersectionObserver`. Movimento reduzido é
  respeitado.
