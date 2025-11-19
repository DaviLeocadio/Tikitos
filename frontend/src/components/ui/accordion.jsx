"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// WRAPPER
function Accordion({ ...props }) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className="w-full rounded-xl bg-card/30 backdrop-blur-sm shadow-sm p-2 border border-border"
      {...props}
    />
  )
}

// ITEM
function AccordionItem({ className, ...props }) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "relative overflow-hidden rounded-xl mb-2 border border-border/70 bg-[#569A33] hover:bg-[#75BA51] text-[#E5B8F1] hover:text-[#76216D]",
        className
      )}
      {...props}
    />
  )
}

// TRIGGER
function AccordionTrigger({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-center bg-[#B7DDB2] justify-between px-4 py-4 text-left",
          "text-base font-semibold tracking-tight",
          "bg-muted/10 dark:bg-muted/20 transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          "data-[state=open]:text-[#E5B8F1]",
          "disabled:pointer-events-none disabled:opacity-50",
          "[&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg]:stroke-[#9D4E92]",
          className
        )}
        {...props}
      >
        {children}

        <ChevronDownIcon
          className="text-muted-foreground stroke-[#E5B8F1] size-5 shrink-0 transition-transform duration-300"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

// CONTENT
function AccordionContent({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        // evita salto de altura
        "overflow-hidden max-h-0 data-[state=open]:max-h-[400px] transition-[max-height] duration-300 ease-in-out",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "px-4 py-4 text-[#76216D]",
          "border-t border-border/50 bg-background/60"
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
