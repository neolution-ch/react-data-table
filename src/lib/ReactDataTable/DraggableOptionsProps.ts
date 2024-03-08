export interface DraggableOptionsProps<TData> {
  draggableField: keyof TData;
  header?: string;
  onDragEnd: (active: TData, over: TData) => void;
}
