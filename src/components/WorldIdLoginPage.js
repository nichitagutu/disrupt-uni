import LoginButton from "./LoginButton";
import LoginPage from "./LoginPage";
import Text from "./Text";

const WorldIdLoginPage = ({ setIsAuthenticated }) => {
  return (
    <LoginPage>
      <Text
        header={"Confirm your WorldID"}
        text={
          "This will open a WorldID app and prompt you to confirm your identity."
        }
      />
      <LoginButton setIsAuthenticated={setIsAuthenticated} />
    </LoginPage>
  );
};

export default WorldIdLoginPage;
