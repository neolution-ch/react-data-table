import { Column } from "@tanstack/react-table";
import { CSSProperties } from "react";

// These are the important styles to make sticky column pinning work!
const getCommonPinningStyles = <TData>(column: Column<TData>): CSSProperties => {
  const isPinned = column.getIsPinned();

  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 1 : 1,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};

export { getCommonPinningStyles };
