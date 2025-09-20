function PageContainer({ children }) {
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-[auto_1fr] transition-colors duration-300 ease-in-out bg-white dark:bg-[#121212]">
      {children}
    </div>
  );
}
export default PageContainer;
