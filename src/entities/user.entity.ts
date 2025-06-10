import {
  Entity,
  PrimaryKey,
  Property,
  Collection,
  OneToMany,
  BeforeCreate,
  wrap,
} from '@mikro-orm/core';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import * as bcrypt from 'bcrypt';

export type SerializedUser = Omit<
  User,
  'password' | 'toJSON' | 'hashPassword' | 'comparePassword'
>;

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  username!: string;

  @Property({ unique: true })
  email!: string;

  @Property({ hidden: true })
  password!: string;

  @OneToMany(() => Post, (post) => post.user)
  posts = new Collection<Post>(this);

  @OneToMany(() => Comment, (comment) => comment.user)
  comments = new Collection<Comment>(this);

  @BeforeCreate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  toJSON(): SerializedUser {
    return wrap(this).toObject() as SerializedUser;
  }
}
