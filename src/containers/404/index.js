import React from 'react';
import { Button } from 'antd';

const Error404 = () => {

    const [finalHeight, setFinalHeight] = useState('')
    React.useEffect(() => {
        let mainLayoutHeader = document.getElementById("f_layout-content-header");
        let mainHeight = mainLayoutHeader?.offsetHeight;
        setFinalHeight(mainHeight)
    }, [window?.location?.pathname]);
    return (
        <div className="f_content-main-inner f_404 f_flex f_align-center f_content-center" style={{ height: `calc(100vh - ${finalHeight}px)` }}>
            <div className="f_404-inner f_flex f_align-center f_content-center f_flex-col">
                <h4>Oops!</h4>
                <h5>The page you are looking for doesn't exist.</h5>
                <Button size='large' type='primary' className='f_flex f_align-center f_content-center' href={defaultPath}>Go to Home</Button>
            </div>
        </div>
    );
};

export default Error404;
