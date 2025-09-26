import { useEffect } from "react";
import { useAi } from "../../../context/AiContext";
import Toast from "@/components/common/Toast/Toast";

function EvaluatePatient({ patientId }) {
  const { evaluate, evaluationResult, errors } = useAi();

  useEffect(() => {
    evaluate(patientId);
  }, []);

  const gradients = {
    teal: "bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent",
    amber:
      "bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent",
    sky: "bg-gradient-to-r from-sky-400 to-cyan-600 bg-clip-text text-transparent",
    emerald:
      "bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent",
  };

  return (
    <>
      {errors.length > 0 &&
        errors.map((e, i) => <Toast key={i} type="error" message={e} />)}
      <div className="p-6 max-w-4xl mx-auto space-y-8 transition-colors duration-300 ease-in-out">
        {evaluationResult && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start bg-white dark:bg-neutral-800 rounded-2xl shadow-md border border-gray-100 dark:border-neutral-700 p-6 gap-4 hover:shadow-lg transition-colors duration-300 ease-in-out">
              <div className={`text-4xl flex-shrink-0 ${gradients.teal}`}>
                <i className="fa fa-heartbeat" />
              </div>
              <div className="space-y-2">
                <h2 className={`text-xl font-semibold ${gradients.teal}`}>
                  Evaluación de Riesgos
                </h2>
                <ul className="text-sm text-gray-800 dark:text-neutral-300 space-y-1">
                  <li>
                    <i className="fa fa-check-circle mr-1 text-teal-500" />
                    <span className="font-medium text-teal-500">
                      Nivel de adherencia:
                    </span>{" "}
                    {evaluationResult.adherenceLevel}
                  </li>
                  <li>
                    <i className="fa fa-exclamation-triangle mr-1 text-yellow-500" />
                    <span className="font-medium text-yellow-500">
                      Riesgo de abandono:
                    </span>{" "}
                    {evaluationResult.dropoutRisk}
                  </li>
                  <li>
                    <i className="fa fa-user-times mr-1 text-rose-500" />
                    <span className="font-medium text-rose-500">
                      Abandono detectado:
                    </span>{" "}
                    {evaluationResult.flags.abandono ? "Sí" : "No"}
                  </li>
                  <li>
                    <i className="fa fa-shield-alt mr-1 text-indigo-500" />
                    <span className="font-medium text-indigo-500">
                      Resistencia detectada:
                    </span>{" "}
                    {evaluationResult.flags.resistencia ? "Sí" : "No"}
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start bg-white dark:bg-neutral-800 rounded-2xl shadow-md border border-gray-100 dark:border-neutral-700 p-6 gap-4 hover:shadow-lg transition-colors duration-300 ease-in-out">
              <div className={`text-4xl flex-shrink-0 ${gradients.amber}`}>
                <i className="fa fa-lightbulb" />
              </div>
              <div className="space-y-2">
                <h3 className={`text-lg font-semibold ${gradients.amber}`}>
                  Recomendaciones
                </h3>
                <ul className="text-sm text-gray-800 dark:text-neutral-300 space-y-1">
                  {evaluationResult.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <i className="fa fa-angle-right mt-0.5 text-amber-500" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start bg-white dark:bg-neutral-800 rounded-2xl shadow-md border border-gray-100 dark:border-neutral-700 p-6 gap-4 hover:shadow-lg transition-colors duration-300 ease-in-out">
              <div className={`text-4xl flex-shrink-0 ${gradients.sky}`}>
                <i className="fa fa-code-branch" />
              </div>
              <div className="space-y-2">
                <h3 className={`text-lg font-semibold ${gradients.sky}`}>
                  Reglas Disparadas
                </h3>
                {evaluationResult.triggeredRules.length > 0 ? (
                  <ul className="text-sm text-gray-800 dark:text-neutral-300 space-y-1">
                    {evaluationResult.triggeredRules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <i className="fa fa-tag mt-0.5 text-sky-500" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    No se activaron reglas específicas.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start bg-white dark:bg-neutral-800 rounded-2xl shadow-md border border-gray-100 dark:border-neutral-700 p-6 gap-4 hover:shadow-lg transition-colors duration-300 ease-in-out">
              <div className={`text-4xl flex-shrink-0 ${gradients.emerald}`}>
                <i className="fa fa-book-reader" />
              </div>
              <div className="space-y-2">
                <h3 className={`text-lg font-semibold ${gradients.emerald}`}>
                  Educación del Paciente
                </h3>
                <ul className="text-sm text-gray-800 dark:text-neutral-300 space-y-1">
                  <li>
                    <i className="fa fa-book mr-1 text-emerald-500" />
                    <span className="font-semibold text-emerald-500">
                      Contenidos vistos:
                    </span>{" "}
                    {evaluationResult.educationStats.totalViewed}
                  </li>
                  <li>
                    <i className="fa fa-clock mr-1 text-slate-500" />
                    <span className="font-semibold text-slate-500">
                      Última visualización:
                    </span>{" "}
                    {new Date(
                      evaluationResult.educationStats.lastViewedAt
                    ).toLocaleString()}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default EvaluatePatient;
