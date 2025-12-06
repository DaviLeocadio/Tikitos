import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { CircleCheck, Ruler, Smile, SwatchBook } from "lucide-react";
import { cn } from "@/lib/utils";

const options = [
  {
    label: "Colors",
    value: "colors",
    icon: SwatchBook,
  },
  {
    label: "Emojis",
    value: "emojis",
    icon: Smile,
  },
  {
    label: "Spacing",
    value: "spacing",
    icon: Ruler,
  },
];

const RadioCheckboxStyleDemo = () => {
  return (
    <RadioGroupPrimitive.Root
      defaultValue="colors"
      className="w-full max-w-sm grid grid-cols-3 gap-3 p-0-"
    >
      {options.map((option) => (
        <RadioGroupPrimitive.Item
          key={option.value}
          value={option.value}
          className={cn(
            "relative ring-[1px] ring-border rounded-lg px-4 py-3 text-start text-muted-foreground",
            "data-[state=checked]:ring-2 data-[state=checked]:ring-primary",
            "data-[state=checked]:text-primary"
          )}
        >
          <option.icon className="mb-3" />
          <span className="font-medium tracking-tight">{option.label}</span>

          <RadioGroupPrimitive.Indicator>
            <CircleCheck
              className="absolute top-2 right-2 h-5 w-5 fill-primary text-primary-foreground"
            />
          </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
};

export default RadioCheckboxStyleDemo;