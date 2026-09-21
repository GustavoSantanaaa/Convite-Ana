# Convite — Aniversário Ana Beatriz (21 anos)

Página de convite com:
- Confirmação de presença (nome, acompanhantes com nome individual, sim/não)
- Envio automático da confirmação por e-mail
- Link direto para o Google Maps
- Botão de contato via WhatsApp
- Favicon de bolo 🎂
- Layout responsivo (mobile e desktop)

## Estrutura

```
.
├── index.html          # página principal (frontend)
├── assets/convite.jpg   # imagem do convite
├── api/rsvp.js          # função serverless que envia o e-mail
├── package.json
└── README.md
```

## Passo a passo para o deploy na Vercel

### 1. Criar conta na Resend (envio de e-mail)

O envio de e-mail é feito pela [Resend](https://resend.com) — tem plano gratuito.

1. Crie uma conta em https://resend.com
2. No painel, vá em **API Keys** e crie uma chave (ex: `re_xxxxxxxx`)
3. **Importante — limite do modo de teste:** enquanto você não verificar um
   domínio próprio na Resend, só é possível enviar e-mails para o **endereço
   de e-mail com o qual você criou a conta na Resend**. Ou seja: crie a conta
   na Resend usando `anabiapereira655@gmail.com` (o e-mail que vai receber as
   confirmações), ou verifique um domínio próprio em **Domains** para poder
   enviar para qualquer destinatário.

### 2. Deploy na Vercel

Você pode subir esta pasta para um repositório no GitHub e importar na Vercel,
ou usar a CLI diretamente:

```bash
npm i -g vercel
cd convite-ana-beatriz
vercel
```

### 3. Configurar a variável de ambiente

No painel do projeto na Vercel: **Settings → Environment Variables**, adicione:

| Nome              | Valor                                  |
|-------------------|-----------------------------------------|
| `RESEND_API_KEY`  | a chave copiada no passo 1              |
| `EMAIL_FROM`      | (opcional) ex: `Convite <onboarding@resend.dev>` |

Depois de adicionar, faça um novo deploy (`vercel --prod`) para que a variável
seja aplicada.

### 4. Editar dados do evento (se precisar)

Tudo fica no `index.html`:
- Endereço / link do Maps: procure por `google.com/maps/search`
- Número de WhatsApp: procure por `wa.me/`
- E-mail de destino das confirmações: está em `api/rsvp.js`, na constante
  `DESTINATARIO`

## Testando localmente

```bash
vercel dev
```

Isso sobe o site e a função `/api/rsvp` localmente (lembre de configurar a
`RESEND_API_KEY` no arquivo `.env` local também).
