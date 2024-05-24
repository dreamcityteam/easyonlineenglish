import React from 'react';
import style from '../style.module.sass';
import useScrollToTop from '../../../components/ScrollUp';

const Payment: React.FC = (): JSX.Element => {
  useScrollToTop();

  return (
    <section className={style.terms}>
      <div className={style.terms__container}>
        <h1>Términos y Condiciones de Compra del Producto</h1>
        <p>
          Los siguientes términos y condiciones se aplican a las compras de los cursos de Easy Online English, y productos Online, cuando las compras se hagan directamente a Easy Online English SRL, como se especifica a continuación.
        </p>
        <h2>
          <u>Easy Online English - Términos aplicables solo a las compras de productos de Online:</u>
        </h2>
        <h3>Vigencia mínima del contrato:</h3>
        <p>
          Cada compra de Easy Online English requiere un compromiso de contrato de vigencia durante el período del plan aplicable (“Vigencia Inicial“), como se especifica en la página de aceptación de la compra (“Página de Pedido“). A menos que se determine de otro modo en la Página de Pedido, y siempre que permanezca al corriente del pago, se le concederá acceso a Easy Online English durante todo el período de la Vigencia Inicial, empezando desde la fecha de la compra indicada en la Página de Pedido. El acceso y uso que haga de Easy Online English estará sujeto al Contrato de los Términos de Uso y la Política de Privacidad de <strong>Easy Online English</strong>, disponibles en <strong>www.easyonlineenglish.com</strong>.
        </p>
        <h3>Renovación automática:</h3>
        <p>
          Después de su período inicial, su suscripción de producto en línea se renovará automáticamente por períodos adicionales del mismo número de meses que el período inicial de compra, lo que le permitirá mantener convenientemente su progreso y acceso. Al comprar hoy o a través de una opción de pago, usted autoriza a Easy Online English a cargar automáticamente en su cuenta de tarjeta de crédito o método de pago al vencimiento del plazo al precio total vigente en el momento de la renovación (ITBIS incluido), sin ninguna acción adicional por su parte. Los descuentos y promociones aplicados a la compra de su suscripción inicial o anunciados por Easy Online English en el momento de la renovación no son aplicables a las suscripciones de renovación. Puede desactivar la renovación automática en cualquier momento visitando la página Mi Cuenta o comunicándose con el Servicio de Atención al Cliente en <strong>support@easyonlineenglish.com</strong>. EN CASO DE RENOVACIÓN AUTOMÁTICA NO DESEADA, TIENE UN PLAZO DE 7 DÍAS PARA SOLICITAR UN REEMBOLSO.
        </p>
        <h3>Cambios y Devoluciones:</h3>
        <p>
          Las compras del producto <strong>Easy Online English</strong> podrán ser cambiadas o devueltas, para que se haga una devolución del precio de compra antes de que transcurran catorce (14) días a partir de la fecha de compra. Después de ese plazo, las compras de Easy Online English no tendrán derecho a cambios ni devoluciones, y usted será responsable del pago completo de la cantidad restante de la compra. La garantía no se aplica a las renovaciones de suscripciones. Para más información sobre la política de devoluciones de Easy Online English, por favor visite: <strong>www.easyonlineenglish.com</strong>.
        </p>
        <h2 className={style.terms__center}>Formas de pago</h2>
        <h3>Opción de pago único:</h3>
        <p>
          Si elige pagar el precio de compra en un único pago, el precio de compra completo será cargado utilizando el método de pago que seleccionó en la Página de Pedido, en la fecha en que se realizó el pedido (“Fecha de Compra“).
        </p>
        <h3>Impuestos, recargos y costos:</h3>
        <p>
          Los impuestos aplicables durante la Vigencia Inicial se añadirán y serán cargados a su pago inicial, siendo su base imponible el valor total del plazo de suscripción aplicable del plan que compró.
        </p>
        <h2 className={style.terms__center}>Política de Devolución por Problemas Técnicos</h2>
        <h2>1. Derecho de Desistimiento y Reembolsos</h2>
        <p>
          Dentro del período de desistimiento, si experimentas problemas técnicos significativos con nuestra plataforma que impiden el acceso o uso adecuado de tu curso de inglés, tienes derecho a solicitar un reembolso completo dentro de los primeros 14 días desde la fecha de inscripción.
        </p>
        <p>
          Para problemas técnicos que ocurran después del período de desistimiento inicial, evaluaremos la situación y, si los problemas persisten y no pueden ser resueltos de manera oportuna, podrías ser elegible para un reembolso parcial o un crédito para futuros cursos.
        </p>
        <h2>2. Proceso de Solicitud de Devolución</h2>
        <p>
          Debes informar cualquier problema técnico a nuestro equipo de soporte técnico a través del correo electrónico <strong>support@easyonlineenglish.com</strong> o mediante nuestro chat en línea dentro de las primeras 72 horas de detectado el problema.
        </p>
        <p>
          Proporciona detalles específicos del problema, incluyendo capturas de pantalla y descripciones de los errores encontrados.
        </p>
        <h2>3. Resolución de Problemas Técnicos</h2>
        <p>
          Nos comprometemos a resolver cualquier problema técnico reportado dentro de un plazo de 7 días hábiles. Durante este período, trabajaremos contigo para asegurarnos de que puedas acceder y utilizar plenamente el curso.
        </p>
        <p>
          Si el problema técnico no puede ser resuelto en el plazo indicado, podrás optar por un reembolso completo o un crédito para futuros cursos, según tu preferencia.
        </p>
        <h2>4. Excepciones y Consideraciones Especiales</h2>
        <p>
          Esta política no se aplica a problemas técnicos causados por fallos en el hardware o software del usuario, problemas con la conexión a Internet del usuario, o cualquier otra circunstancia fuera de nuestro control directo.
        </p>
        <p>
          Los reembolsos y créditos están sujetos a la aprobación de nuestro equipo de soporte técnico tras la revisión y verificación de los problemas reportados.
        </p>
        <h2>5. Contacto y Soporte</h2>
        <p>
          Para cualquier consulta adicional o para iniciar una solicitud de devolución, por favor contacta a nuestro equipo de soporte técnico a través del correo electrónico <strong>support@easyonlineenglish.com</strong> o mediante nuestro chat en línea disponible en nuestro sitio web.
        </p>
        <p>
          Esta política de devolución está diseñada para asegurar que nuestros usuarios tengan una experiencia de aprendizaje satisfactoria y sin interrupciones técnicas
        </p>
      </div>
    </section>
  );
}

export default Payment;
