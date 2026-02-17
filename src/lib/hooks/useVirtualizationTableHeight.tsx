import { Virtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect, useRef, useState } from "react";

const adjustTableHeight = (
  tableRef: React.RefObject<HTMLTableElement | null>,
  virtualHeight: number,
  onPseudoHeightChange: useVirtualizationTableHeightProps["onPseudoHeightChange"],
) => {
  if (!tableRef.current) return;

  // calculate the height for the pseudo element after the table
  const existingPseudoElement = window.getComputedStyle(tableRef.current, "::after");
  const existingPseudoHeight = Number.parseFloat(existingPseudoElement.height) || 0;
  const tableHeight = tableRef.current.clientHeight - existingPseudoHeight;
  const pseudoHeight = Math.max(virtualHeight - tableHeight, 0);
  onPseudoHeightChange?.(pseudoHeight);

  return pseudoHeight;
};

export interface useVirtualizationTableHeightProps {
  parentRef: React.RefObject<HTMLDivElement | null>;
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  enabled: boolean;
  onPseudoHeightChange?: (height: number) => void;
}

// https://github.com/TanStack/virtual/issues/640
const useVirtualizationTableHeight = (props: useVirtualizationTableHeightProps) => {
  const { parentRef, virtualizer, enabled, onPseudoHeightChange } = props;
  const scrollableRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [isScrollNearBottom, setIsScrollNearBottom] = useState(false);

  // avoid calling virtualizer methods when virtualization is disabled
  const virtualItems = enabled ? virtualizer.getVirtualItems() : [];
  const virtualSize = enabled ? virtualizer.getTotalSize() : 0;

  // callback to adjust the height of the pseudo element
  const handlePseudoResize = useCallback(
    () => adjustTableHeight(tableRef, virtualSize, onPseudoHeightChange),
    [tableRef, virtualSize, onPseudoHeightChange],
  );

  // callback to handle scrolling, checking if we are near the bottom
  const handleScroll = useCallback(() => {
    if (parentRef.current) {
      const scrollPosition = parentRef.current?.scrollTop;
      const visibleHeight = parentRef.current?.clientHeight;
      setIsScrollNearBottom(scrollPosition > virtualSize * 0.95 - visibleHeight);
    }
  }, [parentRef, virtualSize]);

  // add an event listener on the scrollable parent container and resize the
  // pseudo element whenever the table renders with new data
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const scrollable = parentRef.current;
    if (scrollable) scrollable.addEventListener("scroll", handleScroll);
    handlePseudoResize();

    return () => {
      if (scrollable) scrollable.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, handlePseudoResize, parentRef, enabled]);

  // if we are near the bottom of the table, resize the pseudo element each time
  // the length of virtual items changes (which is effectively the number of table
  // rows rendered to the DOM). This ensures we don't scroll too far or too short.
  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (isScrollNearBottom) handlePseudoResize();
  }, [isScrollNearBottom, virtualItems.length, handlePseudoResize, enabled]);

  return { scrollableRef, tableRef };
};

export { useVirtualizationTableHeight };
