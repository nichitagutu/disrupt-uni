import LoginButton from "./LoginButton";
import LoginPage from "./LoginPage";
import Text from "./Text";

const WorldIdLoginPage = ({ setIsAuthenticated, setCurrentStage }) => {
  return (
    <LoginPage>
      <Text
        header={"Confirm your WorldID"}
        text={
          "This will open a WorldID app and prompt you to confirm your identity."
        }
      />
      <LoginButton setIsAuthenticated={setIsAuthenticated} setCurrentStage={setCurrentStage} />
    </LoginPage>
  );
};

export default WorldIdLoginPage;
