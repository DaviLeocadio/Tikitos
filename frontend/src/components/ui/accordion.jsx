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
        "overflow-hidden rounded-xl mb-2 border border-border/70 bg-green-200 transition-all",
        "data-[state=open]:shadow-md data-[state=open]:bg-muted/40",
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
          // LAYOUT
          "flex flex-1 items-center justify-between rounded-xl px-4 py-4 text-left",

          // TEXT
          "text-base font-semibold tracking-tight",

          // COLORS + STATES
          "hover:bg-muted/40 bg-muted/10 dark:bg-muted/20 transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          "data-[state=open]:text-primary data-[state=open]:bg-muted/50",

          // INTERACTIONS
          "disabled:pointer-events-none disabled:opacity-50",
          "[&[data-state=open]>svg]:rotate-180",

          className
        )}
        {...props}
      >
        {children}

        <ChevronDownIcon
          className="text-muted-foreground size-5 shrink-0 transition-transform duration-300"
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
        "overflow-hidden text-sm leading-relaxed",
        "data-[state=closed]:animate-accordion-up",
        "data-[state=open]:animate-accordion-down",
      )}
      {...props}
    >
      <div
        className={cn(
          "px-4 py-4 text-muted-foreground",
          "border-t border-border/50 bg-background/40",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
