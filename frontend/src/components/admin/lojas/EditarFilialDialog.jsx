"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Loader2 } from "lucide-react";

const TIKITOS_COLORS = {
  primary: "#76196c",
  secondary: "#924187",
  light: "#d695e7",
  success: "#75ba51",
};

export default function EditarFilialDialog({ loja, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nome: loja.nome || "",
    logradouro: loja?.endereco?.logradouro || "",
    numero: loja?.endereco?.numero || "",
    complemento: loja?.endereco?.complemento || "",
    bairro: loja?.endereco?.bairro || "",
    cidade: loja?.endereco?.cidade || "",
    uf: loja?.endereco?.uf || "",
    cep: loja?.endereco?.cep || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/admin/filiais/${loja.id_empresa}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          endereco: {
            logradouro: form.logradouro,
            numero: form.numero,
            complemento: form.complemento,
            bairro: form.bairro,
            cidade: form.cidade,
            uf: form.uf,
            cep: form.cep,
          },
          status: loja.status,
        }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar filial.");

      if (onUpdated) onUpdated();
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar a filial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center px-4 py-2 text-white font-medium rounded-lg shadow-md transition duration-150 text-sm"
          style={{ backgroundColor: TIKITOS_COLORS.primary }}
        >
          <Pencil size={16} className="mr-2" />
          Editar Filial
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg rounded-2xl p-6" style={{ borderColor: TIKITOS_COLORS.light }}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold" style={{ color: TIKITOS_COLORS.primary }}>
            Editar Dados da Filial
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 mt-4">
          <div>
            <label classname="font-semibold text-sm">Nome da Loja</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-xl border focus:outline-none"
              style={{ borderColor: TIKITOS_COLORS.light }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-sm">Logradouro</label>
              <input
                name="logradouro"
                value={form.logradouro}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-xl border"
                style={{ borderColor: TIKITOS_COLORS.light }}
              />
            </div>

            <div>
              <label className="font-semibold text-sm">Número</label>
              <input
                name="numero"
                value={form.numero}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-xl border"
                style={{ borderColor: TIKITOS_COLORS.light }}
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-sm">Complemento</label>
            <input
              name="complemento"
              value={form.complemento}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-xl border"
              style={{ borderColor: TIKITOS_COLORS.light }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-sm">Bairro</label>
              <input
                name="bairro"
                value={form.bairro}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-xl border"
                style={{ borderColor: TIKITOS_COLORS.light }}
              />
            </div>

            <div>
              <label className="font-semibold text-sm">Cidade</label>
              <input
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-xl border"
                style={{ borderColor: TIKITOS_COLORS.light }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-sm">UF</label>
              <input
                name="uf"
                value={form.uf}
                onChange={handleChange}
                maxLength={2}
                className="w-full mt-1 px-3 py-2 rounded-xl border uppercase"
                style={{ borderColor: TIKITOS_COLORS.light }}
              />
            </div>

            <div>
              <label className="font-semibold text-sm">CEP</label>
              <input
                name="cep"
                value={form.cep}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-xl border"
                style={{ borderColor: TIKITOS_COLORS.light }}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            disabled={loading}
            onClick={handleSubmit}
            className="px-4 py-2 text-white rounded-xl shadow-md"
            style={{ backgroundColor: TIKITOS_COLORS.success }}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin mx-auto" />
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
