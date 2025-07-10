function NotFound() {
  return (
    <main className="flex h-screen items-center justify-center bg-white px-6 py-24">
      <div className="text-center">
        <p className="text-5xl font-bold text-teal-500 sm:text-6xl">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance text-gray-900 sm:text-6xl">
          No se encontró la página
        </h1>
        <p className="mt-6 text-lg text-pretty text-gray-500 sm:text-xl">
          Lo sentimos, la página que estás buscando no existe o fue movida.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/"
            className="rounded-md bg-teal-500 px-4 py-2.5 text-base font-semibold text-white shadow hover:bg-teal-400 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
