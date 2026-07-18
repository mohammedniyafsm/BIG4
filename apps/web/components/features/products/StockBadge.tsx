import { Badge } from "@/components/ui/badge";

export function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return <Badge variant="destructive">Out of Stock</Badge>;
  }
  
  if (stock <= 5) {
    return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border-transparent">Low Stock</Badge>;
  }

  return <Badge variant="default" className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-transparent">In Stock</Badge>;
}
