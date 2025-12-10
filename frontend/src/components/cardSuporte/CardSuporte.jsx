export default function CardSuporte({ title = "título padrão", text = "texto padrão lalala", src, sidebarOpen }) {
  // max-width do card depende do estado do sidebar
  const maxWidth = sidebarOpen ? "max-w-[275px]" : "max-w-[315px]";

  return (
    <div className={`group flex-1 [perspective:1000px] min-w-[200px] ${maxWidth} h-[280px] transition-all duration-500`}>
      <div className="
        relative w-full h-full text-center transition-transform duration-700 ease-in-out
        [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]
      ">

        {/* FRONT */}
        <div className="
          absolute inset-0 flex flex-col justify-center items-center bg-[#76216D]
          shadow-lg rounded-xl border-3 border-dashed border-[#E7C5F2]
          [backface-visibility:hidden]
          bg-[linear-gradient(120deg, bisque_60%, rgb(255,231,222)_88%, rgb(255,211,195)_40%, rgba(255,127,80,0.603)_48%)]
          p-4
        ">
          <img src={src} className="w-[40%] mx-auto" />
          <p className="text-[#CAF4B7] mt-5 font-semibold">{title}</p>
        </div>

        {/* BACK */}
        <div className="
          absolute inset-0 flex flex-col justify-center items-center bg-[#9BF377]
          shadow-lg rounded-xl border-3 border-dashed border-[#4f6940]
          [backface-visibility:hidden] [transform:rotateY(180deg)]
          text-[#76216D] p-5
          bg-[linear-gradient(120deg, rgb(255,174,145)_30%, coral_88%, bisque_40%, rgb(255,185,160)_78%)]
        ">
          <div className="pb-5">
<img src={src} className="w-[20%] mx-auto" />
          </div>
          
          <p className="text-sm leading-relaxed text-left">{text}</p>
        </div>

      </div>
    </div>
  );
}
