export default interface StatusUpdate {
    type: "statusUpdate";
    user: string;
    timestamp: number;
    status: string;
}