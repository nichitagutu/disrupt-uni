function Button({
    text, onClickHandler,
}: {
    text: string;
    onClickHandler: () => void;
}) {
    return (
        <button
            className="bg-[#F0C600] px-16 py-2 font-bold"
            onClick={onClickHandler}
        >
            {text}
        </button>
    );
}

export default Button;
