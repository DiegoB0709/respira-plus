import { useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import Button from "../Buttons/Button";
import Toast from "../Toast/Toast";

function Profile({ onOpenUpdate, onCloseProfile }) {
  const { fetchUserProfile, loading, profile, errors } = useUser();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto transition-colors duration-300 ease-in-out">
      <h1 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent mb-6 flex items-center justify-center gap-3">
        <i className="fas fa-user bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent text-2xl sm:text-3xl" />
        Perfil del Usuario
      </h1>

      {loading && (
        <p className="text-center bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent text-base mb-6 flex items-center justify-center gap-2 animate-pulse">
          <i className="fas fa-spinner fa-spin" />
          Cargando perfil...
        </p>
      )}

      {!loading &&
        errors.length > 0 &&
        errors.map((e, i) => <Toast key={i} type="error" message={e} />)}

      {!loading && profile ? (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-xl transition-colors duration-300 ease-in-out border border-gray-100 dark:border-neutral-700 p-6 space-y-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-700 dark:text-neutral-400 flex items-center gap-2 transition-colors duration-300 ease-in-out">
              <i className="fas fa-user bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent" />
              Nombre de usuario
            </p>
            <p className="text-lg pl-5 font-semibold text-gray-800 dark:text-neutral-50 transition-colors duration-300 ease-in-out">
              {profile.username}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-700 dark:text-neutral-400 flex items-center gap-2 transition-colors duration-300 ease-in-out">
              <i className="fas fa-envelope bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent" />
              Email
            </p>
            <p className="text-lg pl-5 font-semibold text-gray-800 dark:text-neutral-50 break-words transition-colors duration-300 ease-in-out">
              {profile.email}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-700 dark:text-neutral-400 flex items-center gap-2 transition-colors duration-300 ease-in-out">
              <i className="fas fa-phone bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent" />
              Teléfono
            </p>
            <p className="text-lg pl-5 font-semibold text-gray-800 dark:text-neutral-50 transition-colors duration-300 ease-in-out">
              {profile.phone || "No registrado"}
            </p>
          </div>
        </div>
      ) : (
        !loading && (
          <p className="text-center text-gray-400 dark:text-neutral-400 text-sm mt-4 transition-colors duration-300 ease-in-out">
            No se encontró información del perfil.
          </p>
        )
      )}

      <div className="mt-8 text-center">
        <Button
          type="bg1"
          icon="fa-edit"
          label="Editar Perfil"
          onClick={() => {
            onOpenUpdate();
            onCloseProfile();
          }}
        />
      </div>
    </div>
  );
}

export default Profile;
