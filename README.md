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

## 1. Contatos (já configurados)

Tudo fica em **um único lugar**, no topo do `script.js`. Os dados vêm do Linktree oficial
da TekFrio (`linktr.ee/tekfriooficial`), que é o link "Agende pelo link" da bio:

```js
const CONFIG = {
  whatsapp: {
    'rio-grande': '5553999458966',          // (53) 99945-8966
    'sao-jose-do-norte': '5553981454087',   // (53) 98145-4087
    torres: '5551982206823',                // (51) 98220-6823
  },
  agendamento: 'https://linktr.ee/tekfriooficial',
  ...
};
```

- **Botões de cidade** (seção Regiões, FAQ, rodapé) abrem o WhatsApp daquela unidade com
  a mensagem da cidade.
- **Botões gerais** (orçamento, serviços, "Falar com a TekFrio", flutuante, barra do
  celular) abrem a janela **"Escolha sua cidade"** e levam ao WhatsApp escolhido com a
  mensagem do botão clicado.
- Se a empresa passar a usar um número só, troque o objeto por uma string
  (`whatsapp: '55...'`): a janela some e todos os botões vão direto para ele.
- Sem nenhum número válido, os botões abrem o Direct do Instagram.
- Sem JavaScript, os botões levam ao Linktree, que tem os três WhatsApps.
- **Agendamento:** "Agendar atendimento", "Agendar", "Agende pelo link" (rodapé) e a frase
  da pergunta "Como agendar um serviço?" apontam para o Linktree.

As mensagens estão em `MESSAGES`, logo abaixo do `CONFIG`. Os três telefones também
estão no JSON-LD do `<head>` (`contactPoint`); se mudarem, atualize os dois lugares.

## 2. Antes de publicar

| # | O que | Onde |
|---|---|---|
| 1 | Domínio | `index.html`: `canonical`, `og:url`, `og:image`, `twitter:image`, JSON-LD (marcados `TROCAR`). Hoje: `https://tekfrio.com.br/` |
| 2 | **Serviços de cada categoria** | ver seção 3 |
| 3 | Fotos reais e logotipo | ver seção 4. O logotipo atual (pinguim + TEKFRIO) não foi usado por falta do arquivo em boa resolução |

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
