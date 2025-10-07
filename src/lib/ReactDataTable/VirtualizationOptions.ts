import { useVirtualizer } from "@tanstack/react-virtual";

export type VirtualizationsOptions = Omit<Parameters<typeof useVirtualizer<HTMLDivElement, Element>>[0], "getScrollElement">;
