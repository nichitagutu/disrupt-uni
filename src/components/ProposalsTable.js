import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ReactComponent as NounsGlasses } from "./nouns_glasses.svg";
import { usePrepareContractWrite, useContractWrite, useContractRead, useAccount, useWalletClient } from 'wagmi'
import ConnectButton from "./ConnectButton";
import ABI from '../contracts/ABI.json';
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import {
  EAS,
  Offchain,
  SchemaRegistry,
} from "@ethereum-attestation-service/eas-sdk";
import { providers } from "ethers";

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
const EASSchemaUID =
  "0x8d27497483b403775138b1d1830ad3914f7654db9ec22badd1944abcdbbb6911";

const data = [
  {
    name: "Fund a new methodology initiative",
    date: "Oct 11, 2023",
    status: "Voting in progress",
    for: 14,
    against: 32,
  },
  {
    name: "Purchase the meat for the buffet",
    date: "Oct 2, 2023",
    status: "Voting finished",
    for: 4,
    against: 132,
  },
  {
    name: "Purchase the equipment for PE courses",
    date: "Oct 1, 2023",
    status: "Voting planned",
    for: "-",
    against: "-",
  },
];

export function walletClientToSigner(walletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);

  return signer;
}


export function useSigner() {
  const { data: walletClient } = useWalletClient();

  const [signer, setSigner] = useState(undefined);
  useEffect(() => {
    async function getSigner() {
      if (!walletClient) return;

      const tmpSigner = walletClientToSigner(walletClient);

      setSigner(tmpSigner);
    }

    getSigner();

  }, [walletClient]);
  return signer;
}

const contractAddress = "0xD3Fdec79074942F36929A80E816dB379d0Af99ab";

const ProposalsTable = () => {
  const { address, isConnecting, isDisconnected } = useAccount()
  const { config: configVoteFor, error: errorVoteFor } = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: 'vote',
    args: [0, true]
    args: [0, true]
  })
  const { write: voteFor } = useContractWrite(configVoteFor)

  const { config: configVoteAgainst, error: errorVoteAgainst } = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: 'vote',
    args: [0, false]
  })
  const { write: voteAgainst } = useContractWrite(configVoteAgainst)

  const { data: contractData, isError, isLoading } = useContractRead({
    address: contractAddress,
    abi: ABI,
    functionName: 'getProposalResult',
    args: [0]
  })

  data[0].for = contractData[1].toString()
  data[0].against = contractData[2].toString()
  console.log(contractData)

  // Initialize the sdk with the address of the EAS Schema contract address
  const eas = new EAS(EASContractAddress);

  // Gets a default provider (in production use something else like infura/alchemy)
  const provider = ethers.providers.getDefaultProvider("sepolia");

  // Connects an ethers style provider/signingProvider to perform read/write functions.
  // MUST be a signer to do write operations!
  const signer = useSigner();

  eas.connect(signer);

  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder("string university, string description, bool hasVoted");


  const schemaUID = "0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995";

  async function attest() {
    const encodedData = schemaEncoder.encodeData([
      { name: "university", value: "My Uni", type: "string" },
      { name: "description", value: "my description", type: "string" },
      { name: "hasVoted", value: true, type: "bool" },
    ]);

    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: address,
        expirationTime: 0,
        revocable: false, // Be aware that if your schema is not revocable, this MUST be false
        data: encodedData,
      },
    });

    const newAttestationUID = await tx.wait();

    console.log("New attestation UID:", newAttestationUID);
  }

  return (
    <div className="overflow-x-auto m-12 rounded-xl shadow-lg">
      <ConnectButton />
      {!isLoading && !isError && contractData}
      <table className="min-w-full bg-white">
        <thead className=" text-black ">
          <tr>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
              Name
            </th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
              Date
            </th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
              Status
            </th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
              For
            </th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
              Against
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {data.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4">{item.name}</td>
              <td className="py-2 px-4">{item.date}</td>
              <td className="py-2 px-4">{item.status}</td>
              <td className="py-2 px-4">
                {item.for !== "-" ? (
                  <>
                    {item.for}{" "}
                    <button
                      onClick={() => {
                        voteFor();
                        attest();
                        toast.success("You voted for this proposal");
                      }}
                      className="text-pink-500 ml-2 bg-pink-100 px-2 py-1 rounded-lg hover:bg-pink-200"
                    >
                      💖
                    </button>
                  </>
                ) : (
                  <span>-</span>
                )}
              </td>
              <td className="py-2 px-4">
                {item.against !== "-" ? (
                  <>
                    {item.against}{" "}
                    <button
                      onClick={() => {
                        voteAgainst();
                        attest();
                        toast.success("You voted for this proposal");
                      }}
                      className="text-pink-500 ml-2 bg-pink-100 px-2 py-1 rounded-lg hover:bg-pink-200"
                    >
                      💔
                    </button>
                  </>
                ) : (
                  <span>-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProposalsTable;
