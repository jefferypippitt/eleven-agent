import * as React from "react";

import { cn } from "@/lib/utils";

const Response = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm", className)} {...props} />
));
Response.displayName = "Response";

export { Response };
