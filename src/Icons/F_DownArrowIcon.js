import * as React from "react"

const F_DownArrowIcon = ({
    style = {},
    width = "12",
    height = "8",
    className = "",
    fill = "#5E6782",
    viewBox = "0 0 12 8"
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
            d="M11 1.17a1 1 0 0 0-1.41 0L6 4.71 2.46 1.17a1 1 0 1 0-1.41 1.42l4.24 4.24a1 1 0 0 0 1.42 0L11 2.59a1.001 1.001 0 0 0 0-1.42Z"
            fill={fill}
        />
    </svg>
);

export default F_DownArrowIcon;



