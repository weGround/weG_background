export interface UserInfo {
    userid : string;
    pw: string;
    mygroup: string[];
    mygroup_myprofile: {
        mygroupname: string; // groupname
        mygroup_nickname: string;
        mygroup_img: string;
        mygroup_detail: string;
    }[];
}

