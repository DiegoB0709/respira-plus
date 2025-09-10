function NotFound() {
  return (
    <main className="flex h-screen items-center justify-center bg-gray-50 px-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-teal-100 shadow-md">
            <span className="text-4xl font-extrabold text-teal-500">404</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Página no encontrada
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl leading-relaxed">
            Lo sentimos, la página que buscas no existe o fue movida.
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-6 py-3 text-white font-semibold shadow-md hover:bg-teal-400 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-teal-500 transition"
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
