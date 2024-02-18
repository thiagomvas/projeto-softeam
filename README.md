## Setup
Para rodar o projeto, será necessario dois terminais, um para ser o host do servidor, e outro para ser o host da pagina.
- Primeiramente, clone o projeto com
```bash
git clone https://github.com/thiagomvas/projeto-softeam.git
cd projeto-softeam
```
- Instale todas as dependencias com
```
npm install
```

- Em seguida, para rodar a pagina, execute
```shell
npm run dev
```
Abra o link localhost exibido no console

- Em outro terminal, abra o mesmo diretorio que foi clonado, pois ele servirá para rodar o servidor e execute o comando
```
node src/server.js
```
O servidor estará online quando exibir uma mensagem de confirmação.

## Uso
Existem dois logins publicos, um cujo usuario e senha é ``aluno`` e outro que é ``professor``, ou se preferir, pode se registrar
