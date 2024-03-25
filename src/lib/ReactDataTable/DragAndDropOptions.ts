import { DragEndEvent } from "@dnd-kit/core/dist/types/events";

/**
 * The props for the dragAndDropOptions
 */
export interface DragAndDropOptions {
  /**
   * enable or disable the drag-and-drop feature.
   */
  enableDragAndDrop: boolean;
  /**
   * the handle drag end method to be called once the row drag has fulfilled
   * @param event the drag end event
   */
  onDragEnd(event: DragEndEvent): void;
}
