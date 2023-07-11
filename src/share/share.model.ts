export interface ShareInfo {
    post_id: number;
    post_group: string;
    post_title: string;
    post_detail: string;
    post_img: string;
    post_writer: string;
    like_count: number;
    like_users: string[];
    comments: {
      comment_id: number;
      comment_detail: string;
      comment_writer: string;
    }[];
  }
  