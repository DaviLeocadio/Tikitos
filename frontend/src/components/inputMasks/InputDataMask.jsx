'use client';

import { useMask } from '@react-input/mask';

export default function InputDataMask(props) {
  const inputRef = useMask({
    mask: '__/__/____', // mascara da data
    replacement: { _: /\d/ },
  });

  return <input ref={inputRef} {...props} />;
}
