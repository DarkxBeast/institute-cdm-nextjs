import Navbar from "@/components/shadcn-studio/blocks/navbar-component-01/navbar-component-01";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
