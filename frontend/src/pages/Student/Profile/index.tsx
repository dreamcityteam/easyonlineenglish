import React, { useContext, useState } from 'react';
import { State } from '../../../global/state/type';
import context from '../../../global/state/context';
import { formatPhoneNumber, isFree, isStudent } from '../../../tools/function';
import { PLAN } from './data';
import ModalDelete from './ModalDelete';
import ModalEdit from './ModalEdit';
import ModalInvoiceStory from './ModalInvoiceStory';
import StudentImage from './StudentImage';
import './main.css';

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
      <div className="profile-page">
        <div className="content">
          <StudentImage />
          <div className="content__title">
            <h2>
              {user?.name} {user?.lastname}
            </h2>
            <span>Estudiante - Easy Online English</span>
          </div>
          <div className="content__description">
          </div>
          <ul className="content__list">
            <li><span>Email</span>{user?.email}</li>
            <li><span>Teléfono</span>{formatPhoneNumber(user?.phone)}</li>
            <li><span>Membresía</span>{getMembership()}</li>
          </ul>
          <div className="content__button">
            {!isFree(user) && (
              <button
                className="button"
                onClick={() => setIsStudentInvoiceStory(true)}
              >
                <p className="button__text">Historial de pago</p>
              </button>
            )}
            <button
              className="button"
              onClick={() => setIsEditStudent(true)}
            >
              <p className="button__text">Editar estudiante</p>
            </button>
            {/* <button
              className="button"
              onClick={() => setIsDeleteStudent(true)}
            >
              <p className="button__text">Borrar cuenta</p>
            </button> */}
          </div>
        </div>
        <div className="bg">
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
