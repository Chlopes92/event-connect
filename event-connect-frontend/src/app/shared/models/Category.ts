import { Event } from './Event';

export interface Category {
    id?: number;             
    nameCategory: string;    
    events?: Event[];        
}