import { Injectable } from '@nestjs/common';
import { CreateBlogInputModel } from '../api/pipes/create-blog-input-model';
import { CreateBlog } from '../api/types/dto';
import { BlogSqlTypeormRepository } from '../repositories/blog-sql-typeorm-repository';

@Injectable()
export class BlogService {
  constructor(protected blogSqlTypeormRepository: BlogSqlTypeormRepository) {}

  async createBlog(createBlogInputModel: CreateBlogInputModel) {
    const { name, websiteUrl, description } = createBlogInputModel;

    const newBlog: CreateBlog = {
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    return this.blogSqlTypeormRepository.createNewBlog(newBlog);
  }

  async deleteBlogById(blogId: string) {
    return this.blogSqlTypeormRepository.deleteBlogById(blogId);
  }

  async updateBlog(blogId: string, updateBlogInputModel: CreateBlogInputModel) {
    return this.blogSqlTypeormRepository.updateBlog(
      blogId,
      updateBlogInputModel,
    );
  }
}
