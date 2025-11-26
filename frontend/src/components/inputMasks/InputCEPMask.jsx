'use client';

import { useMask } from '@react-input/mask';

export default function InputCEPMask(props) {
  const inputRef = useMask({
    mask: '_____-____', // mascara do cep
    replacement: { _: /\d/ },
  });

  return <input ref={inputRef} {...props} />;
}
