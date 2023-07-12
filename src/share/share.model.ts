export interface ShareInfo {
    _id?:string;
    post_group: string;
    post_title: string;
    post_detail: string;
    post_img: string;
    post_writer: string;
    like_count: number;
    like_users: string[];
    comments: {
      _id: string;
      comment_detail: string;
      comment_writer: string;
    }[];
  }
  