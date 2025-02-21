import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { title: "Dashboard", link: "#" },
  { 
    title: "Settings", 
    subMenu: [
      { title: "Profile", link: "#" },
      { 
        title: "Security", 
        subMenu: [
          { title: "Change Password", link: "#" },
          { title: "Two-Factor Auth", link: "#" }
        ] 
      }
    ] 
  },
  { title: "Logout", link: "#" }
];

function MultiDropdown() {
  return (
    <div className="relative inline-block">
      <DropdownMenu items={menuItems} />
    </div>
  );
}

function DropdownMenu({ items }) {
  return (
    <ul className="bg-white shadow-lg rounded-lg w-48 p-2">
      {items.map((item, index) => (
        <DropdownItem key={index} item={item} />
      ))}
    </ul>
  );
}

function DropdownItem({ item }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className="relative">
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {item.title}
        {item.subMenu && (
          <span className="text-gray-500">{isOpen ? "▲" : "▼"}</span>
        )}
      </button>

      {item.subMenu && (
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute left-full top-0 bg-white shadow-lg rounded-lg w-48 p-2"
            >
              {item.subMenu.map((subItem, index) => (
                <DropdownItem key={index} item={subItem} />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </li>
  );
}

export default MultiDropdown;
