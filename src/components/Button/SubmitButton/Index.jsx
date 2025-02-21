function SubmitButton({ label }) {
    return <input type="submit" className="hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] action-button rounded-[30px] text-3xl cursor-pointer w-full h-[3.5rem]" value={label}/>;
}

export default SubmitButton;
