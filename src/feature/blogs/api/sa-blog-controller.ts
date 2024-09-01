import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ViewBlog } from './types/views';
import { ViewModelWithArrayPosts } from '../../posts/api/types/views';
import { CreateBlogInputModel } from './pipes/create-blog-input-model';
import { CreatePostForBlogInputModel } from './pipes/create-post-for-blog-input-model';
import { AuthGuard } from '../../../common/guard/auth-guard';
import { QueryParamsInputModel } from '../../../common/pipes/query-params-input-model';
import { UpdatePostForCorrectBlogInputModel } from '../../posts/api/pipes/update-post-for-correct-blog-input-model';
import { PostService } from '../../posts/services/post-service';
import { BlogQuerySqlTypeormRepository } from '../repositories/blog-query-sql-typeorm-repository';
import { PostQuerySqlTypeormRepository } from '../../posts/repositories/post-query-sql-typeorm-repository';
import { DataUserExtractorFromTokenGuard } from '../../../common/guard/data-user-extractor-from-token-guard';
import { BlogService } from '../services/blog-service';

@Controller('sa/blogs')
export class SaBlogController {
  constructor(
    protected postService: PostService,
    protected blogQuerySqlTypeormRepository: BlogQuerySqlTypeormRepository,
    protected postQuerySqlTypeormRepository: PostQuerySqlTypeormRepository,
    protected blogService: BlogService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async createBlog(
    @Body() createBlogInputModel: CreateBlogInputModel,
  ): Promise<ViewBlog> {
    const blogId = await this.blogService.createBlog(createBlogInputModel);

    if (!blogId) {
      throw new NotFoundException(
        'blog not create:andpoint-post,url /sa/blogs',
      );
    }

    const blog = await this.blogQuerySqlTypeormRepository.getBlogById(blogId);

    if (blog) {
      return blog;
    } else {
      throw new NotFoundException('blog not found:andpoint-post,url /blogs');
    }
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteBlogById(@Param('id') blogId: string) {
    const isDeleteBlogById: boolean | null =
      await this.blogService.deleteBlogById(blogId);

    if (isDeleteBlogById) {
      return;
    } else {
      throw new NotFoundException(
        'blog not found:andpoint-delete,url /blogs/id',
      );
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updateBlog(
    @Param('id') bologId: string,
    @Body() updateBlogInputModel: CreateBlogInputModel,
  ) {
    const isUpdateBlog = await this.blogService.updateBlog(
      bologId,
      updateBlogInputModel,
    );

    if (isUpdateBlog) {
      return;
    } else {
      throw new NotFoundException(
        'blog not update:andpoint-put ,url /blogs/id',
      );
    }
  }

  @UseGuards(AuthGuard, DataUserExtractorFromTokenGuard)
  @UseGuards(AuthGuard)
  @Post(':blogId/posts')
  async createPostFortBlog(
    @Param('blogId') blogId: string,
    @Body() createPostForBlogInputModel: CreatePostForBlogInputModel,
    @Req() request: Request,
  ) {
    debugger;
    /* чтобы переиспользовать в этом обработчике метод
 getPostById  ему нужна (userId)- она будет 
 в данном случае null но главное что удовлетворяю
 метод значением-userId*/

    const userId: string | null = request['userId'];

    /* создать новый пост ДЛЯ КОНКРЕТНОГО БЛОГА и вернут
     данные этого поста и также структуру 
    данных(снулевыми значениями)  о лайках к этому посту*/

    const postId: string | null =
      await this.postService.createPostForCorrectBlog(
        blogId,
        createPostForBlogInputModel,
      );

    if (!postId) {
      throw new NotFoundException(
        'Not found blog- ' + ':method-post,url -blogs/:blogId /post',
      );
    }

    const post = await this.postQuerySqlTypeormRepository.getPostByPostId(
      postId,
      userId,
    );

    if (post) {
      return post;
    } else {
      throw new NotFoundException(
        'Not create post- ' + ':method-post,url -blogs/:blogId /post',
      );
    }
  }

  @UseGuards(DataUserExtractorFromTokenGuard)
  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':blogId/posts/:postId')
  async updatePost(
    @Param('postId') postId: string,
    @Param('blogId') blogId: string,
    @Body() updatePostInputModel: UpdatePostForCorrectBlogInputModel,
  ) {
    const isUpdatePost: boolean = await this.postService.updatePost(
      blogId,
      postId,
      updatePostInputModel,
    );

    if (isUpdatePost) {
      return;
    } else {
      throw new NotFoundException(
        'post not update:andpoint-put ,url /posts/id',
      );
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':blogId/posts/:postId')
  async deletePost(
    @Param('postId') postId: string,
    @Param('blogId') blogId: string,
  ) {
    const isDeletePost: boolean = await this.postService.deletePost(
      blogId,
      postId,
    );

    if (isDeletePost) {
      return;
    } else {
      throw new NotFoundException(
        'post not update:andpoint-put ,url /posts/id',
      );
    }
  }
}
