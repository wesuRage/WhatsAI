const text = 
`WhatsAI - bot gaykkkk\n
\ncomandos:\n
\t$menu - mostra este menu.\n
\tTexto:\n
\t\t$gpt - perguntar pro chatGPT\n
\t\t$gpt-tts - chatGPT responde em audio\n
\n
\tGerar imagem:\n
\t\t$stab-diff - mt pica mas é uma lesma\n
\t\t$dall-e - gera rápido mas é meio paia\n 
\n
Por: baiano`;

export const Menu = async () => {    
    return { text: text };
};