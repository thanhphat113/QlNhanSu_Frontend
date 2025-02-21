import AnimationZoom from "../../Animation/AnimationZoom";

function DialogLayout({ children }) {
    return (
        <div className="absolute w-full h-full top-0 left-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
            <AnimationZoom>{children}</AnimationZoom>
        </div>
    );
}

export default DialogLayout;
