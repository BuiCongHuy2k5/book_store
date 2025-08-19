export class CreateInventoryInput {
  bookId: number;
  inventoryCode: string;
  quantity: number;
  minThreshold: number;
  maxThreshold: number;
  location: string;
}
