import { axiosPrivate } from '@/axios/axios';
import { Agents } from '@/types';
import { useQuery } from '@tanstack/react-query';


const getAgents = async (page: number, time: any) => {
    const res = await axiosPrivate.get("/agent?time=" + time + "&page=" + page + "&limit=" + 10);
    return res.data;
};


const useGetAgents = ({ page, time }: { page?: number, time?: string }) => {

    console.log(page, time)
    const {
        data: res,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["agents", page,time],
        queryFn: () => getAgents(page ?? 1, time ?? 'week'), // Pass `id` to `queryFn`
        // Optional: configure staleTime, refetchInterval, etc.
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 300000, //5 min
    });
    return {
        agents: res as Agents,
        loadingAgent: isLoading,
        isError,
    };
}

export default useGetAgents
