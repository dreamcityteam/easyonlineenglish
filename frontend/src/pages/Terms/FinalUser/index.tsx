import React from 'react';
import style from '../style.module.sass';
import useScrollToTop from '../../../components/ScrollUp';

interface Props {
  removeH1?: boolean;
}

const FinalUser: React.FC<Props> = ({ removeH1 }): JSX.Element => {
  useScrollToTop();

  const Tag = removeH1 ? 'h2' : 'h1';

  return (
    <section className={style.terms}>
      <div className={style.terms__container}>
        <Tag>
          Acuerdo de Licencia de Usuario Final Global (End-User License Agreement)
        </Tag>
        <p>
          Este documento describe el concepto de la licencia de uso de la membresía concedida a través del sitio web Easy Online English (en adelante, EL PROGRAMA).
        </p>
        <p>
          El simple uso de EL PROGRAMA implica que USTED conoce y acepta los términos y condiciones establecidos en este contrato, y manifiesta su consentimiento para quedar obligado conforme a los mismos. Se entiende que la aceptación se produce en el momento en que USTED utilice la aplicación o cualquiera de sus funcionalidades.
        </p>
        <p>
          La presente licencia de uso abarca todas las modalidades en las que se puede contratar la utilización de EL PROGRAMA, ya sea por usuarios y/o clientes finales de Easy Online English, o por distribuidores de EL PROGRAMA. Esto incluye todas las modalidades de distribución posibles que puedan ser contratadas con Easy Online English y los propios clientes y usuarios de dichos distribuidores, según corresponda.
        </p>
        <p>
          Solo USTED conoce la razón por la cual va a utilizar EL PROGRAMA. A tal efecto, declara conocer y aceptar las especificaciones técnicas y las funcionalidades de Easy Online English, así como las condiciones del servicio al que está suscrito.
        </p>
        <h2>
          Otorgamiento de la licencia
        </h2>
        <p>
          Easy Online English le concede a USTED el derecho de uso del programa Easy Online English mediante la obtención de una membresía pagada, conforme a la normativa legal establecida en la República Dominicana y sujeta a las condiciones de la misma. Cualquier duda en relación con el alcance de la cesión de derechos deberá interpretarse de manera restrictiva, es decir, en el sentido de la menor cesión de derechos posible.
        </p>
        <p>
          Easy Online English se reserva el derecho a rescindir la licencia cuando USTED incumpla cualquiera de las obligaciones que de la misma se derivan para USTED.
        </p>
        <p>
          La licencia de uso que Easy Online English le otorga a USTED es de carácter exclusiva e intransferible. Esto significa que usted no podrá transferir la licencia otorgada por Easy Online English a un tercero bajo ninguna circunstancia. El período durante el cual USTED podrá utilizar EL PROGRAMA dependerá de la modalidad de licencia que adquiera.
        </p>
        <p>
          USTED tiene expresamente prohibida la modificación, adaptación, corrección de errores, alquiler, venta, arrendamiento, transferencia, redistribución o sub-licenciamiento del PROGRAMA licenciado, salvo para el uso previsto de EL PROGRAMA. Todo lo anterior está prohibido a menos que se cuente con una autorización expresa y por escrito de Easy Online English. En todo aquello que no se haya regulado expresamente en este contrato, se aplicará la Ley No. 20-00 sobre la Propiedad Industrial.
        </p>
        <p>
          USTED reconoce que el programa se suministra tal y como se describe en el enlace, y que el presente acuerdo no le concede ningún derecho sobre otras versiones, mejoras o modificaciones del mismo.
        </p>
        <p>
          EL PROGRAMA puede utilizar software de terceros, y el uso de algunos materiales de terceros incluidos en EL PROGRAMA puede estar sujeto a otros términos y condiciones. Las menciones oficiales de propiedad intelectual y las condiciones específicas de la licencia de los códigos y algoritmos de ese software de terceros pueden consultarse en nuestra sección de "Términos y Condiciones". Mediante el presente contrato, usted acepta los términos y condiciones de dicho software de terceros.
        </p>
        <p>
          El uso de EL PROGRAMA estará restringido mediante un nombre de usuario y una contraseña. USTED es el único responsable de los nombres de usuario y contraseñas que elija para utilizar EL PROGRAMA. En caso de sospechar que han sido divulgados o revelados a personas no autorizadas para usar EL PROGRAMA, deberá proceder a cambiarlos lo antes posible.
        </p>
        <p>
          Por el simple uso de la aplicación, usted no accederá ni tratará información alguna del usuario. La única información que trata Easy Online English es la que está referida en nuestra Política de Privacidad, asociada al uso de EL PROGRAMA, y que es necesaria para su utilización. Puede acceder a la política de privacidad a través de nuestra página web.
        </p>
        <p>
          Queda prohibido el uso de EL PROGRAMA con fines ilegales, inmorales o contrarios al orden público.
        </p>
        <p>
          Easy Online English podrá dar por terminado el presente contrato si detecta que USTED está utilizando EL PROGRAMA con tales fines, sin perjuicio de las acciones civiles y penales que puedan derivarse de dicha infracción. Easy Online English bloqueará el uso de EL PROGRAMA en el momento en que se compruebe cualquiera de las actividades prohibidas por parte de Easy Online English. En este caso, Easy Online English podrá informar y colaborar con las autoridades policiales y judiciales competentes, proporcionando la información requerida dentro del marco legal.
        </p>
        <p>
          Ni la resolución unilateral de la licencia de uso por parte de Easy Online English, ni el bloqueo temporal o definitivo del servicio, ni la colaboración con las autoridades policiales o judiciales por estas causas, darán derecho a USTED a reclamar cantidad alguna a Easy Online English, ya sea en concepto de devolución del precio o en concepto de reclamación de daños o perjuicios.
        </p>
        <h2>
          Garantías y limitaciones de responsabilidad
        </h2>
        <p>
          Le recordamos que EL PROGRAMA está protegido por derechos de propiedad intelectual, los cuales son exclusivos de Easy Online English. Dichos derechos de propiedad intelectual no se ceden en ningún caso a USTED. La adquisición de esta licencia de uso le concede únicamente y exclusivamente el derecho de uso del PROGRAMA.
        </p>
        <p>
          A Easy Online English le corresponde garantizar ante el usuario final que ostenta los derechos de propiedad intelectual sobre EL PROGRAMA y defender dichos derechos ante terceros. Sin embargo, Easy Online English no asume responsabilidad por reclamaciones de terceros contra USTED por pérdidas o daños. Asimismo, Easy Online English no es responsable de daños económicos indirectos, lucro cesante, o daños incidentales o potenciales derivados del uso del software. Easy Online English no garantiza la operación ininterrumpida o libre de errores de EL PROGRAMA.
        </p>
        <p>
          USTED es el único responsable de la selección del programa de software y de los servicios asociados al mismo, así como del nivel de adecuación a sus necesidades. Easy Online English no asume responsabilidad por los errores derivados de la utilización conjunta de EL PROGRAMA con aplicaciones de terceros.
        </p>
        <p>
          Easy Online English no se hace responsable de la posible discontinuación de EL PROGRAMA en el futuro, en función del modelo de contratación por el que USTED haya optado.
        </p>
        <p>
          Las partes, para cualquier controversia, discrepancia, aplicación o interpretación del presente contrato, se someten expresamente, con renuncia a cualquier otro fuero que pudiera corresponderles, a la legislación dominicana y específicamente a lo establecido en la Ley 489-08 sobre Arbitraje Comercial.
        </p>
        <p>
          Si tiene alguna duda sobre el presente contrato o quiere comunicarse con Easy Online English por cualquier motivo visite nuestra Política de Privacidad. Las reclamaciones y/o sugerencias deberán ser enviadas a support@easyonlineenglish.com
        </p>
      </div>
    </section>
  );
}

export default FinalUser;
