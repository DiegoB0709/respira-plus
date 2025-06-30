import { useEffect } from "react";
import { useUser } from "../../../context/UserContext";

function Profile({ onOpenUpdate, onCloseProfile }) {
  const { fetchUserProfile, loading, profile, errors } = useUser();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Perfil del Usuario
      </h1>

      {loading && (
        <p className="text-teal-600 text-center text-base mb-6 animate-pulse">
          Cargando perfil...
        </p>
      )}

      {!loading && errors.length > 0 && (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded-md px-4 py-3 mb-6">
          <p className="font-medium">Error al cargar el perfil:</p>
          <ul className="list-disc list-inside text-sm mt-1">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {!loading && profile ? (
        <div className="space-y-4 text-gray-800 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div>
            <p className="text-sm text-gray-500">Nombre de usuario</p>
            <p className="text-lg font-medium">{profile.username}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium">{profile.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Teléfono</p>
            <p className="text-lg font-medium">
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
          className="inline-flex items-center justify-center px-6 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-teal-700 hover:shadow-lg active:scale-[0.98] transition-all duration-200"
        >
          Editar Perfil
        </button>
      </div>
    </>
  );
  
}

export default Profile;
