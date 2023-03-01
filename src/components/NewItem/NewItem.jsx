import React from "react";
import { PlusIcon } from "@heroicons/react/20/solid";

const NewItem = ({ openModal, closeModal }) => {
  return (
    <div
      onClick={openModal}
      className="min-h-[208px] group border border-gray-600 border-dashed flex items-center justify-center flex-grow cursor-pointer"
    >
      <PlusIcon className="group-hover:scale-100 scale-75 w-16 h-16 text-[#2a7fb5] duration-300" />
    </div>
  );
};

export default NewItem;
