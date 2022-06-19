export default interface Comment {
    type: 'comment';
    user: string;
    timestamp: number;
    text: string;
}