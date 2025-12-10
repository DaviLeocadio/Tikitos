"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { aparecerToast } from "@/utils/toast";

export default function ModalTransferirFuncionario({ funcionario, onClose }) {
  const [filiais, setFiliais] = useState([]);
  const [destino, setDestino] = useState("");
  const [perfil, setPerfil] = useState(funcionario.perfil);
  const [initialPerfil, setInitialPerfil] = useState(funcionario.perfil);
  const [initialDestino, setInitialDestino] = useState(funcionario.id_empresa || "");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setPerfil(funcionario?.perfil || "");
    // guarda valores iniciais para comparação (não mudar durante edição)
    setInitialPerfil(funcionario?.perfil || "");
    setInitialDestino(funcionario?.id_empresa || "");
    // reset destino; será reconfigurado após fetch das filiais
    setDestino("");
  }, [funcionario]);
  // Recarrega filiais sempre que o perfil selecionado mudar
  useEffect(() => {
    const fetchFiliais = async () => {
      if (!perfil) {
        setFiliais([]);
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:8080/admin/filiais/meta?perfil=${perfil}`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (res.ok) {
          const hubs = data.filiais || [];
          setFiliais(hubs);
          // se a filial atual do funcionário existir na lista, pré-seleciona
          if (funcionario?.id_empresa && hubs.some((f) => String(f.id_empresa) === String(funcionario.id_empresa))) {
            setDestino(String(funcionario.id_empresa));
          } else {
            // mantém destino vazio (força o usuário a escolher)
            setDestino("");
          }
        } else {
          console.error("Erro ao buscar filiais:", data.error);
          setFiliais([]);
        }
      } catch (err) {
        console.error("Erro ao carregar filiais:", err);
        setFiliais([]);
      } finally {
        setLoading(false);
      }
    };

    // reset destino quando trocar o perfil
    setDestino("");

    fetchFiliais();
  }, [perfil]);

  const handleSubmit = async () => {
    if (!destino) return aparecerToast("Selecione uma filial destino.");
    if (!filiais || filiais.length === 0)
      return aparecerToast("Não há filiais disponíveis para transferência.");

    // Não permite enviar se nem filial nem cargo foram alterados
    const changedFilial = String(destino) !== String(initialDestino);
    const changedPerfil = perfil !== initialPerfil;
    if (!changedFilial && !changedPerfil) {
      return aparecerToast("Selecione uma filial diferente ou altere o cargo antes de confirmar.");
    }

    try {
      setSubmitting(true);

      const res = await fetch(
        `http://localhost:8080/admin/filiais/${destino}/transferir-funcionario`,
        {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idUsuario: funcionario.id_usuario,
            perfil,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        aparecerToast("Funcionário transferido com sucesso!");
        onClose && onClose();
      } else {
        aparecerToast(data.error || "Erro ao transferir funcionário.");
      }
    } catch (error) {
      console.error("Erro ao enviar transferência:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">

      {/* CONTAINER DO MODAL */}
      <div className="bg-[#CAF4B7] rounded-2xl shadow-2xl w-full max-w-md p-6 border-4 border-[#e8c5f1] relative">

        {/* CABEÇALHO */}
        <div className="bg-[#76196c] text-[#CAF4B7] px-5 py-3 rounded-xl -mt-10 mb-4 shadow-md text-center">
          <h2 className="text-xl font-bold tracking-wide">
            Transferir {funcionario.perfil === "gerente" ? "Gerente" : "Funcionário"}
          </h2>
        </div>

        {/* DESCRIÇÃO */}
        <p className="text-gray-700 mb-4 leading-relaxed">
          Funcionário:{" "}
          <strong className="text-[#76196c]">{funcionario.nome}</strong>
          <p></p>
          Perfil atual:{" "}
          <strong className="text-[#924187]">{funcionario.perfil}</strong>
        </p>

        {/* SELECT DE FILIAIS */}
        {loading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="animate-spin" />
            Carregando filiais...
          </div>
        ) : (
          <div className="mb-4">
            <label className="block mb-1 font-medium text-[#76196c]">
              Selecionar Filial Destino
            </label>
            <select
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              className="w-full p-3 bg-[#E5B8F1] text-[#76196C] rounded-xl border border-[#d695e7] focus:ring-2 focus:ring-[#76196c] transition"
            >
              <option value="">Escolha uma filial</option>
              {filiais.map((f) => (
                <option key={f.id_empresa} value={f.id_empresa}>
                  {f.nome} — #{f.id_empresa}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* SELECT DE PERFIL */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-[#76196c]">
            Perfil na nova filial
          </label>

          <select
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            className="w-full p-3 bg-[#E5B8F1] rounded-xl text-[#76196C] border border-[#d695e7] focus:ring-2 focus:ring-[#76196c] transition"
          >
            <option value="vendedor">Vendedor</option>
            <option value="gerente">Gerente</option>
          </select>
        </div>

        {/* BOTÕES */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded-xl bg-[#e8c5f1] text-[#76196c] font-semibold hover:bg-[#d695e7] transition"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={
              submitting ||
              // desabilita se não houver filiais ou se nenhum dado foi alterado
              !filiais ||
              filiais.length === 0 ||
              (String(destino) === String(initialDestino) && perfil === initialPerfil)
            }
            className="px-5 py-2 rounded-xl bg-[#75ba51] text-white font-semibold shadow hover:bg-[#4f6940] transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting && <Loader2 className="animate-spin" size={20} />}
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
