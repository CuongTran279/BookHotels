const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <button
            className="absolute top-1/2 transform -translate-y-1/2 right-0 z-10 p-2 text-black rounded-full hover:bg-gray-700 hover:text-white focus:outline-none text-3xl"
            onClick={onClick}
            style={{ ...style }}
        >
            &rarr;
        </button>
    );
};

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <button
            className="absolute top-1/2 transform -translate-y-1/2 left-0 z-10 p-2 text-black rounded-full hover:bg-gray-700 hover:text-white focus:outline-none text-3xl"
            onClick={onClick}
            style={{ ...style }}
        >
            &larr;
        </button>
    );
};
const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
};

export default sliderSettings;
