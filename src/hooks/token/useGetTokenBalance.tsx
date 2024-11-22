

const useGetTokenBalance = () => {

  //   const getTokenBalance = async (tokenAddress, walletAddress) => {
  //   try {
  //     setStatus('Fetching balance...');
      
  //     const tokenPublicKey = new PublicKey(tokenAddress);
  //     const walletPublicKey = new PublicKey(walletAddress);
      
  //     // Get token account
  //     const tokenAccounts = await connection.getTokenAccountsByOwner(
  //       walletPublicKey,
  //       { programId: TOKEN_PROGRAM_ID }
  //     );

  //     // Find the token account for our specific token
  //     const tokenAccount = tokenAccounts.value.find(account => {
  //       const accountData = Token.getAccountLayout().decode(account.account.data);
  //       return accountData.mint.toString() === tokenPublicKey.toString();
  //     });

  //     if (tokenAccount) {
  //       const accountData = Token.getAccountLayout().decode(tokenAccount.account.data);
  //       setTokenBalance(accountData.amount.toString());
  //       setStatus('Balance fetched successfully');
  //     } else {
  //       setStatus('No token account found');
  //     }
  //   } catch (error) {
  //     setStatus(`Error: ${error.message}`);
  //   }
  // };
  return{tokenBalance:1223}
}

export default useGetTokenBalance