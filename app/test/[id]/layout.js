export default async function Layout({ children, params }) {
    const { id } = await params;
    return (
        <div>
            <h1>Test Layout for ID: {id}</h1>
            {children}
        </div>
    );
}