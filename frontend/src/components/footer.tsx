import React from "react";

const FooterSection = () => {
  return (
    <div className="w-full">
      <div
        className="
        w-full
        relative
        before:content-[''] 
        before:block
        before:bg-gradient-to-t 
        before:from-[#000000]
        before:opacity-50
        before:absolute
        before:bottom-0
        before:left-0
        before:z-50
        before:w-[100%]
        before:h-[50%]
        "
      >
        <img
          src="/icons/rect-logo.png"
          className="  
        "
          alt=""
        />
      </div>
    </div>
  );
};

export default FooterSection;
