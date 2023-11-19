// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {

    struct Proposal {
        uint256 id;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
    }

    uint256 public nextProposalId;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted; // Добавлено для отслеживания голосов

    function createProposal(string memory description) public {
        proposals[nextProposalId] = Proposal(nextProposalId, description, 0, 0, false);
        nextProposalId++;
    }

    function vote(uint256 proposalId, bool voteYes) public {
        Proposal storage proposal = proposals[proposalId];

        require(!proposal.executed, "Proposal already executed");
        require(!hasVoted[proposalId][msg.sender], "Already voted on this proposal"); // Проверка, голосовал ли адрес

        if (voteYes) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }

        hasVoted[proposalId][msg.sender] = true; // Отметка, что адрес проголосовал
    }

    function getProposalResult(uint256 proposalId) public view returns (string memory description, uint256 yesVotes, uint256 noVotes, bool executed) {
        Proposal storage proposal = proposals[proposalId];
        return (proposal.description, proposal.yesVotes, proposal.noVotes, proposal.executed);
    }

    function executeProposal(uint256 proposalId) public {
        Proposal storage proposal = proposals[proposalId];

        require(!proposal.executed, "Proposal already executed");
        require(proposal.yesVotes > proposal.noVotes, "Not enough votes to execute proposal");

        // Какие-либо действия, связанные с исполнением предложения
        // Например, перевод токенов или изменение состояния контракта

        proposal.executed = true;
    }
}
