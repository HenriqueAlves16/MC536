# Como usar

1) **Instalar o Node.js e o npm (Node Package Manager)**
    * Visite o site https://nodejs.org/pt e instale a versão mais recente do Node
    * Após a instalação, você pode verificar se o Node.js e o npm foram instalado corretamente com os comandos:
    `node -v` e `npm -v`

2) **Instalar o Live Server (Visual Studio Code)**
    * Instale a extensão *Live Server* no VSCode
    * Abra as configurações do VSCode e pesquise por 'Live Server'. Abra o arquivo *settings.json*
    * Em "liveServer.settings.ignoreFiles" adicione `"**/*.db"`. Exemplo:

    ```
    "liveServer.settings.ignoreFiles": [
        ".vscode/**",
        "**/*.scss",
        "**/*.sass",
        "**/*.ts",
        "**/*.db",
    ]
    ```

3) **Configure o projeto**
    * Clone o repositório
    * Execute `npm init -y` que criará um arquivo package.json, que irá gerenciar as dependências do projeto.
    * Instalar o Express (framework para criar o servidor web), sqlite3 e cors: `npm install express sqlite3 cors`
  
4) **Rode a aplicação**
   * Clique no botão 'Go Live' no canto inferior esquerdo do VSCode 
   * Navegue para a URL http://127.0.0.1:5500/homepage.html em seu navegador (assumindo que o Live Server esteja rodando na porta 5500)
