import axios from "axios";
export const BASE_URL = "https://agentexperience.up.railway.app";
// export const BASE_URL =
//   "https://des-unavailable-birmingham-phone.trycloudflare.com";

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
});

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

//stacking

const API_BASE_URL = "https://swap.up.railway.app"; // Replace with your actual API base URL

export const getUser = async (address: string) => {
  try {
    const { data: user } = await axios.get(`${API_BASE_URL}/users/${address}`);
    return user;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.error("User not found.");
      return null;
    } else {
      console.error("Error retrieving user data:", error);
      throw new Error("Failed to retrieve user data.");
    }
  }
};
export const addUserIfNotExists = async (address: string) => {
  try {
    // Step 1: Check if the user already exists
    const { data: user } = await axios.get(`${API_BASE_URL}/users/${address}`);

    if (user) {
      return user; // Skip adding user since they already exist
    }
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      // Step 2: User not found, proceed to create the user
      try {
        const { data: newUser } = await axios.post(`${API_BASE_URL}/users`, {
          address,
        });
        console.log("User added  successfully:", newUser);
        return newUser;
      } catch (err) {
        console.error("Error adding user:", err);
        throw new Error("Failed to add user.");
      }
    } else {
      console.error("Error checking user existence:", error);
      throw new Error("Failed to check if user exists.");
    }
  }
};

export const handleUserTx = async ({
  amount,
  address,
  action,
  hash,
}: {
  amount: number;
  address: string;
  action: "stake" | "unstake";
  hash: string;
}) => {
  const requestData = {
    amount,
    address,
    action,
    hash,
  };

  try {
    const res = await axios.post(
      "https://stake.up.railway.app/stake",
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    return err;
  }
};
export const updateStakeBalance = async (address: string, balance: number) => {
  try {
    const { data: updatedUser } = await axios.put(
      `${API_BASE_URL}/users/${address}/stake`,
      { balance }
    );
    console.log("Stake balance updated successfully:", updatedUser);
    return updatedUser;
  } catch (error: any) {
    console.error("Error updating stake balance:", error);
    throw new Error("Failed to update stake balance.");
  }
};