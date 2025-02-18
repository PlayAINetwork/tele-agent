import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider } from "@project-serum/anchor";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { HOST_CONTRACT } from "@/contracts/host.contract.abi";
import { useWallet } from "@solana/wallet-adapter-react";

// Types
interface StakerInfo {
  userAddress: string;
  stakedAmount: string;
  lastWithdrawAmount: string;
  lastWithdrawTimestamp: string;
}

interface StakersTableProps {
  data: StakerInfo[];
  isLoading: boolean;
}

// Table Component
const StakersTable = ({ data, isLoading }: StakersTableProps) => {
  console.log("deposits", data);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <Table >
      <TableHeader className="sticky top-0">
        <TableRow>
          <TableHead className="w-[300px] text-white">Wallet Address</TableHead>
          <TableHead className="text-white">Staked Amount</TableHead>
          <TableHead className="text-white">Last Withdrawal</TableHead>
          <TableHead className="text-white">Last Withdrawal Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="">
        {data.map((staker, index) => (
          <TableRow key={index}>
            <TableCell className="font-mono">
              {staker.userAddress.slice(0, 4)}...{staker.userAddress.slice(-4)}
            </TableCell>
            <TableCell>{staker.stakedAmount}</TableCell>
            <TableCell>{staker.lastWithdrawAmount}</TableCell>
            <TableCell>
              {new Date(staker.lastWithdrawTimestamp).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Main Dashboard Component
const StakersDashboard = () => {
  const [stakers, setStakers] = useState<StakerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalStaked, setTotalStaked] = useState("0");
  const wallet: any = useWallet();
  useEffect(() => {
    const fetchStakers = async () => {
      try {
        setIsLoading(true);

        // Initialize connection and program
        const connection = new Connection(
          "https://aged-clean-dream.solana-mainnet.quiknode.pro/51a78aa7597a179d9adb3aa72df855eff57fc23a"
        );
        const programId = new PublicKey(HOST_CONTRACT.PROGRAM_ID);

        // Get provider
        const provider = new AnchorProvider(
          connection,
          wallet,
          AnchorProvider.defaultOptions()
        );

        // Initialize program
        const program = new Program(HOST_CONTRACT.IDL, programId, provider);

        // Fetch all DepositInfo accounts
        const deposits = await program.account.depositInfo.all();
        // Process the results
        const stakersInfo = deposits.map((deposit) => ({
          //@ts-ignore
          userAddress: deposit.account.user.toString(),
          //@ts-ignore
          stakedAmount: deposit.account.amount.toString(),
          //@ts-ignore
          lastWithdrawAmount: deposit.account.lastWithdrawAmount.toString(),
          lastWithdrawTimestamp: new Date(
            //@ts-ignore
            deposit.account.lastWithdrawTimestamp * 1000
          ).toISOString(),
        }));

        // Calculate total staked
        const total = deposits.reduce(
          //@ts-ignore
          (acc, curr) => acc + BigInt(curr.account.amount.toString()),
          BigInt(0)
        );

        setTotalStaked(total.toString());
        setStakers(stakersInfo);
      } catch (err) {
        console.error("Error fetching stakers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStakers();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-4  h-full ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3>Total Value Locked</h3>
          <p className="text-2xl font-bold">{totalStaked} tokens</p>
        </div>

        <div>
          <h3>Total Stakers</h3>

          <p className="text-2xl font-bold">{stakers.length}</p>
        </div>
      </div>
      <div className="h-[100%] overflow-y-scroll">

      <StakersTable data={stakers} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default StakersDashboard;