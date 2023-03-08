interface ILogo {
    variant?: "default" | "white" | "minimalNormal" | "minimalLight";
}

const Logo: React.FC<ILogo> = ({ variant = "default" }) => {

    const imgSrc = {
        default: "https://lh4.googleusercontent.com/2iQEEeGz5XdAP8RayjZwDluZjBVTvj5hRud1lAvszEF891b__9wify83cPOIJ9ycszU=w2400",
        white: "https://lh3.googleusercontent.com/nrRman3AbHXawIHnf2RmBTIf0debQtGJLAe3d-vrCBCCIgVEW4nbAR8cBkXr-9_HLZQ=w2400",
        minimalNormal: "https://lh5.googleusercontent.com/xpdYnEVoG55NdllVohW6h6d6y0EdJvrffZ4QpLEcfRTHeCTXSF9479lMVREUgvjFoRs=w2400",
        minimalLight: "https://lh4.googleusercontent.com/qqcAu9Q49d9IxdhTgusvmuwrQ-CulhuJblzBF93badUJQ-hNlSbnQ2h39lpMTJ2CWlY=w2400",
    };

    return (
        <img
            src={imgSrc[variant]}
            alt="Reveal Logo"
            className="w-full h-full"
        />
    )
};

export default Logo;