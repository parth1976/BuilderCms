import * as React from "react"

const F_DeleteIcon = ({
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
        <path
            fill={fill} className="f_fill"
            d="M6.333 13.5a.833.833 0 0 0 .834-.833v-5a.833.833 0 1 0-1.667 0v5a.833.833 0 0 0 .833.833Zm8.334-10h-3.334v-.833a2.5 2.5 0 0 0-2.5-2.5H7.167a2.5 2.5 0 0 0-2.5 2.5V3.5H1.333a.833.833 0 0 0 0 1.667h.834v9.166a2.5 2.5 0 0 0 2.5 2.5h6.666a2.5 2.5 0 0 0 2.5-2.5V5.167h.834a.833.833 0 0 0 0-1.667Zm-8.334-.833a.833.833 0 0 1 .834-.834h1.666a.833.833 0 0 1 .834.834V3.5H6.333v-.833Zm5.834 11.666a.833.833 0 0 1-.834.834H4.667a.833.833 0 0 1-.834-.834V5.167h8.334v9.166Zm-2.5-.833a.833.833 0 0 0 .833-.833v-5a.833.833 0 1 0-1.667 0v5a.833.833 0 0 0 .834.833Z"
        />
    </svg>
);

export default F_DeleteIcon;



