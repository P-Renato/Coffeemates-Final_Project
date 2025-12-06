export type PostType = {
    _id: string,
    title: string,
    content: string,
    location: string,
    star: number,
    uid: string,
    shopName: string,
    commentIds: number[],
    likeIds: number[],
    imageUrl: string,
    pid: string,
    createdAt: string,
    user: {
        _id: string,
        username: string,
        photoURL: string,
    }
}

export type CommentType = {
    _id: string,
    content: string,
    uid: string,
    pid: string,
    parentCommentId: string,
    createdAt: string,
    user: {
        _id: string,
        username: string,
    }
}

export type ChatType = {
    _id: string,
    content: string,
    senderId: string,
    receiverId: string,
    senderUsername: string,
    createdAt: string,
}

export interface UserType {
    _id: string;
    email: string;
    username: string;
    photoURL: string;
    // Add other user properties as needed
}

export interface Location {
    id: string;
    name: string;
    lat: number;
    lng: number;
}

export type AppContextType = {
    postPopup: boolean;
    setPostPopup: React.Dispatch<React.SetStateAction<boolean>>;
    locationList: Location[];
    setLocationList: React.Dispatch<React.SetStateAction<Location[]>>;
    posts: PostType[];
    setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
    loading: boolean;
    error: string | null;
    editingPost: any | null;
    setEditingPost: React.Dispatch<React.SetStateAction<any | null>>;
};