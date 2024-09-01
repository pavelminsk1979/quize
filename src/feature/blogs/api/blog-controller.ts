import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ViewModelWithArrayPosts } from '../../posts/api/types/views';
import { QueryParamsInputModel } from '../../../common/pipes/query-params-input-model';
import { CreateBlogInputModel } from './pipes/create-blog-input-model';
import { BlogQuerySqlTypeormRepository } from '../repositories/blog-query-sql-typeorm-repository';
import { PostQuerySqlTypeormRepository } from '../../posts/repositories/post-query-sql-typeorm-repository';
import { DataUserExtractorFromTokenGuard } from '../../../common/guard/data-user-extractor-from-token-guard';
import { BlogService } from '../services/blog-service';

@Controller('blogs')
export class BlogController {
  constructor(
    protected blogService: BlogService,
    protected blogQuerySqlTypeormRepository: BlogQuerySqlTypeormRepository,
    protected postQuerySqlTypeormRepository: PostQuerySqlTypeormRepository,
  ) {}

  @Post()
  async createBlog(@Body() createBlogInputModel: CreateBlogInputModel) {
    const blog = await this.blogService.createBlog(createBlogInputModel);

    if (blog) {
      return blog;
    } else {
      throw new NotFoundException('blog not found:andpoint-post,url /blogs');
    }
  }

  @Get()
  async getBlogs(@Query() queryParamsBlogInputModel: QueryParamsInputModel) {
    const blogs = await this.blogQuerySqlTypeormRepository.getBlogs(
      queryParamsBlogInputModel,
    );

    return blogs;
  }

  @Get(':id')
  async getBlogById(@Param('id') bologId: string) {
    const blog = await this.blogQuerySqlTypeormRepository.getBlogById(bologId);

    if (blog) {
      return blog;
    } else {
      throw new NotFoundException('blog not found:andpoint-get,url /blogs/id');
    }
  }

  @UseGuards(DataUserExtractorFromTokenGuard)
  @Get(':blogId/posts')
  async getPostsForBlog(
    @Param('blogId') blogId: string,
    @Query() queryParamsPostForBlogInputModel: QueryParamsInputModel,
    @Req() request: Request,
  ): Promise<ViewModelWithArrayPosts> {
    /*Айдишка пользователя нужна для-- когда
    отдадим ответ в нем дудет информация 
    о том какой статус учтановил данный пользователь
    который этот запрос делает */

    const userId: string | null = request['userId'];

    //вернуть все posts(массив) для корректного блога
    //и у каждого поста  будут данные о лайках

    const posts =
      await this.postQuerySqlTypeormRepository.getPostsByCorrectBlogId(
        blogId,
        queryParamsPostForBlogInputModel,
        userId,
      );

    if (posts) {
      return posts;
    } else {
      throw new NotFoundException(
        'blog  is not exists  ' + ':method-get,url -blogs/:blogId /posts',
      );
    }
  }
}
