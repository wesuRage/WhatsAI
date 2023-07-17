# WhatsAI

Um bot de WhatsApp que usa o ChatGPT para geração de texto e DALL-E e Stable-Diffusion para geração de imagens!

### Uso

- Texto: 
    - ChatGPT: `$gpt {pergunta}` (Normal, como o ChatGPT)
    - GPTroll: `$gptroll {pergunta}` (Manda respostas incorretas e engraçadas)
    - Antônio-bot: `$ab {pergunta}` (Te responde de maneira "educada")
- Imagem: 
    - stable-diffusion-2.1: `$stab-diff {prompt de imagem}`
    - DALL-E: `$dall-e {prompt de imagem}` (Adicione o argumento "--four" para 4 resultados)
    - DALL-Var: `$dall-var {variação da imagem}`
- Sticker: `$sticker` (Marque um video/foto ou envie direto um video/foto, e receberá uma figurinha)

### Instalação

- Instale o **ffmpeg** via `apt`
    ```s
    sudo apt install ffmpeg -y
    ``` 
    - Ou pelo [***site***](https://ffmpeg.org/download.html).
- Instale todas as dependencias com `npm i -y`.
- Configure seu arquivo `.env` com sua [***API Key da OpenAI***](https://beta.openai.com/account/api-keys):

```s
OPENAI_API_KEY="SUA_API_KEY"
```

- Faça a autenticação com o WhatsApp escaneando o QR Code que aparecerá no terminal.
##### Stable Diffusion
- Verifique se o arquivo [***requirements.txt***](https://github.com/wesuRage/WhatsAI/blob/main/requirements.txt) está devidamente configurado para seu sistema. E então execute `pip3 install -r ./requirements.txt`.
- Somente **Python 3.9** tem suporte para **pytorch CPU/GPU** para geração de imagens localmente. [***Instale-o***](https://www.python.org/downloads/release/python-390/) ou [***compile o código fonte***](https://github.com/python/cpython/tree/3.9).
- É preciso **Microsoft Visual C++ 14.0** ou mais atualizado para geração de imagens com o stable-diffusion. Para isso, instale o [***Microsoft C++ Build Tools***](https://visualstudio.microsoft.com/visual-cpp-build-tools/).

# Execução

### Compilando o código
- Primeiro rode `npm run build`
- E então execute o código com `npm start`

### Execução para testes
- Execute o código com `npm run dev`
- Dê uma olhada nos scripts do `package.json` para testes isolados ou debugs

### Restart

Em produção, você pode e **deve** resetar o bot após um período de tempo para previnir um bug do Baileys parar de detectar novas mensagens. Para isso, descomente a [***linha 436***](https://github.com/wesuRage/WhatsAI/blob/6458aa9aab667c154fe29bd9b56e0fc7a7422ca8/src/bot.ts#L436) no arquivo `src/bot.ts`.

> ### Em erros de conexão com o WhatsApp
> *Você talvez tenha que rodar o código duas vezes, já que aparentemente tem um bug na dependencia do Baileys. Então para isso siga os passos:*

> - Escaneie o QR Code e espere até a tela de scan fechar.
> - Pare a execução no terminal com `Ctrl + C`
> - Execute o código de novo.
