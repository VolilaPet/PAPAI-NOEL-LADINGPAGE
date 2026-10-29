# Papai Noel Escalador — Vila Natalina

Versão completa e otimizada da landing page, pronta para um repositório GitHub. O index.html está na raiz e não precisa de compilação. As imagens, vídeos, estilos e scripts estão incluídos.

## Enviar ao GitHub
1. Extraia o arquivo compactado no computador usando WinRAR ou outro descompactador.
2. Crie um repositório no GitHub.
3. Envie os arquivos e a pasta assets para a raiz do repositório. O index.html deve aparecer diretamente na página inicial do repositório, ao lado deste README.md.
4. Envie o conteúdo extraído, não apenas o arquivo ZIP ou RAR: o GitHub não descompacta arquivos para publicar o site.
5. Confirme o envio com Commit changes.

## Publicar pelo GitHub Pages
Em Settings > Pages, escolha Deploy from a branch, selecione a branch usada (normalmente main), a pasta /(root) e clique em Save. Aguarde o endereço do site aparecer nessa tela.

Documentação oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

O servidor Node é apenas para a prévia local. No GitHub Pages, os arquivos são servidos diretamente; os cabeçalhos de compressão e cache são controlados pelo GitHub.

## Prévia local opcional
Com Node.js instalado, abra um terminal nesta pasta e execute npm run dev. Abra http://127.0.0.1:4175/. Não é necessário npm install.

## Arquivos principais
- index.html: conteúdo e seções.
- styles.css: aparência e responsividade.
- script.js: vídeo demonstrativo, FAQ, carrossel, seleção dos kits e compra.
- media.js: carregamento das mídias por proximidade.
- kits-config.js: os três links de checkout fornecidos.
- vendas.js e vendas.css: notificações identificadas como Simulação.
- assets/: mídias otimizadas e originais preservadas.

Preços e links de checkout foram preservados. A navegação usa caminhos relativos compatíveis com endereços GitHub Pages que contenham o nome do repositório.

Depois de publicar, confira o site no celular, teste os três destinos de checkout sem realizar pagamentos e repita o teste de velocidade na URL pública. Os testes locais não medem a hospedagem final.
