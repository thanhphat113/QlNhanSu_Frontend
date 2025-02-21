import { motion } from "framer-motion";

function DropdownEffect({ children }) {
    return (
        <motion.div
            initial={{ scaleY: 0, translateY: -10 }}
            animate={{ scaleY: 1, translateY: 0 }}
            exit={{ scaleY: 0, translateY: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="p-5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] origin-top overflow-hidden rounded-2xl"
        >
            {children}
        </motion.div>
    );
}

export default DropdownEffect;
