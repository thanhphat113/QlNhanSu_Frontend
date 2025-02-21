import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import DropdownEffect from "../../Animation/DropdownEffect";

function DropdownButton({ label, data }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative w-full h-full">
            <div
                className="w-full h-full mb-3 flex items-center justify-center bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] p-2 cursor-pointer"
                onClick={() => setOpen(!open)} // Toggle dropdown khi click
            >
                <div className="flex justify-between px-10 items-center w-full">
                    <p>{label}</p>
                    <i className="fa-solid fa-caret-down"></i>
                </div>
            </div>
            <AnimatePresence>
                {open && (
                    <DropdownEffect>
                        <div className=" w-full flex flex-col gap-5  overflow-hidden">
                            {data &&
                                data.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={item.action}
                                        className="w-full py-2 px-4 hover:bg-gray-300 text-left"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                        </div>
                    </DropdownEffect>
                )}
            </AnimatePresence>
        </div>
    );
}

export default DropdownButton;
