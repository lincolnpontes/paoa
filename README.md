# PAOA Lab

App didático em formato PWA para a disciplina **Processamento de Alimentos de Origem Animal**.

## O que o app faz

- Cadastra produtos, como hambúrguer, linguiça, mortadela, queijo, pescado e outros.
- Cadastra insumos e a função tecnológica de cada um.
- Monta formulações em porcentagem e calcula automaticamente os gramas para qualquer peso.
- Estima gordura, proteína, carboidratos, proteína não cárnea e custo do lote.
- Exibe alertas técnicos e legais para hambúrguer com base nos parâmetros cadastrados.
- Guarda fotos dos produtos e das práticas no próprio navegador.
- Organiza roteiro de aula prática, pontos de controle e perguntas para discussão.
- Exporta e importa os dados em JSON.
- Funciona como PWA instalável e pode ser publicado no GitHub Pages.

## Como usar localmente

Abra o arquivo `index.html` em um navegador moderno. Para testar o funcionamento como PWA/offline, é melhor usar um servidor local, por exemplo:

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

## Como publicar no GitHub Pages

1. Crie um novo repositório no GitHub.
2. Envie todos os arquivos desta pasta para o repositório.
3. Vá em **Settings > Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/root`.
6. Salve e aguarde o link ser gerado.

## Arquivos principais

- `index.html`: estrutura das telas e modais.
- `style.css`: layout do app.
- `app.js`: lógica de cadastro, cálculo, validação, backup e relatórios.
- `manifest.json`: configuração do PWA.
- `service-worker.js`: cache offline básico.
- `icon.png`: ícone do app.

## Observação sobre legislação

A base legal incluída é didática. Antes de usar as informações em documentos oficiais, processos de registro, inspeção ou rotulagem real, consulte sempre a norma vigente diretamente no órgão competente.
