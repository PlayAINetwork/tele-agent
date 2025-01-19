import { axiosPrivate } from "@/axios/axios";

const getTwitterAuthUrl = async () => {
    const res = await axiosPrivate.get("/auth/twitter");
    const data = await res?.data


    return data;
};

export default getTwitterAuthUrl;
