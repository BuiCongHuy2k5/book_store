export class UpdateInventoryInput {
  id: number;
  bookId?: number;
  inventoryCode?: string;
  quantity?: number;
  minThreshold?: number;
  maxThreshold?: number;
  location?: string;
  status?: string;
}
