import React, { useState } from "react";

import { FaWindowClose } from "react-icons/fa";
import useRegisteredCollections from "../../hooks/useRegisteredCollections";

export default () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex">
      <div
        className="btn btn-primary btn-large mx-auto"
        onClick={() => setIsOpen(true)}
      >
        Create a registered collection
      </div>
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <div className="flex flex-row justify-between">
            <div className="text-xl font-bold my-auto">Creator</div>
            <div className="btn btn-ghost" onClick={() => setIsOpen(false)}>
              <FaWindowClose className="w-8 h-8" />
            </div>
          </div>
          <div className="form flex flex-col gap-2">
            <div className="">
              <div>Original mint</div>
              <input className="input input-bordered w-full" />
            </div>
            <div className="">
              <div>Royalties earner</div>
              <input className="input input-bordered w-full" />
            </div>
            <div className="">
              <div>Royalties earner</div>
              <input className="input input-bordered w-full" />
            </div>
            <div className="btn btn-disabled w-full">Not implemented yet</div>
          </div>
        </div>
      </div>
    </div>
  );
};
