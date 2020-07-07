export interface IFood{
    name:string;
    calories:string;
    fat:string;
    protein:string;
    date:IDate;
}
export interface IDate{
    day:number;
    month:number;
}
export interface IProduct{
  brand_name:string;
  item_id:string;
  item_name:string;
  nf_calories:number;
  nf_total_fat:number;
  nf_protein:number;
}