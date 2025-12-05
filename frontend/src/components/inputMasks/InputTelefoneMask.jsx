'use client';

import { useMask } from '@react-input/mask';

export default function InputTelefoneMask(props) {
  const inputRef = useMask({
    mask: '(__) _____-____', // mascara do telefone
    replacement: { _: /\d/ },
  });

  return <input ref={inputRef} {...props} />;
}
