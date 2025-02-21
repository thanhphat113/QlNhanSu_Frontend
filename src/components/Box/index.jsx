import { Link } from "react-router-dom";

function Box({ content, number, attribute }) {
    return (
        <div
            className={`w-full h-[15rem] border border-black shadow-[0_0_10px_rgba(0,0,0,0.3)] hover:scale-105 cursor-pointer rounded-[10px] py-5 px-15 ${attribute}`}
        >
            <div className="flex justify-between">
                <h1 className="text-5xl">{content}:</h1>
                <p className="text-9xl font-bold ">{number}</p>
            </div>
        </div>
    );
}

export default Box;
