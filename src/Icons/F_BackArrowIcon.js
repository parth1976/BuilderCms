import * as React from "react"

const F_BackArrowIcon = ({
    style = {},
    width = "16",
    height = "17",
    className = "",
    fill = "#5E6782",
    viewBox = "0 0 16 17"
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
            d="M14.667 7.533H4.533l4.4-4.4a1.289 1.289 0 0 0 0-1.866 1.289 1.289 0 0 0-1.866 0L.4 7.933A1.289 1.289 0 0 0 .4 9.8l6.667 6.667a1.289 1.289 0 0 0 1.866 0 1.289 1.289 0 0 0 0-1.867l-4.4-4.4h10.134c.8 0 1.333-.533 1.333-1.333 0-.667-.533-1.334-1.333-1.334Z"
            fill={fill}
        />
    </svg>
);

export default F_BackArrowIcon;



