import ActionButton from "../../Button/ActionButton";
import DialogLayout from "../../Layout/DialogLayout";

function DefaultNotification({ title, message, accept, deny }) {
    return (
        <DialogLayout>
            <div className="bg-white w-[50rem] py-[2rem] relative rounded-3xl">
                <h1 className="text-center text-5xl font-bold">{title}</h1>
                <i
                    onClick={deny}
                    className="fas fa-times absolute right-3 top-3 text-3xl hover:text-red-700 cursor-pointer"
                ></i>
                <p className="text-center mt-5 text-3xl">{message}</p>
                <div className="flex justify-center mt-8 h-[3.2rem]">
                    <ActionButton
                        label="Xác nhận"
                        action={accept}
                    ></ActionButton>
                </div>
            </div>
        </DialogLayout>
    );
}

export default DefaultNotification;
