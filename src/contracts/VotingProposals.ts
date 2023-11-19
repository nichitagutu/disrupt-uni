import {
  RuntimeModule,
  runtimeMethod,
  runtimeModule,
  state,
} from "@proto-kit/module";
import { StateMap, assert } from "@proto-kit/protocol";
import { PublicKey, UInt64, Field, Struct } from "o1js";
import { inject } from "tsyringe";
import { Balances } from "./balances";

class ProposalVotes
  extends Struct({
    yesVotesCount: UInt64,
    noVotesCount: UInt64,
  })
  implements ProposalVotes {}

class ProposalDetails
  extends Struct({
    proposalIdentifier: Field,
    voteCounts: ProposalVotes,
    recipientAddress: PublicKey,
    transferAmount: UInt64,
  })
  implements ProposalDetails {}

@runtimeModule()
export class VotingProposals extends RuntimeModule<unknown> {
  @state() public registeredProposals = StateMap.from<Field, ProposalDetails>(
    Field,
    ProposalDetails
  );

  private treasuryPublicKey: PublicKey = new PublicKey(
    "B62qiWXqwegEY99vzyaSzhE76U8gcvEXTuavoKFDJtTQm4FcTxwBbjn"
  );

  constructor(@inject("Balances") public tokenBalances: Balances) {
    super();
  }

  @runtimeMethod()
  public castVoteForProposal(proposalIdentifier: Field) {
    const proposalDetails =
      this.registeredProposals.get(proposalIdentifier).value;
    const updatedYesVotes = proposalDetails.voteCounts.yesVotesCount.add(
      UInt64.from(1)
    );
    this.registeredProposals.set(proposalIdentifier, {
      ...proposalDetails,
      voteCounts: {
        ...proposalDetails.voteCounts,
        yesVotesCount: updatedYesVotes,
      },
    });
  }

  @runtimeMethod()
  public castNoVoteForProposal(proposalIdentifier: Field) {
    const proposalDetails =
      this.registeredProposals.get(proposalIdentifier).value;
    const updatedNoVotes = proposalDetails.voteCounts.noVotesCount.add(
      UInt64.from(1)
    );
    this.registeredProposals.set(proposalIdentifier, {
      ...proposalDetails,
      voteCounts: {
        ...proposalDetails.voteCounts,
        noVotesCount: updatedNoVotes,
      },
    });
  }

  @runtimeMethod()
  public executeProposal(proposalIdentifier: Field) {
    const proposalDetails =
      this.registeredProposals.get(proposalIdentifier).value;
    assert(
      proposalDetails.voteCounts.yesVotesCount.greaterThan(
        proposalDetails.voteCounts.noVotesCount
      ),
      "Proposal did not pass"
    );

    this.tokenBalances.transfer(
      this.treasuryPublicKey,
      proposalDetails.recipientAddress,
      proposalDetails.transferAmount
    );
  }
}
