import React from 'react';

export const breakpoint = [480, 976, 1024, 1140, 1280, 1440, 1680, 1920];
function getWindowDimensions() {
    let width;
    let height;
    if (typeof window !== 'undefined') {
        width = window.innerWidth;
        height = window.innerHeight;
    }
    return {
        width,
        height,
    };
}

export const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = React.useState(
        getWindowDimensions()
    );
    React.useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });
    const handleResize = React.useCallback(() => {
        setWindowDimensions(getWindowDimensions());
    });
    return windowDimensions;
};
