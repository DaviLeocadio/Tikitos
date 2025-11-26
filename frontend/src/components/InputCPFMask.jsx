'use client';

import { useMask } from '@react-input/mask';

export default function InputCPFMask(props) {
  const inputRef = useMask({
    mask: '___.___.___-__', // mascara do CPF
    replacement: { _: /\d/ },
  });

  return <input ref={inputRef} {...props} />;
}
