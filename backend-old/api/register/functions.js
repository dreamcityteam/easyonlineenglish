const formatPhoneNumber = (phoneNumber = '') =>
  phoneNumber
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

const getEmailTemplate = ({ token, username, supportEmail, telefono }) => `
  <div>  
    <p>Hola ${username},</p>
    <p>Hemos recibido una solicitud para la activación de su cuenta. Si no ha solicitado este cambio, por favor, ignore este correo.</p>
    <p>Para activar tu cuenta, sigue estos pasos:</p>
    <ol>
      <li>Haz clic en el siguiente enlace o cópialo y pégalo en tu navegador:</li>
      <p><a href="${token}">activar cuenta</a></p>
    </ol>
    <p>Por razones de seguridad, este enlace solo será válido por 24 horas. Si el enlace expira, deberás solicitar uno nuevo.</p>
    <p>Si tienes alguna pregunta o necesitas ayuda adicional, no dudes en contactarnos a través de <a href="mailto:${supportEmail}">${supportEmail}</a> o llamando al <a href="tel:${telefono}">${telefono}</a>.</p>
    <p>Gracias por tu atención.</p>
  </div>
`;

module.exports = {
  formatPhoneNumber,
  getEmailTemplate
}