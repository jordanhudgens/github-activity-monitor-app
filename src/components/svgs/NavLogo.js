import React from "react";

const NavLogo = () => {
  return (
    <div className="svg-logo">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 750 750"
      >
        <image
          x="119"
          y="125"
          width="512"
          height="500"
          xlinkHref="data:img/png;base64,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"
        />
      </svg>
    </div>
  );
};

export default NavLogo;