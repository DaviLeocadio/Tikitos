export function mascaraTelefone(input) {
  let value = String(input);
  let ddd = value.slice(0, 2);
  let numero = value.slice(2);

  if (numero.length == 9) {
    let parte1 = numero.slice(0, 5);
    let parte2 = numero.slice(5);
    return `(${ddd}) ${parte1}-${parte2}`;
  } else if (numero.length > 0) {
    let parte1 = numero.slice(0, 4);
    let parte2 = numero.slice(4);
    return `(${ddd}) ${parte1}-${parte2}`;
  }
}

export function mascaraCpf(value) {
  let cpf = String(value);
  let parte1 = cpf.slice(0, 3);
  let parte2 = cpf.slice(3, 6);
  let parte3 = cpf.slice(6, 9);
  let digito = cpf.slice(9);

  return `${parte1}.${parte2}.${parte3}-${digito}`;
}

export function mascaraDinheiro(valor) {
  let preco = parseFloat(valor).toFixed(2);
  preco = String(preco);
  preco = preco.replace(".", ",");
  return `R$ ${preco}`;
}
