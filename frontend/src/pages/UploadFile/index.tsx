import type { PutBlobResult } from '@vercel/blob';
import React, { useState, useRef } from 'react';
import { isDev, send } from '../../tools/function';

const UploadFile = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  return (
    <section style={{ padding: '20px' }}>
      <h2>Subir imagen</h2>
      <form
        onSubmit={async (event) => {
          event.preventDefault();

          if (!inputFileRef.current?.files) {
            throw new Error("No file selected");
          }

          const file = inputFileRef.current.files[0];
          const formData: FormData = new FormData();

          formData.append('photo', file);

          const response = await fetch(`http://localhost:3000/api/v1/upload-file?filename=${file.name}`, {
            method: 'POST',
            body: formData,
            credentials: isDev() ? 'include' : 'same-origin',
          }).then(r => r.json());

          setBlob(response.response.data);
        }}
      >
        <input name="file" ref={inputFileRef} type="file" required />
        <button type="submit">Upload</button>
      </form>
      {blob && (
        <div>
          <img src={blob.url} />
        </div>
      )}
    </section>
  );
}

export default UploadFile;