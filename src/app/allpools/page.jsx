'use client'

import React, { useState, useEffect } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { Program, AnchorProvider } from '@project-serum/anchor'
import { Loader2 } from 'lucide-react'
import idl from '../../../idl.json'

const PoolsList = () => {
  const { connection } = useConnection()
  const { publicKey, signTransaction, signAllTransactions } = useWallet()
  const [pools, setPools] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPools = async () => {
      if (!publicKey) {
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const provider = new AnchorProvider(
          connection,
          { publicKey, signTransaction, signAllTransactions },
          AnchorProvider.defaultOptions()
        )
        const programId = new PublicKey('A1A2JLvFmJJZ4C2BUUTvhtrWt4VwqYkdD77ZRyvsh5K8')
        const program = new Program(idl, programId, provider)

        const fetchedPools = await program.account.pool.all()
        setPools(fetchedPools)
        console.log("here are the fecthed pools: ", fetchedPools)
      } catch (error) {
        console.error('Error fetching pools:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPools()
  }, [connection, publicKey, signTransaction, signAllTransactions])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (pools.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 mt-24">
        No pools available at the moment.
      </div>
    )
  }

  return (
    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg mt-24">
      <ul className="divide-y divide-gray-700">
        {pools.map((pool) => (
          <li key={pool.publicKey.toString()}>
            <div className="block hover:bg-gray-700 transition duration-150 ease-in-out">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-purple-400 truncate">
                    Pool ID: {pool.account.poolId.toString().slice(0, 8)}...
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {pool.account.currentCycle} / {pool.account.memberCount}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-300">
                      Members: {pool.account.members.length}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-300 sm:mt-0 sm:ml-6">
                      Monthly Contribution: {pool.account.monthlyContribution.toString()} SOL
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-300 sm:mt-0">
                    <p>
                      Total Amount: {pool.account.totalAmount.toString()} SOL
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PoolsList