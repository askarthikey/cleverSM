import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Collection, ObjectId, Document } from 'mongodb';
import { DatabaseService } from '../database/database.service';
import { UsersService } from '../users/users.service';
import { Post, Comment, PostResponse } from './interfaces/post.interface';
import { CreatePostDto, UpdatePostDto, CreateCommentDto } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(
    private databaseService: DatabaseService,
    private usersService: UsersService
  ) {}

  private getPostsCollection(): Collection<Document> {
    return this.databaseService.getCollection('posts');
  }

  async create(createPostDto: CreatePostDto, authorId: string): Promise<PostResponse> {
    if (!ObjectId.isValid(authorId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const postsCollection = this.getPostsCollection();
    const author = await this.usersService.findById(authorId);

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const newPost = {
      title: createPostDto.title.trim(),
      description: createPostDto.description.trim(),
      author: new ObjectId(authorId),
      authorUsername: author.username,
      likes: [],
      likesCount: 0,
      comments: [],
      commentsCount: 0,
      shares: [],
      sharesCount: 0,
      allowComments: createPostDto.allowComments ?? true,
      allowShares: createPostDto.allowShares ?? true,
      isPublic: createPostDto.isPublic ?? true,
      privacy: createPostDto.privacy || 'public',
      tags: createPostDto.tags || [],
      media: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await postsCollection.insertOne(newPost);
    const post = await postsCollection.findOne({ _id: result.insertedId }) as Post;

    if (!post) {
      throw new Error('Failed to create post');
    }

    return this.formatPostResponse(post, authorId);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    userId?: string,
    privacy: string = 'public'
  ): Promise<{ posts: PostResponse[]; total: number; page: number; totalPages: number }> {
    const postsCollection = this.getPostsCollection();
    const skip = (page - 1) * limit;

    // Build filter based on privacy and user permissions
    let filter: any = {};
    
    if (privacy === 'public') {
      filter = { 
        $or: [
          { privacy: 'public', isPublic: true },
          { privacy: 'public' }
        ]
      };
    } else if (userId) {
      // If user is authenticated, show their posts and public posts
      filter = {
        $or: [
          { author: new ObjectId(userId) },
          { privacy: 'public', isPublic: true },
          { 
            privacy: 'followers',
            // Add logic to check if user follows the author
          }
        ]
      };
    }

    const [posts, total] = await Promise.all([
      postsCollection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray() as Promise<Post[]>,
      postsCollection.countDocuments(filter)
    ]);

    const formattedPosts = await Promise.all(
      posts.map(post => this.formatPostResponse(post, userId))
    );

    return {
      posts: formattedPosts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getFeed(
    page: number = 1,
    limit: number = 10,
    userId: string
  ): Promise<{ posts: PostResponse[]; total: number; page: number; totalPages: number }> {
    if (!ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const postsCollection = this.getPostsCollection();
    const skip = (page - 1) * limit;

    // Get the current user to find who they follow
    const currentUser = await this.usersService.findById(userId);
    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    // Create array of user IDs to include in feed (following + self)
    const followingIds = currentUser.following.map(id => new ObjectId(id));
    followingIds.push(new ObjectId(userId)); // Include own posts

    // Build filter for feed posts
    const filter = {
      author: { $in: followingIds },
      $or: [
        { privacy: 'public' },
        { privacy: 'followers' },
        { author: new ObjectId(userId) } // Always show own posts regardless of privacy
      ]
    };

    const [posts, total] = await Promise.all([
      postsCollection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray() as Promise<Post[]>,
      postsCollection.countDocuments(filter)
    ]);

    const formattedPosts = await Promise.all(
      posts.map(post => this.formatPostResponse(post, userId))
    );

    return {
      posts: formattedPosts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findById(id: string, userId?: string): Promise<PostResponse> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid post ID');
    }

    const postsCollection = this.getPostsCollection();
    const post = await postsCollection.findOne({ _id: new ObjectId(id) }) as Post;

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user has permission to view this post
    if (!this.canUserViewPost(post, userId)) {
      throw new ForbiddenException('You do not have permission to view this post');
    }

    return this.formatPostResponse(post, userId);
  }

  async findByAuthor(
    authorId: string,
    page: number = 1,
    limit: number = 10,
    viewerId?: string
  ): Promise<{ posts: PostResponse[]; total: number; page: number; totalPages: number }> {
    if (!ObjectId.isValid(authorId)) {
      throw new BadRequestException('Invalid author ID');
    }

    const postsCollection = this.getPostsCollection();
    const skip = (page - 1) * limit;

    // Build filter based on viewer permissions
    let filter: any = { author: new ObjectId(authorId) };
    
    if (viewerId !== authorId) {
      // If not viewing own posts, only show public posts
      filter.privacy = 'public';
      filter.isPublic = true;
    }

    const [posts, total] = await Promise.all([
      postsCollection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray() as Promise<Post[]>,
      postsCollection.countDocuments(filter)
    ]);

    const formattedPosts = await Promise.all(
      posts.map(post => this.formatPostResponse(post, viewerId))
    );

    return {
      posts: formattedPosts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string): Promise<PostResponse> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid post ID');
    }

    const postsCollection = this.getPostsCollection();
    const post = await postsCollection.findOne({ _id: new ObjectId(id) }) as Post;

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.author.toString() !== userId) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    const updateData = {
      ...updatePostDto,
      updatedAt: new Date(),
    };

    const result = await postsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new NotFoundException('Post not found');
    }

    return this.formatPostResponse(result as Post, userId);
  }

  async delete(id: string, userId: string): Promise<void> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid post ID');
    }

    const postsCollection = this.getPostsCollection();
    const post = await postsCollection.findOne({ _id: new ObjectId(id) }) as Post;

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.author.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Post not found');
    }
  }

  async likePost(postId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
    if (!ObjectId.isValid(postId) || !ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid ID');
    }

    const postsCollection = this.getPostsCollection();
    const userObjectId = new ObjectId(userId);
    
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) }) as Post;
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const isLiked = post.likes.some(like => like.toString() === userId);

    if (isLiked) {
      // Unlike the post
      await postsCollection.updateOne(
        { _id: new ObjectId(postId) },
        { 
          $pull: { likes: userObjectId } as any,
          $inc: { likesCount: -1 }
        }
      );
      return { liked: false, likesCount: post.likesCount - 1 };
    } else {
      // Like the post
      await postsCollection.updateOne(
        { _id: new ObjectId(postId) },
        { 
          $addToSet: { likes: userObjectId } as any,
          $inc: { likesCount: 1 }
        }
      );
      return { liked: true, likesCount: post.likesCount + 1 };
    }
  }

  async sharePost(postId: string, userId: string): Promise<{ shared: boolean; sharesCount: number }> {
    if (!ObjectId.isValid(postId) || !ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid ID');
    }

    const postsCollection = this.getPostsCollection();
    const userObjectId = new ObjectId(userId);
    
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) }) as Post;
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!post.allowShares) {
      throw new ForbiddenException('Sharing is not allowed for this post');
    }

    const isShared = post.shares.some(share => share.toString() === userId);

    if (isShared) {
      // Unshare the post
      await postsCollection.updateOne(
        { _id: new ObjectId(postId) },
        { 
          $pull: { shares: userObjectId } as any,
          $inc: { sharesCount: -1 }
        }
      );
      return { shared: false, sharesCount: post.sharesCount - 1 };
    } else {
      // Share the post
      await postsCollection.updateOne(
        { _id: new ObjectId(postId) },
        { 
          $addToSet: { shares: userObjectId } as any,
          $inc: { sharesCount: 1 }
        }
      );
      return { shared: true, sharesCount: post.sharesCount + 1 };
    }
  }

  async addComment(postId: string, createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
    if (!ObjectId.isValid(postId) || !ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid ID');
    }

    const postsCollection = this.getPostsCollection();
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) }) as Post;

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!post.allowComments) {
      throw new ForbiddenException('Comments are not allowed for this post');
    }

    const author = await this.usersService.findById(userId);
    if (!author) {
      throw new NotFoundException('User not found');
    }

    const newComment: Comment = {
      _id: new ObjectId(),
      author: new ObjectId(userId),
      authorUsername: author.username,
      content: createCommentDto.content.trim(),
      likes: [],
      likesCount: 0,
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { 
        $push: { comments: newComment } as any,
        $inc: { commentsCount: 1 }
      }
    );

    return newComment;
  }

  async deleteComment(postId: string, commentId: string, userId: string): Promise<void> {
    if (!ObjectId.isValid(postId) || !ObjectId.isValid(commentId) || !ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid ID');
    }

    const postsCollection = this.getPostsCollection();
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) }) as Post;

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Find the comment to check if user is the author
    const comment = post.comments.find(c => c._id.toString() === commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if the user is the comment author
    if (comment.author.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    // Remove the comment
    await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { 
        $pull: { comments: { _id: new ObjectId(commentId) } } as any,
        $inc: { commentsCount: -1 }
      }
    );
  }

  async getComments(postId: string, page: number = 1, limit: number = 10): Promise<{ comments: Comment[]; total: number }> {
    if (!ObjectId.isValid(postId)) {
      throw new BadRequestException('Invalid post ID');
    }

    const postsCollection = this.getPostsCollection();
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) }) as Post;

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const skip = (page - 1) * limit;
    const comments = post.comments
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(skip, skip + limit);

    return {
      comments,
      total: post.commentsCount
    };
  }

  async search(
    query: string,
    page: number = 1,
    limit: number = 10,
    userId?: string
  ): Promise<{ posts: PostResponse[]; total: number; page: number; totalPages: number }> {
    const postsCollection = this.getPostsCollection();
    const skip = (page - 1) * limit;

    const searchFilter = {
      $and: [
        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } }
          ]
        },
        { privacy: 'public', isPublic: true }
      ]
    };

    const [posts, total] = await Promise.all([
      postsCollection
        .find(searchFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray() as Promise<Post[]>,
      postsCollection.countDocuments(searchFilter)
    ]);

    const formattedPosts = await Promise.all(
      posts.map(post => this.formatPostResponse(post, userId))
    );

    return {
      posts: formattedPosts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  private async formatPostResponse(post: Post, userId?: string): Promise<PostResponse> {
    const author = await this.usersService.findById(post.author.toString());
    
    return {
      _id: post._id!,
      title: post.title,
      description: post.description,
      author: {
        _id: post.author,
        username: post.authorUsername,
        profilePicture: author?.profilePicture
      },
      likes: post.likes,
      likesCount: post.likesCount,
      comments: post.comments,
      commentsCount: post.commentsCount,
      shares: post.shares,
      sharesCount: post.sharesCount,
      allowComments: post.allowComments,
      allowShares: post.allowShares,
      isPublic: post.isPublic,
      privacy: post.privacy,
      tags: post.tags,
      media: post.media,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      isLiked: userId ? post.likes.some(like => like.toString() === userId) : false,
      isShared: userId ? post.shares.some(share => share.toString() === userId) : false
    };
  }

  private canUserViewPost(post: Post, userId?: string): boolean {
    if (post.privacy === 'public' && post.isPublic) {
      return true;
    }

    if (!userId) {
      return false;
    }

    if (post.author.toString() === userId) {
      return true;
    }

    // Add logic for followers/friends based on your user relationship system
    if (post.privacy === 'followers') {
      // Check if userId follows the post author
      // This would require implementing a followers system
      return false;
    }

    if (post.privacy === 'friends') {
      // Check if userId is friends with the post author
      return false;
    }

    return false;
  }
}