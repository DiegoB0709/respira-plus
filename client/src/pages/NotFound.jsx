function NotFound() {
  return (
    <main className="flex h-screen items-center justify-center bg-gray-50 dark:bg-neutral-900 px-6 transition-colors duration-300 ease-in-out">
      <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl p-10 max-w-lg w-full text-center transition-colors duration-300 ease-in-out">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-teal-100 dark:bg-teal-900 shadow-md transition-colors duration-300 ease-in-out">
            <span className="text-4xl font-extrabold text-teal-500">404</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-neutral-50 transition-colors duration-300 ease-in-out">
            Página no encontrada
          </h1>
          <p className="text-gray-600 dark:text-neutral-300 text-lg sm:text-xl leading-relaxed transition-colors duration-300 ease-in-out">
            Lo sentimos, la página que buscas no existe o fue movida.
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-400 to-sky-500 px-6 py-3 text-white font-semibold shadow-md hover:brightness-110 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-teal-500 transition-colors duration-300 ease-in-out"
          >
            <i className="fas fa-home" />
            Volver al inicio
          </a>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
