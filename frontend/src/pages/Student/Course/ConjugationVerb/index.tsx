import React, { useState } from 'react';
import Modal from '../../../../components/Modal';
import Sound from '../../../../components/Sound';
import Close from '../../../../components/Modal/Close';
import { Word } from '../../../../global/state/type';
import { getPath } from '../../../../tools/function';

const ConjugationVerb = ({ word }: { word: Word | undefined; }): JSX.Element | null => {
  let component: JSX.Element | null = null;
  const [open, setOpen] = useState(false);

  const Target = ({ verb = '' }: { verb: string | undefined; }): JSX.Element => (
    <span>{verb}<strong style={{ color: 'red' }} >s</strong></span>
  );

  const handlerOnOpen = (): void => {
    setOpen(true)
  }

  const handlerOnClose = (): void => {
    setOpen(false)
  }

  const englishWord: string = (word?.englishWord || '').toLocaleLowerCase();
  const conjugationAudio: string = getPath('/2023/11/conjugation-want.mp3');

  if (word?.englishWord === 'Want') {
    component = (
      <div>
        <button
          onClick={handlerOnOpen}
          style={{
            color: 'red',
            border: 'none',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '10px'
          }}
        >CONJUGACION DEL VERBO</button>
        <Modal canShow={open} isFadeIn >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              maxWidth: '300px',
              padding: '20px',
              position: 'relative',
              width: '100%',
              zIndex: 4,
            }}
          >
            <Close onClose={handlerOnClose} />
            <header>
              <h2
                style={{
                  backgroundClip: 'text',
                  backgroundImage: 'linear-gradient(rgb(45, 200, 254) 0%, rgb(14, 163, 227) 39.5987%, rgb(4, 108, 169) 70.8026%, rgb(4, 62, 110) 100%)',
                  color: 'transparent',
                  fontSize: '30px'
                }}
              > {word?.englishWord} </h2>
            </header>
            <div>
              <p> I {englishWord} - Yo quiero </p>
              <p> You {englishWord} - Tú quieres </p>
              <p> He <Target verb={englishWord} /> - Él quiere</p>
              <p> She <Target verb={englishWord} /> - Ella quiere</p>
              <p> It <Target verb={englishWord} /> - Él/Ella quiere</p>
              <p> We {englishWord} - Nosotros queremos</p>
              <p> They {englishWord} - Ellos quieren</p>
              <Sound src={conjugationAudio} width='50px' style={{}} />
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  return component;
}

export default ConjugationVerb;