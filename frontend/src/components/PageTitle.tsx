interface PageTitle {
    title: string;
}

export const PageTitle = ({
    title,
}: PageTitle) => {
    return (
        <h2 className="
            text-[36px] sm:text-[42px] lg:text-[48px] 
            font-bold text-[#295C65] 
            sm:ml-[20px]
            ">
            {title}
        </h2>
    );
};