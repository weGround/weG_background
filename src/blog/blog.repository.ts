import { Injectable } from '@nestjs/common';
import {readFile, writeFile } from 'fs/promises';
import {PostDto} from './blog.model';

export interface BlogRepository {
    getAllPost(): Promise<PostDto[]>;
    createPost(PostDto: PostDto);
    getPost(id: String);
    deletePost(id: String);
    updatePost(id: String, postDto: PostDto);
}

@Injectable()
export class BlogFileRepository implements BlogRepository {
    FILE_NAME = '/root/madcamp_back/weG_background/src/blog/blog.data.json';

    async getAllPost(): Promise<PostDto[]> {
        const datas = await readFile(this.FILE_NAME, 'utf8');
        const posts = JSON.parse(datas);
        return posts;
    }

    async createPost(PostDto: PostDto) {
        const posts = await this.getAllPost();
        const id = posts.length + 1;
        const createPost = { id: id.toString(), ...PostDto, createDt: new Date() };
        posts.push(createPost);
        await writeFile(this.FILE_NAME, JSON.stringify(posts));

    }
    async getPost(id: String) {
        const posts = await this.getAllPost();
        const result = posts.find((post) => post.id === id);
        return result;
    }
    async deletePost(id: String,) {
        const posts = await this.getAllPost();
        const filteredPosts = posts.filter((post) => post.id !== id);
        await writeFile(this.FILE_NAME, JSON.stringify(filteredPosts));
    }
    async updatePost(id: String, postDto: PostDto) {
        const posts = await this.getAllPost();
        const index = posts.findIndex((post) => post.id === id);
        const updatePost = {id, ...postDto, updatePost: new Date() };
        posts[index] = updatePost;
        await writeFile(this.FILE_NAME, JSON.stringify(posts));
    }
}