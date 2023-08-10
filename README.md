# WhatsAI

Um bot de WhatsApp que usa o ChatGPT para geração de texto e DALL-E para geração de imagens!

### Uso

- Texto: 
    - ChatGPT: `$gpt {pergunta}` (Normal, como o ChatGPT)
    - Antônio-bot: `$ab {pergunta}` (Te responde de maneira "educada")
    - TigresaVIP: `$tg {pergunta}` (Vai ser sua nova namorada)
- Imagem: 
    - DALL-E: `$dall-e {prompt de imagem}` (Adicione o argumento "--four" para 4 resultados)
    - DALL-Var: `$dall-var {variação da imagem}`
- Sticker: `$sticker` (Marque um video/foto ou envie direto um video/foto, e receberá uma figurinha)

### Instalação

- Instale o **ffmpeg**.
- Configure seu arquivo `.env` com sua [***API Key da OpenAI***](https://beta.openai.com/account/api-keys):

```s
OPENAI_API_KEY="SUA_API_KEY"
```

- Faça a autenticação com o WhatsApp escaneando o QR Code que aparecerá no terminal.

# Execução

### Compilando o código
- Primeiro rode `npm run build`
- E então execute o código com `npm start`

### Execução para testes
- Execute o código com `npm run dev`
- Dê uma olhada nos scripts do `package.json` para testes isolados ou debugs


> ### Em erros de conexão com o WhatsApp
> *Você talvez tenha que rodar o código duas vezes, já que aparentemente tem um bug na dependência do Baileys. Então para isso siga os passos:*

> - Escaneie o QR Code e espere até a tela de scan fechar.
> - Pare a execução no terminal com `Ctrl + C`
> - Execute o código de novo.
