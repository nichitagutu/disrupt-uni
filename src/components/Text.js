import { ReactComponent as NounsGlasses } from "./nouns_glasses.svg";

const Text = ({ header, text, hasIcon }) => {
  return (
    <div className="container flex flex-col w-3/4 gap-4 justify-center items-center text-sm text-center">
      <div className="flex flex-row gap-2 justify-center items-center text-lg">
        <div className="">{hasIcon && <NounsGlasses />}</div>
        <h5 className="font-header text-2xl">{header}</h5>
      </div>
      <p className="max-w-[44rem]">{text}</p>
    </div>
  );
};

export default Text;
