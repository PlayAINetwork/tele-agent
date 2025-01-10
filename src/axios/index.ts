import axios from "axios";

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
