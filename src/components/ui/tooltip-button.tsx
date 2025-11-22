import * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface TooltipButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  tooltip: React.ReactNode;
}

const TooltipButton = React.forwardRef<HTMLButtonElement, TooltipButtonProps>(
  ({ tooltip, ...props }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button ref={ref} {...props} />
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  },
);
TooltipButton.displayName = "TooltipButton";

export { TooltipButton };
