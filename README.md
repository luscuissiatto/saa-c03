# SAA-C03 · estudo rápido

Material gratuito, em português, para a certificação **AWS Certified Solutions Architect – Associate (SAA-C03)**.

A ideia é simples: quase toda questão da prova se decide por uma ou duas palavras no enunciado, como "menor sobrecarga operacional", "UDP" ou "sem passar pela internet". Este site treina a ligação entre esse gatilho e o serviço certo.

## O que tem aqui

| | |
|---|---|
| **Aulas animadas** | 9 aulas de cerca de um minuto. Um diagrama se monta cena a cena e cada aula termina com uma pergunta. |
| **Flashcards** | 104 cartões com a pergunta na frente e o serviço certo, com o porquê, no verso. 57 estão marcados como essenciais. |
| **Quiz** | Os mesmos cartões em múltipla escolha, com as alternativas que mais confundem. |

Temas das aulas: RDS Multi-AZ vs. read replica · NAT gateway vs. endpoints · security group vs. NACL · SQS e SNS · classes do S3 · CloudFront vs. Global Accelerator · CloudTrail, Config e CloudWatch · gateways de rede · API Gateway, Storage Gateway e Gateway Load Balancer.

O progresso (cartões dominados e aulas feitas) fica salvo no `localStorage` do navegador. Não há servidor, login nem coleta de dados.

## Como usar

- **Online:** publique pelo GitHub Pages (abaixo) e abra o link.
- **Local:** baixe o repositório e abra o `index.html` no navegador. Não precisa instalar nada.

### Publicar no GitHub Pages

1. Envie os arquivos para um repositório público.
2. Em **Settings → Pages**, escolha **Deploy from a branch**, a branch `main` e a pasta `/ (root)`.
3. Em um ou dois minutos o site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

## Estrutura

```
index.html            página inicial
aulas.html            player das aulas animadas
flashcards.html       flashcards e quiz (quiz em flashcards.html#quiz)
assets/style.css      estilo compartilhado
assets/cards.js       banco de cartões (edite aqui para adicionar)
assets/flashcards.js  lógica dos flashcards e do quiz
assets/lessons-data.js  roteiro e diagramas das aulas
assets/aulas.js       player das aulas
```

## Como contribuir com um cartão

Abra `assets/cards.js` e adicione um objeto no mesmo formato:

```js
{
  "tema": "Rede e borda",
  "pergunta": "Qual serviço ...?",
  "opcoes": ["Alternativa A", "Alternativa B", "Alternativa C"],
  "correta": 1,            // índice da opção certa, começando em 0
  "explicacao": "Por que B está certa e por que as outras não servem.",
  "essencial": false
}
```

Algumas regras:

- **Escreva com suas palavras.** Não copie questões de simulados pagos nem de cursos.
- **Nunca publique questões da prova oficial.** Isso viola o contrato de confidencialidade da AWS Certification e pode cancelar a certificação de quem fez.
- A explicação deve dizer por que a certa é certa e por que a alternativa mais tentadora está errada.

## Aviso

Projeto independente de estudo, sem vínculo com a Amazon Web Services. AWS e os nomes de serviços citados são marcas da Amazon.com, Inc. ou de suas afiliadas. Os diagramas são simplificações para memorização; confira os detalhes na [documentação da AWS](https://docs.aws.amazon.com/) e no [guia oficial do exame](https://aws.amazon.com/certification/certified-solutions-architect-associate/).

## Licença

Código sob a licença MIT (veja `LICENSE`).
