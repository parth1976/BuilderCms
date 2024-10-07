import * as React from "react"

const F_CompanyIcon = ({
    style = {},
    width = "20",
    height = "20",
    className = "",
    stroke = "#5E6782",
    viewBox = "0 0 20 20"
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
        <path className="f_stroke"
            d="M4.5 3.704v.777l.707-.322 2.577-1.173a.522.522 0 0 1 .49.03.47.47 0 0 1 .226.399v4.402h3V1.463c0-.25.212-.475.5-.475h5c.288 0 .5.224.5.475V18.55H19c.288 0 .5.224.5.475a.488.488 0 0 1-.5.476H1a.488.488 0 0 1-.5-.476c0-.25.212-.475.5-.475h1.5V5.69c0-.178.106-.348.284-.429l.423-.193.293-.133V.976C3.5.725 3.712.5 4 .5c.288 0 .5.225.5.476v2.728ZM16 18.549h.5V1.939h-4v5.878h.5c.288 0 .5.225.5.476v10.256H16Zm-3.5-9.28v-.5h-5v9.78h5v-9.28ZM6 18.548h.5V8.293c0-.251.212-.476.5-.476h.5V4.17l-.707.321-3 1.366-.293.134v12.558H6Z"
            stroke={stroke}
        />

    </svg>
);

export default F_CompanyIcon;



