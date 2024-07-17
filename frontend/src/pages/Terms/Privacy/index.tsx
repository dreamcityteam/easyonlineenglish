import React from 'react';
import style from '../style.module.sass';
import useScrollToTop from '../../../components/ScrollUp';

interface Props {
  removeH1?: boolean;
}

const PrivacyPolicy: React.FC<Props> = ({ removeH1 }): JSX.Element => {
  useScrollToTop();

  const Tag = removeH1 ? 'h2' : 'h1';

  return (
    <section className={style.terms}>
      <div className={style.terms__container}>
        <Tag>Política de Privacidad de Easy Online English</Tag>
        <p>
          Esta Política de Privacidad detalla las prácticas de procesamiento de datos de Easy Online English. Nos comprometemos a proteger la privacidad y seguridad de la información personal que recibimos y gestionamos, y a responder de manera adecuada y oportuna a las solicitudes e instrucciones relacionadas con los datos personales, en cumplimiento con los requisitos legales aplicables. Para garantizar un manejo adecuado de estas solicitudes, hemos establecido un proceso específico para gestionar las solicitudes de información personal. Este proceso nos permite atender eficazmente las consultas de las personas que buscan información o acción sobre los datos personales que hemos recopilado y cómo utilizamos esa información. Si desea solicitar información o tomar medidas en relación con los datos personales que hemos recopilado sobre usted, o ejercer sus derechos de protección de datos, le pedimos que envíe un correo electrónico a <a href="mailto:support@easyonlineenglish.com">support@easyonlineenglish.com</a>.
        </p>

        <h3>Información que recopilamos</h3>
        <p>
          Recopilamos varios tipos de información para proporcionarle nuestros servicios, mejorar nuestra oferta y cumplir con nuestras obligaciones legales. Entre estas se encuentran:
        </p>
        <ul>
          <li>Nombre completo</li>
          <li>Nombre de usuario</li>
          <li>Número de teléfono</li>
          <li>Correo electrónico</li>
          <li>Contraseña</li>
          <li>Datos bancarios.</li>
        </ul>
        <p>
          Debido al sistema de membresía recurrente de Easy Online English, recopilamos la información de la tarjeta bancaria de nuestros usuarios, incluyendo el número de tarjeta, el CVC y la fecha de expiración. Los datos recopilados por nosotros se almacenan en una base de datos segura y se gestionan conforme a los estándares impuestos por la PCI DSS (Payment Card Industry Data Security Standard), cuyo enlace se encuentra más abajo. Esto garantiza que su información bancaria se maneje con el máximo nivel de seguridad y confidencialidad.
        </p>

        <h3>Uso de la Información</h3>
        <p>
          La información que recopilamos se utiliza para los siguientes propósitos:
        </p>
        <ul>
          <li>Proveer y administrar nuestros servicios de cursos de inglés.</li>
          <li>Brindar un servicio personalizado y adaptar el contenido a sus necesidades.</li>
          <li>Reportar pagos y registrar transacciones.</li>
          <li>Comunicarnos con usted, responder a sus consultas y proporcionarle soporte técnico.</li>
          <li>Mejorar y optimizar nuestra plataforma y servicios.</li>
          <li>Cumplir con obligaciones legales y reguladoras.</li>
        </ul>

        <h3>Divulgación de la Información</h3>
        <p>
          No vendemos, intercambiamos ni alquilamos su información personal a terceros. Sin embargo, podemos compartir su información en las siguientes circunstancias:
        </p>
        <ul>
          <li>Proveedores de Servicios: Podemos compartir información con proveedores de servicios que nos asisten en la operación de nuestro negocio y la prestación de servicios, siempre y cuando estos proveedores se comprometan a proteger la información.</li>
          <li>Requisitos Legales: Podemos divulgar su información cuando sea requerido por ley o en respuesta a solicitudes legales válidas por parte de autoridades públicas.</li>
          <li>Seguridad y Protección: Para proteger y defender los derechos y la propiedad de la Empresa y sus usuarios, y para actuar en circunstancias urgentes para proteger la seguridad personal.</li>
        </ul>

        <h3>Seguridad de la Información</h3>
        <p>
          Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. Aunque nos esforzamos por proteger su información, no podemos garantizar la seguridad absoluta de los datos transmitidos a través de Internet.
        </p>
        <p>
          Easy Online English se compromete a seguir los estándares de seguridad de datos de la industria de tarjetas de pago, mejor conocido como PCI DSS. Para más información sobre esta política en específico, favor visitar la página <a href="http://www.pcisecuritystandards.org">www.pcisecuritystandards.org</a>.
        </p>

        <h3>Derechos del Usuario</h3>
        <p>
          Usted tiene derecho a:
        </p>
        <ul>
          <li>Acceder a su información personal que tenemos.</li>
          <li>Solicitar la corrección de datos incorrectos o incompletos.</li>
          <li>Solicitar la eliminación de su información personal, sujeto a ciertas excepciones legales.</li>
          <li>Oponerse al procesamiento de su información personal en algunas circunstancias.</li>
          <li>Retirar su consentimiento en cualquier momento, cuando el procesamiento se base en el consentimiento.</li>
        </ul>
        <p>
          Para ejercer sus derechos, puede contactarnos a través de <a href="mailto:support@easyonlineenglish.com">support@easyonlineenglish.com</a>.
        </p>

        <h3>Uso de Cookies</h3>
        <p>
          Utilizamos cookies y otros dispositivos de seguimiento para ayudar a personalizar su uso de nuestros sitios. Una cookie es una pequeña porción de información que el servidor web envía al disco duro de su computadora para que el sitio web pueda recordar quién es usted. Esta información puede incluir información relacionada con su uso de nuestros sitios, información sobre su computadora, como la dirección IP de la computadora y el tipo de navegador, datos demográficos y, si llegó a nuestro sitio a través de un enlace desde un sitio de terceros, la URL de la página de enlace. Si es un usuario registrado, esto puede incluir su nombre y dirección de correo electrónico para fines de verificación.
        </p>
        <p>
          Utilizamos información de cookies para fines que pueden incluir:
        </p>
        <ul>
          <li>Identificar a los usuarios que regresan y a los registrantes.</li>
          <li>Permitirle moverse más fácilmente por nuestro sitio.</li>
          <li>Seguimiento de su uso de nuestro sitio para desarrollar mejor nuestros sitios de acuerdo con sus requisitos.</li>
          <li>Creación de un perfil demográfico.</li>
        </ul>
        <p>
          Si prefiere no ayudarnos a mejorar nuestro sitio, productos, ofertas y estrategia de marketing, puede configurar su navegador web para no aceptar cookies. Para obtener información sobre cómo evitar que se almacenen cookies en su computadora, visite <a href="http://www.allaboutcookies.org">http://www.allaboutcookies.org</a> en la sección "administrar cookies". También puede consultar el menú de ayuda de su navegador de Internet. Las cookies Flash se pueden eliminar utilizando las últimas versiones de Google Chrome, Mozilla Firefox y Microsoft Internet Explorer, que puede actualizar en estos navegadores. Alternativamente, puede eliminar o bloquear las cookies Flash visitando el Panel de configuración de almacenamiento del sitio web de Adobe. Ocasionalmente, podemos permitir que empresas de terceros establezcan cookies en los sitios de Easy Online English con fines que incluyen estudios de mercado, seguimiento de ingresos y mejora de la funcionalidad del sitio.
        </p>

        <h3>Cambios a Esta Política</h3>
        <p>
          Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Le notificaremos sobre cambios significativos mediante un aviso en nuestro sitio web o por otros medios adecuados. Le recomendamos revisar periódicamente esta política para estar informado sobre cómo protegemos su información.
        </p>

        <h3>Contacto</h3>
        <p>
          Si tiene preguntas o inquietudes sobre esta Política de Privacidad o nuestras prácticas de manejo de datos, por favor contáctenos en:
        </p>
        <p>
          Easy Online English<br />
          Cabarete, Puerto Plata, República Dominicana.<br />
          Correo electrónico: <a href="mailto:support@easyonlineenglish.com">support@easyonlineenglish.com</a><br />
          Teléfono: 849-410-9664
        </p>

        <p>
          Al utilizar nuestros servicios, usted acepta los términos de esta Política de Privacidad.
        </p>
      </div>
    </section>
  );
}

export default PrivacyPolicy;