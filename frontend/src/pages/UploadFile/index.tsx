import React, { useState, useRef } from 'react';
import { uploadBlob } from '../../tools/function';

const UploadFile: React.FC = (): JSX.Element => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<string>('');

  const handlerUploadPhoto = async (event: any): Promise<void> => {
    event.preventDefault();

    if (!inputFileRef.current) return;

    // @ts-ignore
    const file: File = inputFileRef.current.files[0]

    const url: string = await uploadBlob({
      service: 'upload-file',
      file
    });

    if (url) {
      setBlob(url);
    } else {
      alert('Error al intentar subir la imagen.');
    }
  }

  return (
    <section style={{ padding: '20px' }}>
      <h2>Subir imagen</h2>
      <form>
        <input name="file" ref={inputFileRef} type="file" required />
        <button type="submit" onClick={handlerUploadPhoto}>Upload</button>
      </form>
      {blob && (
        <div>
          <img src={blob} />
        </div>
      )}
    </section>
  );
}

export default UploadFile;