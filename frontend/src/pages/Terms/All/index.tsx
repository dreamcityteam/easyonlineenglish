import React, { useContext, useState } from 'react';
import style from '../style.module.sass';
import useScrollToTop from '../../../hooks/ScrollUp';
import Conditions from '../Conditions';
import Privacy from '../Privacy';
import FinalUser from '../FinalUser';
import Payment from '../Payment';
import context from '../../../global/state/context';
import { UPDATE_STUDENT_TERMS } from '../../../global/state/actionTypes';
import { send } from '../../../tools/function';
import { HTTP_STATUS_CODES } from '../../../tools/constant';

const All: React.FC = (): JSX.Element => {
  const [_, dispatch] = useContext(context);
  const [isCheck, setIsCheck] = useState<boolean>(false);

  useScrollToTop();

  const handlerOnClick = async () => {
    if (isCheck) {
      const { response: { statusCode } } = await send({ api: 'student-terms' }).patch();

      if (statusCode === HTTP_STATUS_CODES.OK) {
        dispatch({ type: UPDATE_STUDENT_TERMS, payload: { isTerms: true } });
      }
    }
  }

  const handlerOnChange = ({ target: { checked } }: any) => {
    setIsCheck(checked);
  }

  return (
    <section className={style.terms__all}>
      <div className={style.terms__container}>
        <div className={style.terms__content}>
          <Conditions removeH1 />
          <Privacy removeH1 />
          <FinalUser removeH1 />
          <Payment removeH1 />
        </div>
        <form className={style.terms__form}>
          <input type="checkbox" onChange={handlerOnChange} />
          <label>Acepto los términos y condiciones</label>
          <div>
            <input
              type="button"
              value="Continuar"
              onClick={handlerOnClick}
              disabled={!isCheck}
            />
          </div>
        </form>
      </div>
    </section>
  );
}

export default All;
