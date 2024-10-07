import * as React from "react"

const F_FilterIcon = ({
    style = {},
    width = "14",
    height = "15",
    className = "",
    fill = "#5E6782",
    viewBox = "0 0 14 15"
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
            d="M11.667.833H2.333a2 2 0 0 0-2 2v.78a2 2 0 0 0 .167.8v.04c.094.214.228.409.393.574L5 9.107V13.5a.666.666 0 0 0 .667.667.666.666 0 0 0 .3-.074l2.666-1.333A.666.666 0 0 0 9 12.167v-3.06l4.08-4.08c.166-.165.3-.36.393-.574v-.04a2 2 0 0 0 .194-.8v-.78a2 2 0 0 0-2-2ZM7.86 8.36a.667.667 0 0 0-.193.473v2.92l-1.334.667V8.833a.667.667 0 0 0-.193-.473L2.607 4.833h8.786L7.86 8.36Zm4.473-4.86H1.667v-.667a.667.667 0 0 1 .666-.666h9.334a.667.667 0 0 1 .666.666V3.5Z"
        />
    </svg>
);

export default F_FilterIcon;



