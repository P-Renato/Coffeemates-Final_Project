export type PostType = {
    title: string,
    content: string,
    location: string,
    star: number,
    uid: number,
    commentIds: number[],
    likeIds: number[],
    imageUrl: string,
    pid: number,
}