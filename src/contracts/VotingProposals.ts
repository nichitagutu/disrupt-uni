import { RuntimeModule, runtimeMethod, runtimeModule, state } from "@proto-kit/module";
import { StateMap, assert } from "@proto-kit/protocol";
import { PublicKey, UInt64, Field, Struct } from "o1js";
import { inject } from "tsyringe";
import { Balances } from "./balances";

// Struct
class ProposalVotes extends Struct({
    yesVotesCount: UInt64, // Count of 'yes' votes
    noVotesCount: UInt64  // Count of 'no' votes
}) implements ProposalVotes  {}

class ProposalDetails extends Struct({
    proposalIdentifier: Field,       // Unique identifier for the proposal
    voteCounts: ProposalVotes,       // Vote counts for the proposal
    recipientAddress: PublicKey,     // Recipient address for the proposal's outcome
    transferAmount: UInt64           // Number of transfer amount
}) implements ProposalDetails  {}


@runtimeModule()
class VotingProposals extends RuntimeModule<unknown> {
  // StateMap to track each registered proposal
  @state() public registeredProposals = StateMap.from<Field, ProposalDetails>(Field, ProposalDetails);

  // Treasury's public key for managing funds
  private treasuryPublicKey: PublicKey = new PublicKey("B62qiWXqwegEY99vzyaSzhE76U8gcvEXTuavoKFDJtTQm4FcTxwBbjn");

  // Injecting the Balances module to manage token balances
  constructor(@inject("Balances") public tokenBalances: Balances) {
    super();
  }

  // Method to cast a 'yes' vote for a specific proposal
  @runtimeMethod()
  public castVoteForProposal(proposalIdentifier: Field) {
    const proposalDetails = this.registeredProposals.get(proposalIdentifier).value;
    const updatedYesVotes = proposalDetails.voteCounts.yesVotesCount.add(UInt64.from(1));
    this.registeredProposals.set(proposalIdentifier, { 
      ...proposalDetails, 
      voteCounts: { ...proposalDetails.voteCounts, yesVotesCount: updatedYesVotes } 
    });
  }

  // Method to cast a 'no' vote for a specific proposal
  @runtimeMethod()
  public castNoVoteForProposal(proposalIdentifier: Field) {
    const proposalDetails = this.registeredProposals.get(proposalIdentifier).value;
    const updatedNoVotes = proposalDetails.voteCounts.noVotesCount.add(UInt64.from(1));
    this.registeredProposals.set(proposalIdentifier, { 
      ...proposalDetails, 
      voteCounts: { ...proposalDetails.voteCounts, noVotesCount: updatedNoVotes } 
    });
  }

  // Method to execute a proposal if the 'yes' votes exceed the 'no' votes
  @runtimeMethod()
  public executeProposal(proposalIdentifier: Field) {
    const proposalDetails = this.registeredProposals.get(proposalIdentifier).value;
    assert(proposalDetails.voteCounts.yesVotesCount.greaterThan(proposalDetails.voteCounts.noVotesCount), "Proposal did not pass");

    // Transferring funds from the treasury to the recipient address if the proposal passes
    this.tokenBalances.transfer(this.treasuryPublicKey, proposalDetails.recipientAddress, proposalDetails.transferAmount);
  }
}
