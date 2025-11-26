"use client";
import InputCPFMask from "@/components/inputMasks/InputCPFMask";
import InputDataMask from "@/components/inputMasks/InputDataMask";
import InputTelefoneMask from "@/components/inputMasks/InputCEPMask";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import InputCEPMask from "@/components/inputMasks/InputCEPMask";

export function CadastrarVendedorModal() {
  const [passo, setPasso] = useState("Informações");
  const [vendedorInfo, setVendedorInfo] = useState({
    name: "",
    email: "",
    telefone: "",
    cpf: "",
    data_nasc: "",
    endereco: {},
  });
  const [endereco, setEndereco] = useState({
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    cep: "",
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setVendedorInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  async function buscarCep() {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json`);
    const data = await response.json();
    setEndereco(data);
  }
  useEffect(() => {
    const cep = endereco.cep;
    if (cep.length !== 9) return;

    try {
      buscarCep();
    } catch (error) {
      console.error("Erro ao consultar cep: ", e);
    }
  }, [endereco]);

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="cursor-pointer text-roxo bg-verdefundo/50 hover:bg-verdefundo hover:text-roxo border-3 py-5 w-full border-dashed border-roxo rounded-2xl"
          >
            <PlusCircle /> Cadastrar Vendedor
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] border-3 border-dashed border-roxoescuro rounded-xl bg-[#DDF1D4]">
          <DialogHeader>
            <DialogTitle className="text-roxoescuro">
              Cadastrar vendedor
            </DialogTitle>
            <DialogDescription>
              Preencha todos os dados, não esqueca de salvar e enviar ao final.
            </DialogDescription>
          </DialogHeader>
          {passo == "Informações" && (
            <div className="space-y-3">
              <div className="mb-2 flex flex-col">
                <label
                  htmlFor="nome"
                  className="text-sm text-[#569a33]  font-semibold "
                >
                  Nome:
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                  value={vendedorInfo?.nome}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-2 flex flex-col">
                <label
                  htmlFor="email"
                  className="text-sm text-[#569a33]  font-semibold "
                >
                  Email:
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                  value={vendedorInfo?.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2 flex flex-col">
                <label
                  htmlFor="telefone"
                  className="text-sm text-[#569a33]  font-semibold "
                >
                  Telefone:
                </label>
                <InputTelefoneMask
                  type="text"
                  id="telefone"
                  name="telefone"
                  className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                  value={vendedorInfo?.telefone}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2 flex flex-col">
                <label
                  htmlFor="cpf"
                  className="text-sm text-[#569a33]  font-semibold "
                >
                  CPF:
                </label>
                <InputCPFMask
                  type="text"
                  id="cpf"
                  name="cpf"
                  className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                  value={vendedorInfo?.cpf}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2 flex flex-col">
                <label
                  htmlFor="data_nasc"
                  className="text-sm text-[#569a33]  font-semibold "
                >
                  Data de Nascimento:
                </label>
                <InputDataMask
                  type="data"
                  id="data_nasc"
                  name="data_nasc"
                  className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                  value={vendedorInfo?.data_nasc}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          {passo == "Endereço" && (
            <div className="space-y-3">
              <div className="mb-2 flex flex-col">
                <label
                  htmlFor="cep"
                  className="text-sm text-[#569a33]  font-semibold "
                >
                  CEP:
                </label>
                <InputCEPMask
                  type="text"
                  id="cep"
                  name="cep"
                  className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                  value={endereco?.cep}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-2 flex flex-col">
                <label
                  htmlFor="logradouro"
                  className="text-sm text-[#569a33]  font-semibold "
                >
                  Logradouro:
                </label>
                <input
                  type="text"
                  id="logradouro"
                  name="logradouro"
                  className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                  value={vendedorInfo?.logradouro}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2 flex flex-col">
                <label
                  htmlFor="telefone"
                  className="text-sm text-[#569a33]  font-semibold "
                >
                  Telefone:
                </label>
                <InputTelefoneMask
                  type="text"
                  id="telefone"
                  name="telefone"
                  className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                  value={vendedorInfo?.telefone}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2 flex flex-col">
                <label
                  htmlFor="cpf"
                  className="text-sm text-[#569a33]  font-semibold "
                >
                  CPF:
                </label>
                <InputCPFMask
                  type="text"
                  id="cpf"
                  name="cpf"
                  className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                  value={vendedorInfo?.cpf}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2 flex flex-col">
                <label
                  htmlFor="data_nasc"
                  className="text-sm text-[#569a33]  font-semibold "
                >
                  Data de Nascimento:
                </label>
                <InputDataMask
                  type="data"
                  id="data_nasc"
                  name="data_nasc"
                  className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                  value={vendedorInfo?.data_nasc}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="flex-1 bg-[#9bf377] text-[#4f6940] hover:bg-[#75ba51] hover:text-lime-900 font-semibold cursor-pointer"
              >
                Cancelar
              </Button>
            </DialogClose>

            {passo == "Informações" && (
              <Button
                type="submit"
                className="flex-1 bg-[#76196c] text-white hover:bg-[#924187] hover:text-white font-semibold cursor-pointer"
                onClick={() => setPasso("Endereço")}
              >
                Continuar
              </Button>
            )}
            {passo == "Endereço" && (
              <>
                <Button
                  type="submit"
                  className="flex-1 bg-[#76196c] text-white hover:bg-[#924187] hover:text-white font-semibold cursor-pointer"
                  onClick={() => setPasso("Informações")}
                >
                  Voltar
                </Button>

                <Button
                  type="submit"
                  className="flex-1 bg-[#76196c] text-white hover:bg-[#924187] hover:text-white font-semibold cursor-pointer"
                >
                  Salvar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
