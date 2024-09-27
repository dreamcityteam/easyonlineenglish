import React, { useContext, useState } from 'react';
import { State } from '../../../global/state/type';
import context from '../../../global/state/context';
import { formatPhoneNumber, isFree, isStudent } from '../../../tools/function';
import { PLAN } from './data';
import ModalDelete from './ModalDelete';
import ModalEdit from './ModalEdit';
import ModalInvoiceStory from './ModalInvoiceStory';
import StudentImage from './StudentImage';
import style from './style.module.sass';
import SVGEdit from '../../../../public/svg/edit.svg';
import SVGHistory from '../../../../public/svg/history.svg';

const Profile: React.FC = (): JSX.Element => {
  const [{ user }] = useContext<[State, any]>(context);
  const [isEditStudent, setIsEditStudent] = useState<boolean>(false);
  const [isStudentInvoiceStory, setIsStudentInvoiceStory] = useState<boolean>(false);
  const [isDeleteStudent, setIsDeleteStudent] = useState<boolean>(false);

  const getMembership = (): string => {
    let membership: string = 'N/A';

    if (isFree(user)) {
      membership = 'Gratis';
    } else if (isStudent(user) && user?.payment.plan) {
      membership = PLAN[user.payment.plan];
    }

    return membership;
  }

  return (
    <section>
      <div className={style.profile}>
        <div className={style.profile__content}>
        <div className={style.profile__buttonContainer}>
            {!isFree(user) && (
              <button
                className={style.profile__button}
                onClick={() => setIsStudentInvoiceStory(true)}
              >
                <img src={SVGHistory} />
              </button>
            )}

            <button
              className={style.profile__button}
              onClick={() => setIsEditStudent(true)}
            >
             <img src={SVGEdit} />
            </button>
            {/* <button
              className="button"
              onClick={() => setIsDeleteStudent(true)}
            >
              <p className="button__text">Borrar cuenta</p>
            </button> */}
          </div>
          <StudentImage />
          <div className={style.profile__title}>
            <h2>
              {user?.name} {user?.lastname}
            </h2>
            <span>Estudiante - Easy Online English</span>
          </div>

          <ul className={style.profile__info}>
            <li><span>Email</span>{user?.email}</li>
            <li><span>Teléfono</span>{formatPhoneNumber(user?.phone)}</li>
            <li><span>Membresía</span>{getMembership()}</li>
          </ul>
        </div>

        <div className={style.profile__background}>
          <div>
            {[...Array(10)].map((_, index) => <span key={index}></span>)}
          </div>
        </div>

      </div>
      <ModalInvoiceStory state={[isStudentInvoiceStory, setIsStudentInvoiceStory]} />
      <ModalDelete state={[isDeleteStudent, setIsDeleteStudent]} />
      <ModalEdit state={[isEditStudent, setIsEditStudent]} />
    </section>
  );
};

export default Profile;
