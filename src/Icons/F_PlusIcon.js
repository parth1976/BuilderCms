import * as React from "react";

const F_PlusIcon = ({
    style = {},
    width = "16",
    height = "16",
    className = "",
    fill = "#5E6782",
    viewBox = "0 0 16 16",
}) => (
    <svg
        width={width}
        style={style}
        height={height}
        viewBox={viewBox}
        fill={fill}
        xmlns="http://www.w3.org/2000/svg"
        className={`${className || ""}`}
        xmlnsXlink="http://www.w3.org/1999/xlink"
    >

        <path className="f_fill"
            d="M15 7H9V1a1 1 0 0 0-2 0v6H1a1 1 0 0 0 0 2h6v6a1 1 0 1 0 2 0V9h6a1 1 0 1 0 0-2Z"
            fill={fill}
        />
    </svg>
);

export default F_PlusIcon;
