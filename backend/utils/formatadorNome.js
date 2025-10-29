const particulas = ["de", "da", "do", "dos", "das"];

export function formatarNome(nomeCompleto) {
    if (!nomeCompleto) return "";

    // Coloca tudo em minúsculo e depois capitaliza cada palavra
    const nomeFormatado = nomeCompleto
        .toLowerCase()
        .split(" ")
        .filter(p => p.trim() !== "")
        .map((palavra) => {
            if (particulas.includes(palavra)) return palavra
            return palavra.charAt(0).toUpperCase() + palavra.slice(1);
        })
        .join(" ");

    return nomeFormatado;
    //BERNARDO DE SOUZA MADUREIRA retorna Bernardo de Souza Madureira
}

export function primeiroNome(nomeCompleto) {
    if (!nomeCompleto) return "";
    const nomeFormatado = formatarNome(nomeCompleto);
    const partes = nomeFormatado.split(" ");

    return partes[0];
    // Bernardo de Souza Madureira retorna Bernardo
}

export function primeiroNomeInicial(nomeCompleto) {
    if (!nomeCompleto) return "";
    const nomeFormatado = formatarNome(nomeCompleto);
    const partes = nomeFormatado.split(" ");

    const primeiroNome = partes[0];
    const sobrenomeValido = partes.find((p, i) => i > 0 && !particulas.includes(p))

    if (!sobrenomeValido) return primeiroNome;
    return `${primeiroNome} ${sobrenomeValido.charAt(0)}.`;
    // Bernardo de Souza Madureira retorna Bernardo S.
}