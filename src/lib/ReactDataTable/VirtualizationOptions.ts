import { useVirtualizer } from "@tanstack/react-virtual";

type VirtualizaterOptions = Omit<Parameters<typeof useVirtualizer<HTMLDivElement, Element>>[0], "getScrollElement" | "count" | "enabled">;

export interface VirtualizationOptions extends VirtualizaterOptions {
  /**
   * indicates whether to enable virtualization
   * @default false
   */
  enabled?: boolean;
  /**
   * indicates the height of the virtualized container
   * @default 600
   */
  height?: number;
}
