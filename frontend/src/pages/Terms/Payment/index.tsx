import React from 'react';
import style from '../style.module.sass';
import useScrollToTop from '../../../hooks/ScrollUp';
import Head from './Head';

interface Props {
  removeH1?: boolean;
}

const Payment: React.FC<Props> = ({ removeH1 }): JSX.Element => {
  useScrollToTop();

  const Tag = removeH1 ? 'h2' : 'h1';

  return (
    <>
      <Head />
      <section className={style.terms}>
        <div className={style.terms__container}>
          <Tag>
            Términos y Condiciones de Compra del Producto
          </Tag>
          <p>
            Los términos y condiciones que se detallan a continuación son aplicables a la compra de cursos y productos en línea de Easy Online English cuando estas se realicen directamente a través de Easy Online English SRL.
          </p>
          <p>
            <strong>
              <u>
                Easy Online English - Términos aplicables solo a las compras de productos de Online:
              </u>
            </strong>
          </p>
          <h2>
            Vigencia de las membresías:
          </h2>
          <p>
            Easy Online English ofrece tres planes de membresía para adaptarse a sus necesidades de aprendizaje. Los planes disponibles son:
          </p>
          <ol>
            <li>
              <strong>Plan Mensual:</strong> Acceso completo a los cursos y recursos por 1 mes.
            </li>
            <li>
              <strong>Plan Trimestral:</strong> Acceso completo a los cursos y recursos por 3 meses.
            </li>
            <li>
              <strong>Plan Anual:</strong> Acceso completo a los cursos y recursos por 1 año. Este es el plan más recomendable, ya que ofrece el mejor valor y permite un aprendizaje continuo y sin interrupciones.
            </li>
            <li>
              Cada plan se activa en el momento en que se procesa el pago, garantizando acceso inmediato a nuestros servicios. El uso y acceso a Easy Online English están sujetos al Contrato de Términos de Uso y a la Política de Privacidad de Easy Online English, disponibles en www.easyonlineenglish.com.
            </li>
          </ol>
          <h2>
            Renovación:
          </h2>
          <p>
            Easy Online English renovará automáticamente las membresías. Para seguir disfrutando de nuestros servicios, no es necesario que renueve su membresía manualmente, ya que la renovación automática está activada por defecto. Sin embargo, los descuentos y promociones aplicados a la compra de su suscripción inicial o anunciados por Easy Online English en el momento de la renovación no son válidos para suscripciones de renovación. Puede desactivar la renovación automática en cualquier momento visitando su perfil de usuario
          </p>
          <p>
            Las compras del producto Easy Online English podrán ser cambiadas o devueltas, para que se haga una devolución del precio de compra antes de que transcurran catorce (14) días a partir de la fecha de compra.  Después de ese plazo, las compras de Easy Online English no tendrán derecho a cambios ni devoluciones, y usted será responsable del pago completo de la cantidad restante de la compra.
          </p>
          <p>
            Si la devolución es solicitada dentro del tiempo hábil previamente establecido, recibirá dicha devolución dentro de un plazo de treinta (30) días. La garantía no se aplica a las renovaciones de suscripciones. Para más información sobre la política de devoluciones de Easy Online English, por favor visite: www.easyonlineenglish.com.
          </p>
          <h2>
            Formas de pago
          </h2>
          <h3>
            Opción de pago único:
          </h3>
          <p>
            El método de pago de Easy Online English se realizará a través de tarjetas de crédito Visa y MasterCard. Garantizamos que todas las transacciones se procesan de manera segura para proteger la información de nuestros usuarios. Para más información sobre la protección de sus datos personales, consulte nuestra Política de Privacidad.
          </p>
          <h3>
            Impuestos, recargos y costos:
          </h3>
          <p>
            Los impuestos aplicables durante la Vigencia Inicial se añadirán y se cargarán a su pago inicial, calculándose sobre el valor total del plazo de suscripción correspondiente al plan que ha adquirido.
          </p>
          <h2>
            Política de Devolución por Problemas Técnicos
          </h2>
          <h3>
            1. Derecho de Desistimiento y Reembolsos
          </h3>
          <p>
            Si experimentas problemas técnicos significativos con nuestra plataforma que impidan el acceso o uso adecuado de tu curso de inglés durante el período de desistimiento, tienes derecho a solicitar un reembolso completo dentro de los primeros 14 días desde la fecha de inscripción.
          </p>
          <p>
            Para problemas técnicos que ocurran después del período de desistimiento inicial, evaluaremos la situación y, si los problemas persisten y no pueden ser resueltos de manera oportuna, podrías ser elegible para un reembolso parcial o un crédito para futuros cursos.
          </p>
          <h3>
            2. Proceso de Solicitud de Devolución
          </h3>
          <p>
            Debes informar cualquier problema técnico a nuestro equipo de soporte técnico a través del correo electrónico support@easyonlineenglish.com o mediante nuestro chat en línea dentro de las primeras 72 horas de detectado el problema.
          </p>
          <p>
            Proporciona detalles específicos del problema, incluyendo capturas de pantalla y descripciones de los errores encontrados.
          </p>
          <h3>
            3. Resolución de Problemas Técnicos
          </h3>
          <p>
            Nos comprometemos a resolver cualquier problema técnico reportado dentro de un plazo de 7 días hábiles. Durante este período, trabajaremos contigo para asegurarnos de que puedas acceder y utilizar plenamente el curso.
          </p>
          <p>
            Si el problema técnico no puede ser resuelto en el plazo indicado, podrás optar por un reembolso completo o un crédito para futuros cursos, según tu preferencia.
          </p>
          <h3>
            4. Excepciones y Consideraciones Especiales
          </h3>
          <p>
            Esta política no se aplica a problemas técnicos causados por fallos en el hardware o software del usuario, problemas con la conexión a Internet del usuario, o cualquier otra circunstancia fuera de nuestro control directo.
          </p>
          <p>
            Los reembolsos y créditos están sujetos a la aprobación de nuestro equipo de soporte técnico tras la revisión y verificación de los problemas reportados.
          </p>
          <h3>
            5. Contacto y Soporte
          </h3>
          <p>
            Para cualquier consulta adicional o para iniciar una solicitud de devolución, por favor contacta a nuestro equipo de soporte técnico a través del correo electrónico support@easyonlineenglish.com o mediante nuestro chat en línea disponible en nuestro sitio web.
          </p>
          <p>
            Esta política de devolución está diseñada para asegurar que nuestros usuarios tengan una experiencia de aprendizaje satisfactoria y sin interrupciones técnicas.
          </p>
        </div>
      </section>
    </>
  );
}

export default Payment;
