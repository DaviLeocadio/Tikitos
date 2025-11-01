'use client';

import { useMask } from '@react-input/mask';

export default function InputCNPJMask(props) {
  const inputRef = useMask({
    mask: '__.___.___/____-__', // mascara do cnpj
    replacement: { _: /\d/ },
  });

  return <input ref={inputRef} {...props} />;
}
