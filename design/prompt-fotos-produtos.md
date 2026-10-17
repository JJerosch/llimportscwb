# Prompt: buscar 1 foto de cada produto do catálogo da LL Imports

Copie tudo abaixo da linha e cole na outra IA.

---

## Contexto
Estou montando o catálogo de uma loja de produtos Apple (LL Imports, Curitiba/PR). Preciso de **1 foto de produto por item** da lista abaixo, em **alta qualidade**, para substituir fotos ruins de marketplace.

## O que eu preciso que você faça
Para **cada produto** da lista (65 itens), encontre **uma** imagem que atenda aos requisitos e me devolva o **link direto da imagem**.

### Requisitos da imagem
1. É **foto de produto oficial ou de qualidade equivalente**: o aparelho inteiro, sem pessoas, sem texto sobreposto, sem selos, sem marca d'água, sem montagem com vários produtos (exceto AirPods, que podem aparecer fone + estojo).
2. **Fundo branco, liso ou transparente** (PNG com transparência é o ideal).
3. **Resolução mínima de 1000 px no menor lado** (ideal 1500 px ou mais). Informe a resolução real.
4. **Mesma cor do produto do nome**, quando houver cor no nome (ex.: "meia-noite", "estrelar", "azul céu", "natural", "preto"). Se não achar a cor exata, devolva outra cor do mesmo modelo e marque `cor_exata = não`.
5. **Mesmo modelo, tamanho e geração**. Não troque iPhone 16 Pro por 16 Pro Max, nem Watch 42 mm por 46 mm quando a imagem mostrar o tamanho. Se só existir imagem de outra variante, marque `modelo_exato = não`.
6. Prefira, nesta ordem: (a) imagens do **Apple Newsroom / Apple Store / páginas oficiais da Apple Brasil**, (b) imagens oficiais de varejistas autorizados e (c) bancos de imagem com licença clara. **Não use** imagens de Mercado Livre, Shopee, AliExpress, Pinterest ou da própria llimportscwb.com.br.

### Regras de honestidade (importante)
- **Só me passe links que você abriu e verificou** que existem e mostram o produto certo. **Nunca invente URL** nem complete um link "por padrão".
- O link deve ser **direto para o arquivo de imagem** (termina em .png, .jpg, .webp ou é um endpoint de imagem que abre a imagem sozinho), não a página que a contém. Informe também a **página de origem**.
- Se **não achar** um item (comum em modelos antigos que a Apple não vende mais, como iPhone 11 a 15 e Apple Watch SE 2), **escreva "NÃO ENCONTRADO"** naquela linha e diga o motivo. Isso é melhor que uma imagem errada.
- Para cada imagem, diga em uma palavra a **licença/termos** da fonte (ex.: "Apple Newsroom, uso editorial", "banco X, licença Y", "desconhecida"). Não afirme que a imagem é livre de direitos se não tiver certeza.

## Formato da resposta
Devolva **uma tabela CSV** (separador ponto e vírgula) em um único bloco de código, **uma linha por id**, mantendo a ordem da lista, com estas colunas:

`id;produto;url_imagem;pagina_origem;largura_px;altura_px;formato;fundo;cor_exata;modelo_exato;licenca;observacao`

Depois do CSV, liste separadamente os ids **NÃO ENCONTRADOS** e os que têm **cor_exata = não** ou **modelo_exato = não**.

## Dica de busca
Para produtos atuais, as imagens costumam estar em páginas de compra e de comparação da Apple Brasil (apple.com/br) e no Apple Newsroom. Para itens com várias cores, ajuste a cor no seletor da página e capture a imagem daquela cor. Use o nome exato do produto na busca, com "Apple" e o ano de lançamento.

## Lista de produtos

| id | categoria | produto (nome completo) |
|---|---|---|
| 3404 | iPhone | iPhone 16 Pro Max |
| 3372 | iPhone | iPhone 17 Pro Max |
| 3025 | iPhone | iPhone 16 Plus |
| 3018 | iPhone | iPhone 16e |
| 3011 | iPhone | iPhone 15 Pro Max |
| 2997 | iPhone | iPhone 15 Pro |
| 2986 | iPhone | iPhone 15 Plus |
| 2976 | iPhone | iPhone 15 |
| 2971 | iPhone | iPhone 14 Pro |
| 2970 | iPhone | iPhone 14 Pro Max |
| 2954 | iPhone | iPhone 14 |
| 2942 | iPhone | iPhone 13 |
| 2916 | iPhone | iPhone 12 Pro Max |
| 2856 | iPhone | iPhone 13 Pro Max |
| 2839 | iPhone | iPhone 13 Pro |
| 2810 | iPhone | iPhone 12 Pro |
| 2798 | iPhone | iPhone 12 |
| 2791 | iPhone | iPhone 11 |
| 2765 | iPhone | iPhone 16 Pro |
| 1089 | iPhone | iPhone 16 |
| 629 | iPhone | iPhone 17 Pro |
| 325 | iPhone | iPhone 17 |
| 106 | iPhone | iPhone Air |
| 2732 | MacBook | MacBook Air M4 |
| 2731 | MacBook | MacBook Air 13″ M4 16GB 256GB meia-noite |
| 2730 | MacBook | MacBook Air 13″ M4 16GB 256GB estrelar |
| 2729 | MacBook | MacBook Air 13″ M4 16GB 256GB azul céu |
| 2727 | MacBook | MacBook Air 13″ M4 16GB 512GB prata |
| 2726 | MacBook | MacBook Air 15″ M4 16GB 256GB prata |
| 2725 | MacBook | MacBook Air 15″ M4 16GB 256GB meia-noite |
| 2724 | MacBook | MacBook Air 15″ M4 16GB 256GB azul céu |
| 2723 | MacBook | MacBook Pro 14″ M4 16GB 512GB |
| 2655 | MacBook | MacBook Pro 14″ M4 Pro 24GB 512GB (preto espacial) |
| 2738 | Mac mini | Mac Mini M2 8gb 256gb |
| 2735 | Mac mini | Mac Mini M4 16GB 256GB |
| 2682 | iPad | iPad Pro 11″ M5 256GB preto |
| 2680 | iPad | iPad Mini 7 A17 Pro 128GB estrelar |
| 2650 | iPad | iPad 11 prata |
| 2649 | iPad | iPad Air 7 11″ M3 128GB azul |
| 2648 | iPad | iPad Air 7 11″ M3 128GB cinza espacial |
| 2647 | iPad | iPad Air 7 11″ M3 128GB Estrelar |
| 2646 | iPad | iPad Air 7 11″ M3 128GB roxo |
| 2644 | iPad | iPad 11 rosa |
| 2716 | Apple Watch | Apple Watch ultra 3 natural |
| 2713 | Apple Watch | Apple Watch ultra 3 preto |
| 2711 | Apple Watch | Apple Watch ultra 2 preto |
| 2710 | Apple Watch | Apple Watch 11 46MM cinza espacial |
| 2709 | Apple Watch | Apple Watch 11 46MM preto brilhante |
| 2708 | Apple Watch | Apple Watch 11 42MM prata |
| 2707 | Apple Watch | Apple Watch 11 42MM preto brilhante |
| 2706 | Apple Watch | Apple Watch 11 42MM ouro-rosa |
| 2701 | Apple Watch | Apple Watch 11 42MM cinza espacial |
| 2700 | Apple Watch | Apple Watch SE 3 44MM meia-noite |
| 2699 | Apple Watch | Apple Watch SE 3 44MM estrelar |
| 2698 | Apple Watch | Apple Watch SE 3 40MM estrelar |
| 2695 | Apple Watch | Apple Watch SE 3 40MM meia-noite |
| 2694 | Apple Watch | Apple Watch SE 2 44MM preto |
| 2693 | Apple Watch | Apple Watch SE 2 40MM estrelar |
| 2690 | Apple Watch | Apple Watch SE 2 40MM meia-noite |
| 2657 | Apple Watch | Apple Watch |
| 2742 | Acessórios | AirPods 4 ANC |
| 2739 | Acessórios | AirPods 4 |
| 2689 | Acessórios | Apple Pencil USB-C |
| 2688 | Acessórios | Apple Pencil Pro |
| 2684 | Acessórios | Apple Pencil 2 |

---
