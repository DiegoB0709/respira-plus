import { useEffect } from "react";
import { useUser } from "../../../context/UserContext";

function Profile({ onOpenUpdate, onCloseProfile }) {
  const { fetchUserProfile, loading, profile, errors } = useUser();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-teal-500 mb-6 flex items-center justify-center gap-2">
        <i className="fas fa-user text-teal-400 text-xl sm:text-2xl shrink-0" />
        Perfil del Usuario
      </h1>

      {loading && (
        <p className="text-center text-teal-500 text-base mb-6 animate-pulse flex items-center justify-center gap-2">
          <i className="fas fa-spinner fa-spin" />
          Cargando perfil...
        </p>
      )}

      {!loading && errors.length > 0 && (
        <div className="bg-red-50 text-red-700 border-l-4 border-red-500 rounded-lg px-5 py-4 mb-6 shadow-sm">
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
        <div className="space-y-6 text-gray-800 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <i className="fas fa-user text-teal-400" />
              Nombre de usuario
            </p>
            <p className="text-lg font-semibold">{profile.username}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <i className="fas fa-envelope text-teal-400" />
              Email
            </p>
            <div className="max-w-full">
              <p className="text-lg font-semibold break-words whitespace-normal">
                {profile.email}
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <i className="fas fa-phone text-teal-400" />
              Teléfono
            </p>
            <p className="text-lg font-semibold">
              {profile.phone || "No registrado"}
            </p>
          </div>
        </div>
      ) : (
        !loading && (
          <p className="text-center text-gray-500 text-sm mt-4">
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
          className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 text-white text-sm font-medium rounded-lg shadow-md hover:bg-teal-400 hover:shadow-lg active:scale-[0.97] transition-transform duration-200 ease-in-out"
        >
          <i className="fas fa-edit" />
          Editar Perfil
        </button>
      </div>
    </div>
  );
}

export default Profile;
