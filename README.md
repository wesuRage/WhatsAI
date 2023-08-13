# WhatsAI

Um bot de WhatsApp que usa o ChatGPT para geração de texto e DALL-E para geração de imagens!

### Uso

- Texto: 
    - ChatGPT-3.5: `$gpt {pergunta}` (Versão (grátis) mais atual do ChatGPT)
    - ChatGPT-3: `$gpt3 {pergunta}` (Versão (grátis) antiga)
    - Antônio-bot: `$ab {pergunta}` (Te responde de maneira "educada")
    - TigresaVIP: `$tg {pergunta}` (Vai ser sua nova namorada)
    > Em dispositivos onde o recurso de streaming ainda não está disponível, atualize seu WhatsApp ou use os estáticos: $gpts, $gpt3s, $abs e $tgs.
- Imagem: 
    - DALL-E: `$dall-e {prompt de imagem}` (Adicione o argumento "--four" para 4 resultados)
    - DALL-Var: `$dall-var {variação de imagem}`
- Sticker: `$sticker` (Marque ou envie em uma foto/video para receber uma figurinha)

### Instalação

- Instale o **ffmpeg**.
- Configure seu arquivo `.env` com sua [***API Key da OpenAI***](https://platform.openai.com/account/api-keys):

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


### Em erros de conexão com o WhatsApp
*Você talvez tenha que rodar o código duas vezes, já que aparentemente tem um bug na dependência do Baileys. Então para isso siga os passos:*

- Escaneie o QR Code e espere até a tela de scan fechar.
- Pare a execução no terminal com `Ctrl + C`
- Execute o código de novo.
