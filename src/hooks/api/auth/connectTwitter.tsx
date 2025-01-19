import { axiosPrivate } from "@/axios/axios";

const connectTwitter = async (
    code: string,
    state: string,
    agentId: string
) => {

    
    const res = axiosPrivate.post("/auth/twitter", {
        code: code,
        state: state,
        agentId: agentId
    });
    return (await res).data;
};


export default connectTwitter