import * as React from "react"

const F_SidebarDrawerIcon = ({
    style = {},
    width = "24",
    height = "24",
    className = "",
    stroke = "#8B909A",
    viewBox = "0 0 24 24"
}) => (
    <svg
        width={width}
        style={style}
        height={height}
        viewBox={viewBox}
        stroke={stroke}
        xmlns="http://www.w3.org/2000/svg"
        className={`${className || ""}`}
        xmlnsXlink="http://www.w3.org/1999/xlink"
    >
        <path
            className="f_stroke"
            stroke={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            fill="transparent"
            d="M20 6h-7M20 12h-9M20 18h-7M8 8l-4 4 4 4"
        />
    </svg>
);

export default F_SidebarDrawerIcon;



