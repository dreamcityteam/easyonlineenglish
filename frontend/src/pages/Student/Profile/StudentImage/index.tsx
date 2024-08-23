import React, { useContext, useRef } from 'react';
import context from '../../../../global/state/context';
import { State } from '../../../../global/state/type';
import { UPDATE_STUDENT_PHOTO } from '../../../../global/state/actionTypes';
import { uploadBlob } from '../../../../tools/function';

const StudentImage: React.FC = () => {
  const [{ user }, dispatch] = useContext<[State, any]>(context);
  const fileInputRef = useRef(null);

  const handleFileChange = (e: any): void => {
    handlerUploadPhoto(e.target.files[0]);
  }

  const handleButtonClick = (): void => {
    if (fileInputRef.current) {
      // @ts-ignore
      fileInputRef.current.click();
    }
  }

  const handlerUploadPhoto = async (file: any): Promise<void> => {
    const url: string = await uploadBlob({
      service: 'student-profile-image',
      file
    });

    if (url) {
      dispatch({
        type: UPDATE_STUDENT_PHOTO,
        payload: { photo: url }
      });
    } else {
      alert('Error al intentar subir la imagen.');
    }
  }

  return (
    <div className="content__cover">
      <div
        className="content__avatar"
        style={{
            background: `white url("${user?.photo}") center center no-repeat`
        }}
        onClick={handleButtonClick}
      />
      <form className="content__file">
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </form>
    </div>
  );
}

export default StudentImage;
