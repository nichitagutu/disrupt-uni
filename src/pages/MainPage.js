import React from "react";
import Header from "../components/Header";
import RoundInfo from "../components/RoundInfo";
import ProposalsTable from "../components/ProposalsTable";

const MainPage = () => {
  return (
    <div className="h-screen bg-[#F5F5F5]">
      <div className="bg-[#ffffff] flex flex-col gap-[30px] px-[50px] pt-[25px] pb-[25px]">
        <Header />
        <RoundInfo />
      </div>
      <ProposalsTable />
    </div>
  );
};

export default MainPage;
