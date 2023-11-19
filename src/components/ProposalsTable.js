import React from "react";
import { toast } from "react-toastify";
import { ReactComponent as NounsGlasses } from "./nouns_glasses.svg";
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import ABI from '../contracts/ABI.json';

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

const contractAddress = "0xD3Fdec79074942F36929A80E816dB379d0Af99ab";

const ProposalsTable = () => {
  const { config: configVoteFor, error: errorVoteFor } = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: 'vote',
  })
  const { write: voteFor } = useContractWrite(configVoteFor)

  const { config: configVoteAgainst, error: errorVoteAgainst } = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: 'feed',
  })
  const { write: voteAgainst } = useContractWrite(config)


  return (
    <div className="overflow-x-auto m-12 rounded-xl shadow-lg">
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
