import React from 'react';
import style from '../style.module.sass';
import useScrollToTop from '../../../hooks/ScrollUp';
import MetaTags from './MetaTags';

interface Props {
  removeH1?: boolean;
}

const Conditions: React.FC<Props> = ({ removeH1 }): JSX.Element => {
  useScrollToTop();

  const Tag = removeH1 ? 'h2' : 'h1';

  return (
    <>
      <MetaTags />
      <section className={style.terms}>
        <div className={style.terms__container}>
          <Tag>TÉRMINOS Y CONDICIONES EASY ONLINE ENGLISH </Tag>
          <h2>1. INTRODUCCIÓN </h2>
          <p>
            El acceso a cualquier parte de este sitio web será considerado como una aceptación integra del presente aviso legal. Si usted no acepta el contenido de los Términos y Condiciones de Easy Online English, favor de abandonar el sitio web de manera inmediata.
          </p>
          <p>
            Easy Online English se reserva el derecho, en cualquier momento, de forma temporal, permanente, total o parcial, de realizar lo siguiente: modificar o discontinuar el sitio web con o sin previo aviso; limitar la disponibilidad del sitio web a cualquier persona, área geográfica o jurisdicción que consideremos; cobrar tarifas en relación con el uso del sitio web; modificar y/o renunciar a cualquier tarifa cobrada en relación con el sitio web; y/o ofrecer oportunidades a algunos o todos los usuarios del Sitio Web. Usted acepta que nosotros y nuestras entidades afiliadas no seremos responsables ante usted ni ante ningún tercero por cualquier modificación, suspensión o interrupción del sitio web, total o parcial, o de cualquier servicio, software, contenido, envío, características o productos ofrecidos a través del sitio web. Su uso continuado del sitio después de dichos cambios indicará su aceptación de la misma. Ciertas disposiciones de este aviso legal pueden ser reemplazadas por avisos o términos legales expresamente designados ubicados en páginas particulares de este sitio web.
          </p>
          <p>
            Por favor, lea detenidamente este acuerdo para comprender cada una de sus disposiciones. Este acuerdo incluye una cláusula obligatoria de arbitraje individual y una renuncia al derecho a juicio, que requiere la resolución de disputas mediante arbitraje de manera individual.
          </p>
          <h2>
            2. CONDICIONES DE USO
          </h2>
          <p>
            Easy Online English le otorga de manera gratuita acceso a una porción del sitio web. Como condición de dicho acceso, usted acepta las siguientes prohibiciones:
          </p>
          <ol className={style.terms__listAbc}>
            <li>
              Está prohibido descargar o modificar cualquier sección del sitio web sin el consentimiento previo y por escrito de Easy Online English;
            </li>
            <li>
              Está prohibido descargar o copiar cualquier información del sitio web con el fin de beneficiar a terceros;
            </li>
            <li>
              Está prohibido recopilar o utilizar cualquier listado de productos, descripciones o precios con el propósito de establecer precios predatorios en el mercado;
            </li>
            Está prohibido revender o utilizar comercialmente este sitio web o sus contenidos;
            <li>
              Está prohibido reproducir, duplicar, copiar, vender, revender o explotar el sitio web para cualquier propósito comercial sin el consentimiento expreso y por escrito de Easy Online English.;
            </li>
            Abstenerse de realizar cualquier uso derivado de este sitio web o de sus contenidos;
            <li>
              Está prohibido enmarcar o utilizar técnicas de enmarcado para incluir cualquier marca comercial, logotipo u otra información de propiedad exclusiva (incluyendo imágenes, texto, diseño de página o formulario) de Easy Online English y sus empresas afiliadas sin el consentimiento expreso por escrito de Easy Online English.;
            </li>
            <li>
              No emplear meta etiquetas ni ningún tipo de "texto oculto" que haga uso del nombre o las marcas comerciales de Easy Online English sin el previo consentimiento expreso y por escrito de dicha entidad.;
            </li>
            <li>
              Abstenerse de realizar ingeniería inversa, ensamblaje inverso o intentar descubrir cualquier código fuente subyacente a este sitio web; y
            </li>
            <li>
              Queda prohibida la reproducción o el almacenamiento de cualquier parte de este sitio web en otro sitio web, así como la inclusión de cualquier parte del mismo en cualquier sistema o servicio de recuperación electrónica, ya sea público o privado, sin el permiso previo por escrito de Easy Online English.
            </li>
          </ol>
          <p>
            Todos los derechos de autor y otros derechos de propiedad intelectual que conforman el material de este sitio web, incluyendo textos, fotografías, gráficos, entre otros, son propiedad exclusiva de Easy Online English y/o sus compañías afiliadas. Cualquier incumplimiento de los términos de este aviso legal resultará en la expulsión del sitio web. Easy Online English hará valer sus derechos de propiedad intelectual con el máximo rigor legal.
          </p>
          <p>
            Todas las marcas comerciales de Easy Online English presentes en el sitio web son propiedad exclusiva de Easy Online English o de las empresas afiliadas de su grupo en la República Dominicana y otros países. Todos los derechos no otorgados expresamente en estos términos están reservados.
          </p>
          <h2>
            3. ACCESO AL SERVICIO
          </h2>
          <p>
            Aunque Easy Online English se esfuerza por mantener disponible este sitio web las 24 horas del día, el acceso al mismo puede interrumpirse sin previo aviso debido a fallos, labores de mantenimiento o reparación del sistema, o por motivos fuera del control de Easy Online English.
          </p>
          <h2>
            4. CONTENIDO GENERADO POR EL USUARIO (User Generated Content)
          </h2>
          <p>
            El usuario es el único responsable del contenido que cree, transmita o muestre mientras utiliza el sitio web, conocido como contenido generado por el usuario ("User Generated Content"). Nosotros, Easy Online English, no reclamamos ningún derecho de propiedad sobre dicho contenido creado por el usuario.
          </p>
          <p>
            Además de la información de identificación personal, que está cubierta por nuestra política de privacidad, cualquier contenido generado por el usuario que usted transmita o publique en este sitio web se considerará no confidencial. Easy Online English no tendrá ninguna obligación con respecto a dicho contenido de usuario. Nosotros, Easy Online English, y nuestros designados tendremos la libertad de copiar, divulgar, distribuir, incorporar y utilizar dicho contenido de usuario, así como todos los datos, imágenes, sonidos, texto y cualquier otra cosa contenida en él, para cualquier fin, ya sea comercial o no comercial.
          </p>
          <p>
            Tiene prohibido publicar o transmitir hacia o desde este sitio web lo siguiente:
          </p>
          <ol className={style.terms__listAbc}>
            <li>
              Cualquier material que sea amenazante, difamatorio, obsceno, indecente, sedicioso, ofensivo, pornográfico, abusivo, que pueda incitar al odio racial, discriminatorio, amenazante, escandaloso, incendiario, blasfemo, que atente contra la confianza, que viole la privacidad o que pueda causar molestias o inconvenientes.;
            </li>
            <li>
              Material para el cual no ha obtenido todas las licencias y/o aprobaciones necesarias;
            </li>
            <li>
              material que constituya o fomente una conducta que sería considerada un delito penal, daría lugar a responsabilidad civil o de otro modo sería contraria a la ley o infringiría los derechos de cualquier tercero, en cualquier país del mundo; y,
            </li>
            <li>
              cualquier tipo de virus informáticos, piratería informática, uso de robots, extracción de datos o herramientas similares de recopilación de datos, envío automatizado de datos bombas lógicas, caballos de Troya, gusanos, componentes dañinos, datos corruptos u otro software malicioso, etc.;
            </li>
          </ol>
          <p>
            Easy Online English colaborará íntegramente con cualquier autoridad policial o judicial que solicite o indique a Easy Online English que revele la identidad o ubique a cualquier persona que publique contenido generado por el usuario en violación de esta disposición.
          </p>
          <h2>
            5. ENLACES A TERCEROS
          </h2>
          <p>
            Los enlaces a sitios web de terceros que se encuentran en este sitio web se proporcionan únicamente para su conveniencia. Al utilizar estos enlaces, abandonará nuestro sitio web. Easy Online English no ha revisado todos estos sitios web de terceros y no controla ni es responsable de ellos, ni de su contenido o disponibilidad. Por lo tanto, Easy Online English no respalda ni realiza ninguna representación sobre estos sitios web, ni sobre ningún material que se encuentre en ellos, ni sobre los resultados que puedan obtenerse al utilizarlos. Si decide acceder a cualquiera de los sitios web de terceros vinculados a este sitio web, lo hace bajo su propio riesgo.
          </p>
          <p>
            Si desea enlazar a este sitio web, solo puede hacerlo vinculándose a la página de inicio del mismo, sin replicarla, y está sujeto a las siguientes condiciones:
          </p>
          <ol className={style.terms__listAbc}>
            <li>
              No elimine, distorsione ni altere de ninguna manera el tamaño o la apariencia del logotipo de Easy Online English;
            </li>
            <li>
              No crea un marco ni ningún otro entorno de navegador o borde alrededor de este sitio web;
            </li>
            <li>
              No debe implicar de ninguna manera que Easy Online English respalda cualquier producto o servicio que no sea el suyo.;
            </li>
            <li>
              No distorsione su relación con Easy Online English ni proporcione información falsa sobre Easy Online English;
            </li>
            <li>
              No utilice ninguna marca comercial de Easy Online English mostrada en este sitio web sin el permiso expreso por escrito de Easy Online English;
            </li>
            <li>
              No se vincula desde un sitio web que no sea de su propiedad;
            </li>
            <li>
              Su sitio web no incluye contenido que sea desagradable, ofensivo o controvertido, que infrinja cualquier derecho de propiedad intelectual u otros derechos de cualquier otra persona o que no cumpla con todas las leyes y regulaciones aplicables.
            </li>
          </ol>
          <p>
            Easy Online English se reserva expresamente el derecho de revocar su membresía otorgada por incumplimiento de los presentes términos y de tomar cualquier medida que considere adecuada.
          </p>
          <p>
            Será responsable de indemnizar completamente a Easy Online English por cualquier pérdida o daño sufrido por esta última o cualquiera de sus empresas afiliadas debido al incumplimiento de esta sección.
          </p>
          <h2>
            6.QUEJAS DE DERECHOS DE AUTOR
          </h2>
          <p>
            Si cree que su trabajo protegido por derechos de autor ha sido copiado de una manera que constituye una infracción de derechos de autor y es accesible a través del Servicio, favor de notificar al equipo legal de Easy Online English los siguientes documentos:
          </p>
          <ol>
            <li>
              Una firma electrónica o física de una persona autorizada para actuar en nombre del propietario de los derechos de autor que se encuentran violentados;
            </li>
            <li>
              Identificación del material que se alega infringe y dónde se encuentra en el Servicio;
            </li>
            <li>
              Información de contacto;
            </li>
            <li>
              Una declaración donde se haga constar que el uso del material en la forma denunciada no está autorizado por el propietario de los derechos de autor, su agente o la ley;
            </li>
            <li>
              Prueba donde se haga constar que la persona afectada es autor del material denunciado; y
            </li>
            <li>
              Una declaración, hecha bajo pena de perjurio, de que la información anterior es precisa y que usted es el propietario de los derechos de autor o está autorizado a actuar en nombre del propietario.
            </li>
          </ol>
          <p>
            <strong>
              AVISO: SEGÚN LO ESTABLECIDO EN LA LEY NO. 20-00 SOBRE PROPIEDAD INDUSTRIAL, EL CODIGO PENAL DE LA REPÚBLICA DOMINICANA, Y DEMÁS LEYES APLICABLES AL SIGUIENTE CASO, SI A SABIENDAS DECLARA FALSAMENTE QUE EL MATERIAL EN LÍNEA ESTÁ INFRINGE EL DERECHO DE AUTOR DE UNA PERSONA MORAL O FÍSICA, PUEDE ESTAR SUJETO A UN PROCESO PENAL POR PERJURIO Y SANCIONES CIVILES, INCLUYENDO DAÑOS MONETARIOS, COSTAS JUDICALES Y HONORARIOS DE ABOGADOS.
            </strong>
          </p>
          <p>
            Este procedimiento es exclusivamente para notificar a Easy Online English que su material protegido por derechos de autor ha sido infringido. Los requisitos anteriores tienen como objetivo cumplir con los derechos y obligaciones de Easy Online English.
          </p>
          <p>
            En caso de Easy Online English infringir los derechos de autor de una persona moral o física, esta será removida del sitio web por el equipo técnico y legal de Easy Online English.
          </p>
          <p>
            Easy Online English también puede, a su discreción, limitar el acceso al servicio y/o cancelar las cuentas de cualquier usuario que infrinja cualquier derecho de propiedad intelectual de otros, ya sea que haya o no una infracción repetida.
          </p>
          <h2>
            7. ADVERTENCIAS ESPECIALES PARA USO INTERNACIONAL
          </h2>
          <p>
            Reconociendo la naturaleza global de Internet, usted acepta cumplir y es el único responsable de garantizar el cumplimiento de todas las leyes, regulaciones y normas locales en las jurisdicciones en las que reside, así como todas las leyes aplicables relacionadas con la transmisión de datos exportados desde la República Dominicana o la jurisdicción en la que reside.
          </p>
          <h2>
            8. INDEMNIZACIÓN
          </h2>
          <p>
            En la medida permitida por la ley, usted acuerda indemnizar, defender y eximir de responsabilidad a Easy Online English, así como a sus subsidiarias, afiliados, funcionarios, agentes, socios y empleados, de y contra cualquier reclamo, demanda, acción legal, pérdida, responsabilidad, daño, costos y gastos (incluidos los honorarios razonables de abogados) derivados de o relacionados con: (I) el contenido que usted envíe, publique, transmita o ponga a disposición a través del sitio web, incluido, entre otros, el contenido del usuario; (II) el uso indebido del sitio web; (III) su conexión al sitio web; (IV) su incumplimiento del presente acuerdo; (V) su violación de cualquier ley aplicable o los derechos de terceros; (VI) su conducta inapropiada hacia Easy Online English y sus afiliados, funcionarios, agentes, subordinados, etc.; o (VII) el acceso y uso de cualquier otra parte del sitio web con su nombre de usuario exclusivo, contraseña u otro código de seguridad apropiado. Easy Online English se reserva el derecho de asumir la defensa y el control exclusivo de cualquier asunto sujeto a indemnización por su parte, y usted acepta cooperar plenamente con nosotros en la defensa de dichos reclamos.
          </p>
          <h2>
            9. DERECHOS DE PROPIEDAD DE EASY ONLINE ENGLISH
          </h2>
          <p>
            Usted reconoce y acepta que el sitio web contiene información confidencial y exclusiva protegida por las leyes de propiedad intelectual aplicables y otras normativas. Asimismo, reconoce y acepta que la información presentada a través del sitio web está resguardada por derechos de autor, marcas comerciales, patentes y otros derechos de propiedad. A menos que Easy Online English lo autorice explícitamente, usted se compromete a no copiar, modificar, alquilar, arrendar, prestar, vender, distribuir o crear trabajos derivados basados en el sitio web o su software, total o parcialmente. Queda terminantemente prohibida cualquier extracción, recolección, indexación o duplicación de cualquier contenido del sitio web.
          </p>
          <p>
            El sitio web está sujeto a derechos de autor y otras leyes tanto en la República Dominicana como a nivel internacional. De acuerdo con los términos de este Acuerdo, queda expresamente prohibida la distribución o reproducción del contenido del servicio, total o parcialmente, por cualquier medio, incluidos los electrónicos e impresos.
          </p>
          <h2>
            10. RENUNCIA DE GARANTÍAS
          </h2>
          <p>
            Usted entiende y acepta expresamente que:
          </p>
          <ol>
            <li>
              El uso del sitio web es bajo su propio riesgo. Easy Online English renuncia expresamente a todas las garantías y condiciones, ya sean expresas o implícitas, incluyendo, pero no limitándose a, las garantías implícitas de comerciabilidad, idoneidad para un propósito particular y no infracción.
            </li>
            <li>
              Easy Online English no ofrece garantía ni condición de lo siguiente: (I) que el sitio web satisfará sus requisitos; (II) que el sitio web será ininterrumpido, oportuno, seguro o libre de errores; (III) que los resultados obtenidos del uso del sitio web serán precisos o confiables; (IV) que la calidad de cualquier producto, servicio, información u otro material adquirido u obtenido por usted a través del sitio web satisfará sus expectativas; y, (V) que cualquier error en el software será corregido.
            </li>
            <li>
              Cualquier material obtenido a través del uso del sitio web se realiza bajo su propia discreción y riesgo, y usted será el único responsable de cualquier daño a su sistema informático o pérdida de datos que resulte de la descarga de dicho material.
            </li>
            <li>
              Cualquier orientación o información, ya sea proporcionada verbalmente o por escrito, obtenida de Easy Online English o a través del sitio web, no generará ninguna garantía o condición que no esté expresamente establecida en el acuerdo.
            </li>
          </ol>
          <h2>
            11. LIMITACIÓN DE RESPONSABILIDAD
          </h2>
          <p>
            En la máxima medida permitida por la ley aplicable, Easy Online English, junto con sus agentes, directores, empleados, proveedores o licenciantes, no serán responsables en ningún caso de ningún daño directo, indirecto, incidental, especial, consecuencial o ejemplar, incluyendo pero no limitado a, pérdida de beneficios, buena voluntad, uso, datos u otras pérdidas intangibles, resultantes de: (I) el uso o la incapacidad de utilizar el sitio web; (II) el costo de adquirir bienes y servicios sustitutos como resultado de cualquier bien, datos, información o servicios adquiridos u obtenidos, o mensajes recibidos o transacciones realizadas a través o desde el sitio web; (III) acceso no autorizado o alteración de sus transmisiones o datos; (IV) declaraciones o conducta de cualquier tercero en el sitio web; o (V) cualquier otro asunto relacionado con el sitio web.
          </p>
          <h2>
            12. EXCLUSIONES Y LIMITACIONES
          </h2>
          <p>
            En algunas jurisdicciones, las leyes no permiten la exclusión de ciertas garantías y condiciones, ni la limitación o exclusión de responsabilidad por ciertas reclamaciones o daños, como los daños incidentales o consecuenciales. Por lo tanto, las exenciones de responsabilidad, exclusiones y limitaciones de responsabilidad establecidas en este acuerdo pueden no ser aplicables en la medida en que la ley aplicable lo prohíba.
          </p>
          <h2>
            13. INFORMACIÓN DE MARCA COMERCIAL
          </h2>
          <p>
            Easy Online English y su logotipo son marcas registradas de Easy Online English, S.R.L. Usted acepta no utilizar ninguna marca comercial de Easy Online English sin su previo consentimiento por escrito.
          </p>
          <h2>
            14. LEY APLICABLE Y LUGAR
          </h2>
          <p>
            Usted acuerda que: (I) el sitio web se considera exclusivamente basado en la República Dominicana; y (II) cualquier disputa legal se resolverá aplicando las leyes de la República Dominicana. Este acuerdo estará sujeto a las leyes vigentes de la República Dominicana que rigen el comercio internacional. A pesar de lo anterior con respecto al derecho sustantivo, cualquier arbitraje llevado a cabo según los términos de este acuerdo se regirá por las leyes de la República Dominicana. Además, este acuerdo se trata de un contrato para la prestación de servicios y no para la venta de bienes.
          </p>
          <p>
            Usted acepta someterse a la jurisdicción personal de los tribunales ubicados en la República Dominicana para cualquier acción por la cual nos reservamos el derecho de solicitar medidas cautelares u otras medidas equitativas en un tribunal de jurisdicción competente para evitar la infracción, apropiación indebida o violación real o amenazada de nuestros derechos de autor, marcas registradas, secretos comerciales, patentes u otra propiedad intelectual o propiedad intelectual. derechos, tal como se establece en la disposición sobre Arbitraje a continuación, incluida cualquier reparación provisional necesaria para evitar daños irreparables. República Dominicana es el foro adecuado para cualquier apelación de un laudo arbitral o para procedimientos judiciales de primera instancia si se determina que la disposición de arbitraje a continuación es inaplicable.
          </p>
          <h2>
            15. ARBITRAJE
          </h2>
          <p>
            Para cualquier disputa con Easy Online English, usted acepta en primer lugar contactarnos a través del correo electrónico support@easyonlineenglish.com y tratar de resolver la disputa por esta vía. En caso de que Easy Online English no haya podido resolver una disputa con usted después de sesenta (60) días, ambas partes acuerdan resolver cualquier reclamo, disputa o controversia (excluyendo reclamos por medidas cautelares u otras medidas equitativas según se establece a continuación) que surja de este acuerdo, o en relación con él, mediante arbitraje vinculante, de acuerdo con los Procedimientos de Arbitraje Acelerado Opcional vigentes en ese momento. El arbitraje se llevará a cabo en la República Dominicana, a menos que usted y Easy Online English acuerden lo contrario.
          </p>
          <h2>
            16. RENUNCIA A DEMANDA COLECTIVA/ JUICIO POR JURADO
          </h2>
          <p>
            Con respecto a todas las personas y entidades, ya sea que hayan utilizado o no el sitio web para fines personales, comerciales u otros, todas las reclamaciones deben presentarse individualmente por las partes y no como demandante o miembro de una clase en cualquier acción colectiva, acción de clase, acción general del abogado privado u otro procedimiento representativo. Esta renuncia se aplica al arbitraje colectivo y, a menos que acordemos lo contrario, el árbitro no puede consolidar las reclamaciones de más de una persona. Al aceptar este acuerdo, usted y Easy Online English renuncian al derecho a un juicio o a participar en cualquier acción colectiva, acción de clase, acción general del abogado privado u otro procedimiento representativo.
          </p>
          <h2>
            17. GENERALIDADES
          </h2>
          <ol className={style.terms__listAbc}>
            <li>
              Acuerdo completo: Este acuerdo completo constituye el vínculo entre usted y Easy Online English, y regula su uso del sitio web, sustituyendo cualquier acuerdo anterior entre usted y Easy Online English con respecto al sitio web.
            </li>
            <li>
              Renuncia y separabilidad de términos: La falta de ejercicio o cumplimiento por parte de Easy Online English de cualquier derecho o disposición del presente acuerdo no constituirá una renuncia a dicho derecho o disposición. En caso de que un tribunal competente determine que alguna disposición del Acuerdo es inválida, las partes acuerdan que el tribunal debe, sin embargo, esforzarse por dar efecto a las intenciones de las partes tal como se reflejan en la disposición, y que las demás disposiciones del Acuerdo permanecerán en vigor, con toda su fuerza y efecto.
            </li>
            <li>
              Prescripción: Usted acepta que, a pesar de cualquier estatuto o ley en contrario, cualquier reclamo o causa de acción que surja de o esté relacionado con el Acuerdo debe presentarse dentro de un (1) año después de que dicho reclamo o causa de acción haya surgido. La falta de acción por parte del reclamante dentro del período de tiempo mencionado resultará en la prescripción del reclamo.
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}

export default Conditions;
