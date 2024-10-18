const getEmailTemplate = ({ token, username, supportEmail, telefono }) => `
  <div>  
    <p>Hola ${username},</p>
    <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si no has solicitado este cambio, por favor, ignora este correo.</p>
    <p>Para restablecer tu contraseña, sigue estos pasos:</p>
    <ol>
      <li>Haz clic en el siguiente enlace o cópialo y pégalo en tu navegador:</li>
      <p><a href="${token}">Restablecer Contraseña</a></p>
      <li>Ingresa y confirma tu nueva contraseña en la página que se abrirá.</li>
    </ol>
    <p>Por razones de seguridad, este enlace solo será válido por 2 minutos. Si el enlace expira, deberás solicitar un nuevo correo de <a href="#">activación de cuenta</a>.</p>
    <p>Si tienes alguna pregunta o necesitas ayuda adicional, no dudes en contactarnos a través de <a href="mailto:${supportEmail}">${supportEmail}</a> o llamando al <a href="tel:${telefono}">${telefono}</a>.</p>
    <p>Gracias por tu atención.</p>
  </div>
`;

module.exports = {
  getEmailTemplate
}