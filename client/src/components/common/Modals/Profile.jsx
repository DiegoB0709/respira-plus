import { useEffect } from "react";
import { useUser } from "../../../context/UserContext";

function Profile({ onOpenUpdate, onCloseProfile }) {
  const { fetchUserProfile, loading, profile, errors } = useUser();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-teal-500 mb-6 flex items-center justify-center gap-3">
        <i className="fas fa-user text-teal-400 text-2xl sm:text-3xl" />
        Perfil del Usuario
      </h1>

      {loading && (
        <p className="text-center text-teal-500 text-base mb-6 flex items-center justify-center gap-2 animate-pulse">
          <i className="fas fa-spinner fa-spin" />
          Cargando perfil...
        </p>
      )}

      {!loading && errors.length > 0 && (
        <div className="bg-red-50 text-red-700 border-l-4 border-red-500 rounded-xl p-4 mb-6 shadow-sm">
          <p className="font-medium flex items-center gap-2">
            <i className="fas fa-exclamation-triangle" />
            Error al cargar el perfil:
          </p>
          <ul className="list-disc list-inside text-sm mt-2">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {!loading && profile ? (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100 p-6 space-y-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <i className="fas fa-user text-teal-500" />
              Nombre de usuario
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {profile.username}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <i className="fas fa-envelope text-teal-500" />
              Email
            </p>
            <p className="text-lg font-semibold text-gray-800 break-words">
              {profile.email}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <i className="fas fa-phone text-teal-500" />
              Teléfono
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {profile.phone || "No registrado"}
            </p>
          </div>
        </div>
      ) : (
        !loading && (
          <p className="text-center text-gray-400 text-sm mt-4">
            No se encontró información del perfil.
          </p>
        )
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => {
            onOpenUpdate();
            onCloseProfile();
          }}
          className="cursor-pointer relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 text-white text-sm font-medium rounded-xl shadow-md hover:bg-teal-400 hover:shadow-lg active:scale-95 transition-all duration-200"
        >
          <span className="absolute inset-0 bg-white opacity-10 scale-0 hover:scale-100 transition-transform duration-300 rounded-xl"></span>
          <i className="fas fa-edit z-10" />
          <span className="z-10">Editar Perfil</span>
        </button>
      </div>
    </div>
  );

}

export default Profile;
