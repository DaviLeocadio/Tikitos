export function CardProdutoSkeleton() {
  return (
    <div
      className="
        animate-pulse 
        min-w-53 
        shadow-none 
        gap-0 
        pt-0 pb-0 
        border-[3px] 
        border-dashed 
        border-[#75ba51] 
        rounded-[50px] 
        p-2 
        bg-[#D8F1DC]
      "
    >
      {/* Header */}
      <div className="pt-3 px-6 flex items-center flex-row justify-between gap-2">
        <div className="flex flex-col">
          <div className="h-3 w-24 bg-[#c8d8c9] rounded"></div>
          <div className="h-3 w-16 bg-[#c8d8c9] rounded mt-2"></div>
        </div>

        <div className="w-11 h-full flex justify-between items-center gap-3">
          <div className="h-4 w-4 bg-[#c8d8c9] rounded-full"></div>
          <div className="h-4 w-4 bg-[#c8d8c9] rounded-full"></div>
        </div>
      </div>

      {/* Imagem */}
      <div className="flex justify-center items-center px-4 mt-2">
        <div className="w-full h-32 bg-[#c8d8c9] rounded-xl"></div>
      </div>
    </div>
  );
}
