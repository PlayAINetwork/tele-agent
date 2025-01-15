import { axiosPrivate } from "@/axios/axios";

const getWalletSignMessage = async () => {
  const res = axiosPrivate.get("/auth/message");
  return (await res).data;
};

export default getWalletSignMessage;
