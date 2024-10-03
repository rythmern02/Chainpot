"use client";

import React, { useState, useEffect } from "react";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { Program, AnchorProvider, BN, web3 } from "@project-serum/anchor";
import idl from "../../../idl.json";

const CreatePool = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  
  const [memberCount, setMemberCount] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    setIsWalletConnected(!!wallet?.publicKey);
  }, [wallet?.publicKey]);

  const handleCreatePool = async (e) => {
    e.preventDefault();
    if (!isWalletConnected) {
      setMessage({
        type: "error",
        content: "Please connect your wallet first.",
      });
      return;
    }

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", content: "" });

    try {
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
      });
      const programId = new PublicKey(
        "A1A2JLvFmJJZ4C2BUUTvhtrWt4VwqYkdD77ZRyvsh5K8"
      );
      const program = new Program(idl, programId, provider);
  
      const poolId = new BN(Date.now());
      const [poolPda, bump] = await PublicKey.findProgramAddressSync(
        [
          Buffer.from("Pool"),
          wallet.publicKey.toBuffer(),
          poolId.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );
  
      console.log("The pool public key is: ", poolPda.toBase58());
  
      const tx = await program.methods
        .initializePool(
          poolId,
          new BN(memberCount),
          new BN(parseFloat(monthlyContribution) * web3.LAMPORTS_PER_SOL)
        )
        .accounts({
          pool: poolPda,
          admin: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
  
      console.log("Pool created successfully. Transaction signature:", tx);
      setMessage({
        type: "success",
        content: `Pool created! Transaction signature: ${tx}`,
      });
    } catch (error) {
      console.error("Error creating pool:", error);
      setMessage({
        type: "error",
        content: `Failed to create pool: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    if (isNaN(memberCount) || parseInt(memberCount) < 2) {
      setMessage({
        type: "error",
        content: "Member count must be at least 2.",
      });
      return false;
    }
    if (isNaN(monthlyContribution) || parseFloat(monthlyContribution) <= 0) {
      setMessage({
        type: "error",
        content: "Monthly contribution must be greater than 0.",
      });
      return false;
    }
    return true;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-24">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Create a New Pool
        </h2>
        <form onSubmit={handleCreatePool} className="space-y-6">
          <div>
            <label
              htmlFor="memberCount"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Number of Members
            </label>
            <input
              type="number"
              id="memberCount"
              value={memberCount}
              onChange={(e) => setMemberCount(e.target.value)}
              required
              min="2"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="monthlyContribution"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Monthly Contribution (SOL)
            </label>
            <input
              type="number"
              id="monthlyContribution"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              required
              min="0.000000001"
              step="0.000000001"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
              isLoading || !isWalletConnected
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={isLoading || !isWalletConnected}
          >
            {isLoading
              ? "Creating..."
              : isWalletConnected
              ? "Create Pool"
              : "Connect Wallet to Create Pool"}
          </button>
        </form>
        {message.content && (
          <div
            className={`mt-4 p-3 rounded ${
              message.type === "error" ? "bg-red-500" : "bg-green-500"
            } text-white`}
          >
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePool;