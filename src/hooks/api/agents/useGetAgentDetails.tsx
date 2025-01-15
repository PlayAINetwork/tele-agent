import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../useAxiosPrivate";

const useGetAgentDetails = (id: string, sort?:string) => {
  const axiosPrivate = useAxiosPrivate();
  const getAgentDetails = async (id: string,sort?:string) => {
    const res = await axiosPrivate.get(`/agent/${id}?sort=${sort}`);
    return res.data;
  };
  const {
    data: res,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["agent_details", id],
    queryFn: () => getAgentDetails(id, sort), // Pass `id` to `queryFn`
    
    enabled: !!id, // Ensures the query only runs if `id` is available
  });
  return {
    agent: res as any,
    loadingAgent: isLoading,
    isError,
  };
};

export default useGetAgentDetails;
