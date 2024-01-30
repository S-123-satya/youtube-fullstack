import React from "react";

const SideBar = () => {
  return (
    <div className="w-40">
      <ul>
        <li>Home</li>
        <li>Shorts</li>
        <li className="border border-b-black border-t-0 border-r-0">Subsription</li>
        <li>You</li>
        <li>Your Channel</li>
        <li>History</li>
        <li>Your Videos</li>
        <li>Watch later</li>
        <li>Downloads</li>
      </ul>
    </div>
  );
};

export default SideBar;
