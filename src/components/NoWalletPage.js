import LoginPage from "./LoginPage";
import Text from "./Text";

const NoWalletPage = () => {
  return (
    <LoginPage>
      <p className="text-gray-500">You do not have Mina Wallet installed</p>
      <Text
        header={"Install Mina wallet"}
        text={
          "Voting requires you to connect your Mina wallet to be able to interact with the smart contracts."
        }
      />
      <StoreButton />
    </LoginPage>
  );
};

const StoreButton = () => {
  return (
    <button
      className="bg-[#F0C600] px-16 py-2 font-bold"
      onClick={() => {
        window.open(
          "https://chromewebstore.google.com/detail/auro-wallet/cnmamaachppnkjgnildpdmkaakejnhae",
          "_blank"
        );
      }}
    >
      Install Auro Wallet
    </button>
  );
};

export default NoWalletPage;
