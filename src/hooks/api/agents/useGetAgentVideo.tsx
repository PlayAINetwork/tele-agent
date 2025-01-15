import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../useAxiosPrivate";

const useGetAgentVideo = (id: string) => {
  const axiosPrivate = useAxiosPrivate();
  const getAgentVedio = async (id: string) => {
    const res = await axiosPrivate.get(`/agent/video/${id}`);
    console.log(res)
    return res.data;
  };
  const {
    data: res,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["agent_vedio", id],
    queryFn: () => getAgentVedio(id), // Pass `id` to `queryFn`
    enabled: !!id, // Ensures the query only runs if `id` is available
  });
  return {
    agentVideo: res as any,
    loadingAgentVideo: isLoading,
    isError,
  };
};

export default useGetAgentVideo;
