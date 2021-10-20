import { postInterface } from "./post.interface";

export interface listPostInterface{
    posts:postInterface[],
    page:number,
    limit:number,
    totalCount:number    
}