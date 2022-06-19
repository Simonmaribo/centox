import Comment from "./comment";
import Form from "./form";
import StatusUpdate from "./statusUpdate";

export default interface Application {
    _id: string;
    form: Form['_id'];
    user: string;
    createdAt: number;
    latestInteraction?: number;
    interactions: (Comment | StatusUpdate)[] ;
    status: "pending" | "accepted" | "rejected";
    answers: {
        [key: string]: string;
    }
}