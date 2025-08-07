import { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {children}
    </div>
  );
};
