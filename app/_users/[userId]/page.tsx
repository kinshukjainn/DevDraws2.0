interface UserIdPageProps {
    params: {
        userId: string;
    };
};

const page = ({
    params,
}: UserIdPageProps) => {
    return (
        <div>
            UserId : {params.userId}
        </div>
    )
}

export default page