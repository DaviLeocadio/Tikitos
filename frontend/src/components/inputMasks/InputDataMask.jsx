'use client';

import { useMask } from '@react-input/mask';
import { useRef, useEffect } from 'react';

export default function InputDataMask(props) {
  const inputRef = useMask({
    mask: '__/__/____',
    replacement: { _: /\d/ },
  });

  // Valida data em tempo real
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const validate = () => {
      const v = el.value;

      if (v.length !== 10) return; // ainda incompleto

      const [dia, mes, ano] = v.split('/').map(Number);

      // validações básicas
      if (mes < 1 || mes > 12) {
        el.value = '';
        return;
      }
      if (dia < 1) {
        el.value = '';
        return;
      }
      if (ano < 1900 || ano > 2100) {
        el.value = '';
        return;
      }

      // quantidade de dias em cada mês
      const diasNoMes = new Date(ano, mes, 0).getDate();

      if (dia > diasNoMes) {
        el.value = '';
        return;
      }
    };

    el.addEventListener('input', validate);

    return () => el.removeEventListener('input', validate);
  }, []);

  return <input ref={inputRef} {...props} />;
}
