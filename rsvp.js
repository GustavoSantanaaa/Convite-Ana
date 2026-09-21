// Função serverless da Vercel: recebe a confirmação de presença e envia
// um e-mail via API da Resend (https://resend.com).
//
// Variáveis de ambiente necessárias (configurar no painel da Vercel):
//   RESEND_API_KEY  -> sua chave de API da Resend
//   EMAIL_FROM      -> (opcional) remetente, ex: "Convite <onboarding@resend.dev>"
//
// Veja o README.md para o passo a passo completo.

const DESTINATARIO = 'anabiapereira655@gmail.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }

  try {
    const { nome, presenca, acompanhantes, nomesAcompanhantes } = req.body || {};

    if (!nome || !presenca) {
      res.status(400).json({ error: 'Dados incompletos' });
      return;
    }

    const listaAcompanhantes =
      Array.isArray(nomesAcompanhantes) && nomesAcompanhantes.length > 0
        ? nomesAcompanhantes
            .filter(Boolean)
            .map((n, i) => `${i + 1}. ${n}`)
            .join('<br>')
        : 'Nenhum informado';

    const html = `
      <div style="font-family: Arial, sans-serif; color: #6b2140;">
        <h2 style="color:#d81b60;">Nova confirmação de presença 🎂</h2>
        <p><strong>Nome:</strong> ${escapeHtml(nome)}</p>
        <p><strong>Presença:</strong> ${presenca === 'sim' ? 'Confirmada ✅' : 'Não vai comparecer ❌'}</p>
        <p><strong>Número de acompanhantes:</strong> ${Number(acompanhantes) || 0}</p>
        <p><strong>Nomes dos acompanhantes:</strong><br>${listaAcompanhantes}</p>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Confirmação de Presença <onboarding@resend.dev>',
        to: DESTINATARIO,
        subject: `Confirmação de presença: ${nome}`,
        html,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Erro ao enviar via Resend:', errText);
      res.status(502).json({ error: 'Falha ao enviar e-mail' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erro interno em /api/rsvp:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
