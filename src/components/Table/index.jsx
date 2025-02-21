function Table({ thead, children,id }) {
    return (
        <table id={id} className=" text-center min-w-full">
            <thead className="bg-black text-white h-[4rem]">
                <tr>
                    {thead.map((item, index) => (
                        <td className="whitespace-nowrap px-5" key={index}>{item}</td>
                    ))}
                </tr>
            </thead>
            <tbody>{children}</tbody>
        </table>
    );
}

export default Table;
