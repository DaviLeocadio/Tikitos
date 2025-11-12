import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { CircleCheck, Ruler, Smile, SwatchBook } from "lucide-react";

const options = [
  {
    label: "Total",
    value: "Total",
    icon: SwatchBook,
  },
  {
    label: "Subtotal",
    value: "Subtotal",
    icon: Smile,
  },
  {
    label: "Desconto",
    value: "Desconto",
    icon: Ruler,
    defaultChecked: true,
  },
];

const CheckboxCardDemo = () => {
  return (
    <div className="w-full max-w-sm grid grid-cols-3 gap-3">
      {options.map((option, index) => (
        <CheckboxPrimitive.Root
          key={option.value}
          defaultChecked={index === options.length - 1} // ✅ só o último fica marcado
          className="relative ring-[1px] ring-border rounded-lg px-4 py-3 text-start text-muted-foreground data-[state=checked]:ring-2 data-[state=checked]:ring-primary data-[state=checked]:text-primary"
        >
          <option.icon className="mb-3" />
          <span className="font-medium tracking-tight">{option.label}</span>

          <CheckboxPrimitive.Indicator className="absolute top-2 right-2">
            <CircleCheck className="fill-primary text-primary-foreground" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
      ))}
    </div>
  );
};

export default CheckboxCardDemo;

// import { Checkbox as CheckboxPrimitive } from "radix-ui";
// import { CircleCheck, Ruler, Smile, SwatchBook } from "lucide-react";

// const options = [
//   {
//     label: "Colors",
//     value: "colors",
//     icon: SwatchBook,
//     defaultChecked: true,
//   },
//   {
//     label: "Emojis",
//     value: "emojis",
//     icon: Smile,
//   },
//   {
//     label: "Spacing",
//     value: "spacing",
//     icon: Ruler,
//   },
// ];

// const CheckboxCardDemo = () => {
//   return (
//     <div className="w-full max-w-sm grid grid-cols-3 gap-3">
//       {options.map((option) => (
//         <CheckboxPrimitive.Root
//           key={option.value}
//           defaultChecked={option.defaultChecked}
//           className="relative ring-[1px] ring-border rounded-lg px-4 py-3 text-start text-muted-foreground data-[state=checked]:ring-2 data-[state=checked]:ring-primary data-[state=checked]:text-primary">
//           <option.icon className="mb-3" />
//           <span className="font-medium tracking-tight">{option.label}</span>

//           <CheckboxPrimitive.Indicator className="absolute top-2 right-2">
//             <CircleCheck className="fill-primary text-primary-foreground" />
//           </CheckboxPrimitive.Indicator>
//         </CheckboxPrimitive.Root>
//       ))}
//     </div>
//   );
// };

// export default CheckboxCardDemo;