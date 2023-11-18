import LoginButton from "./LoginButton";
import LoginPage from "./LoginPage";
import Text from "./Text";

const WorldIdLoginPage = () => {
  return (
    <LoginPage>
      <Text
        header={"Confirm your WorldID"}
        text={
          "This will open a WorldID app and prompt you to confirm your identity."
        }
      />
      <LoginButton />
    </LoginPage>
  );
};

export default WorldIdLoginPage;
