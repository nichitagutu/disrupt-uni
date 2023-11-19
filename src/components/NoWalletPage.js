import LoginPage from "./LoginPage";
import Text from "./Text";

import ConnectButton from "./ConnectButton";

const NoWalletPage = () => {
  return (
    <LoginPage>
      <Text
        header={"Connect your wallet"}
        text={
          "Voting requires you to connect your wallet to be able to interact with the smart contracts."
        }
      />
      <ConnectButton />
    </LoginPage>
  );
};

export default NoWalletPage;
