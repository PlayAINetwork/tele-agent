import { axiosPrivate } from "@/axios/axios";

const connectWallet = async (
  wallet: string,
  nonce: string,
  signature: string
) => {
  const res = axiosPrivate.post("/auth/login", {
    wallet: wallet,
    nonce: nonce,
    signature: signature
  });
  return (await res).data;
};

export default connectWallet;
