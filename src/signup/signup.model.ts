export interface UserInfo {
    userid : string;
    pw: string;
    mygroup: string[];
    mygroup_myprofile: MyGroupProfile[];
}

export interface MyGroupProfile {
    mygroupname: string;
    mygroup_nickname: string;
    mygroup_img: string;
    mygroup_detail: string;
  }