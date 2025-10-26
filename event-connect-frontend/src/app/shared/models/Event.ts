import { Category } from "./Category";

export interface Event {
    id?: number;                
    nameEvent: string;
    imgUrl?: string;             
    description: string;
    dateEvent: string;          
    program: string;
    contact: string;
    price?: number;              
    numberPlace?: number;
    address: string;
    categories: Category[];          
    // profile?: Profile;        
    // registeredProfiles?: Profile[];
  }