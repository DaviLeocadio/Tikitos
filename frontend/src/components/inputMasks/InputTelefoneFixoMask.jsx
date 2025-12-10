'use client';

import { useMask } from '@react-input/mask';

export default function InputTelefoneFixoMask(props) {
  const inputRef = useMask({
    mask: '(__) ____-____', // mascara do telefone
    replacement: { _: /\d/ },
  });

  return <input ref={inputRef} {...props} />;
}