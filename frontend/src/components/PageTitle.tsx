interface PageTitle {
    title: string;
}

export const PageTitle = ({
    title,
}: PageTitle) => {
    return (
        <h2 className="text-[48px] font-bold text-[#295C65] ml-[25px]">
            {title}
        </h2>
    );
};