export interface PostDto {
    id : string;
    title: string;
    content: string;
    name: string;
    createDt: Date;
    updatedDt?: Date;
}