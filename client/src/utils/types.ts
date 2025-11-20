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
}

export type CommentType = {
    _id: string,
    content: string,
    uid: string,
    pid: string,
    parentCommentId: string,
}