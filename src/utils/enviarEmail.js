const nodemailer = require('nodemailer')

// Configuração do Gmail (usa "Senha de App", não a senha normal da conta)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

async function enviarEmailLicenca({ destinatario, nomeCliente, chaveLicenca, plano, linkDownload }) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(180deg, #0D2E6E, #2557C7); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <div style="display:inline-block; background:#FFCC00; color:#0D2E6E; font-weight:900; font-size:24px; padding:12px 20px; border-radius:12px;">Mx</div>
        <h1 style="color: #fff; margin: 16px 0 4px;">MobilixStore</h1>
        <p style="color: #FFCC00; margin: 0; font-size: 13px; letter-spacing: 1px;">GESTÃO COMPLETA PARA LOJAS</p>
      </div>

      <div style="background: #fff; padding: 30px; border: 1px solid #E2E8F8; border-top: none;">
        <h2 style="color: #0D2E6E;">Olá, ${nomeCliente}! 🎉</h2>
        <p style="color: #374151; line-height: 1.6;">
          Sua compra do <strong>${plano.nome}</strong> foi confirmada com sucesso!
          Agora você já pode baixar e instalar o MobilixStore no seu computador.
        </p>

        <div style="background: #F0F4FF; border-radius: 10px; padding: 20px; margin: 24px 0; text-align: center;">
          <div style="font-size: 11px; font-weight: 700; color: #7A8EBA; text-transform: uppercase; margin-bottom: 8px;">Sua Chave de Licença</div>
          <div style="font-size: 22px; font-weight: 900; color: #0D2E6E; letter-spacing: 2px; font-family: monospace;">${chaveLicenca}</div>
          <div style="font-size: 12px; color: #7A8EBA; margin-top: 8px;">Válida para ${plano.maquinas} computador(es)</div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${linkDownload}" style="background: #0D2E6E; color: #fff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 800; display: inline-block;">
            📥 Baixar MobilixStore
          </a>
        </div>

        <div style="background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 8px; padding: 14px; font-size: 13px; color: #C2410C;">
          💡 <strong>Como ativar:</strong> Depois de instalar, abra o programa e cole a chave de licença acima na tela de ativação.
        </div>

        <p style="color: #7A8EBA; font-size: 12px; margin-top: 30px; text-align: center;">
          Guarde este email com cuidado — sua chave de licença é pessoal e intransferível.<br>
          Dúvidas? Fale com a gente pelo WhatsApp ou responda este email.
        </p>
      </div>

      <div style="text-align: center; padding: 16px; color: #B0BDD8; font-size: 11px;">
        Mobilix Soluções Digitais · Arame, MA
      </div>
    </div>
  `

  await transporter.sendMail({
    from: '"Mobilix Soluções Digitais" <' + process.env.GMAIL_USER + '>',
    to: destinatario,
    subject: '🎉 Sua licença do MobilixStore chegou!',
    html,
  })
}

module.exports = { enviarEmailLicenca }
