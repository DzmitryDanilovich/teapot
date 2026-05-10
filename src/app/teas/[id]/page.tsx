interface Props {
    params: Promise<{ id: string }>;
}

const Tea = async ({ params }: Props) => {
    const { id } = await params;

    return (
        <h1>Tea Page: {id}</h1>
    )
};

export default Tea;
