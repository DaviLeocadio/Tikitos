
export default function CardSuporte() {
    return (
        <>
      <div className="group [perspective:1000px] w-[190px] h-[254px]">
        <div className="
          relative w-full h-full text-center transition-transform duration-700 
          [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]
        ">
          
          {/* FRONT */}
          <div className="
            absolute inset-0 flex flex-col justify-center bg-[#76216D] 
            shadow-lg rounded-xl border border-3 border-dashed border-[#E7C5F2]
            [backface-visibility:hidden]
            bg-[linear-gradient(120deg, bisque_60%, rgb(255,231,222)_88%, rgb(255,211,195)_40%, rgba(255,127,80,0.603)_48%)]
            text-[coral]
          ">
            <img src="#"  />
            <p className="text-[#CAF4B7]">Hover Me</p>
          </div>
  
          {/* BACK */}
          <div className="
            absolute inset-0 flex flex-col justify-center bg-[#70B64C]
            shadow-lg rounded-xl border border-3 border-dashed border-[#4f6940]
            [backface-visibility:hidden] [transform:rotateY(180deg)]
            text-[#ebc7f5]
            bg-[linear-gradient(120deg, rgb(255,174,145)_30%, coral_88%, bisque_40%, rgb(255,185,160)_78%)]
          ">
            <p className="text-xl font-black m-0">BACK</p>
            <p>Leave Me</p>
          </div>
  
        </div>
      </div>
      </>
    );
  }