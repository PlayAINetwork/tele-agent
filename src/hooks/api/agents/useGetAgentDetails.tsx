import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../useAxiosPrivate";

const useGetAgentDetails = (id: string) => {
  const axiosPrivate = useAxiosPrivate();
  const getAgentDetails = async (id:string) => {
    const res = await axiosPrivate.get(`/agent/${id}?time=week`);
    return res.data;
  };
  const {
    data: res,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["agent_details", id],
    queryFn: () => getAgentDetails(id), // Pass `id` to `queryFn`
    
    enabled: !!id, // Ensures the query only runs if `id` is available
  });
  return {
    agent: res as any,
    loadingAgent: isLoading,
    isError,
  };
};

export default useGetAgentDetails;
