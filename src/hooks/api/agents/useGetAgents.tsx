import { axiosPrivate } from '@/axios/axios';
import {  Agents } from '@/types';
import { useQuery } from '@tanstack/react-query';

const useGetAgents = () => {

    const getAgents = async () => {
        const res = await axiosPrivate.get("/agent");

        return res.data;
    };

    const {
        data: res,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["agents"],
        queryFn: () => getAgents(), // Pass `id` to `queryFn`
    });
    return {
        agents: res as Agents,
        loadingAgent: isLoading,
        isError,
    };
}

export default useGetAgents
