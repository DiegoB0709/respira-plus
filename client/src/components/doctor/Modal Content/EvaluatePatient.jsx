import { useEffect } from "react";
import { useAi } from "../../../context/AiContext";

function EvaluatePatient({ patientId }) {
  const { evaluate, evaluationResult, errors } = useAi();

  useEffect(() => {
    evaluate(patientId);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center text-teal-500 flex items-center justify-center gap-2">
        <i className="fa fa-user-md text-teal-400" />
        Evaluación del Paciente
      </h1>

      {errors.length > 0 && (
        <div className="bg-red-50 text-red-700 p-5 rounded-2xl border border-red-200 shadow-sm space-y-3">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <i className="fa fa-exclamation-circle" />
            Se encontraron errores:
          </h2>
          <ul className="list-disc list-inside text-sm space-y-1 pl-1">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {evaluationResult && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start bg-white rounded-2xl shadow-md border border-gray-100 p-6 gap-4 hover:shadow-lg transition-shadow">
            <div className="text-teal-500 text-4xl flex-shrink-0">
              <i className="fa fa-heartbeat" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-teal-600">
                Evaluación de Riesgos
              </h2>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>
                  <i className="fa fa-check-circle text-teal-500 mr-1" />
                  <span className="font-medium text-teal-600">
                    Nivel de adherencia:
                  </span>{" "}
                  {evaluationResult.adherenceLevel}
                </li>
                <li>
                  <i className="fa fa-exclamation-triangle text-yellow-500 mr-1" />
                  <span className="font-medium text-yellow-600">
                    Riesgo de abandono:
                  </span>{" "}
                  {evaluationResult.dropoutRisk}
                </li>
                <li>
                  <i className="fa fa-user-times text-rose-500 mr-1" />
                  <span className="font-medium text-rose-600">
                    Abandono detectado:
                  </span>{" "}
                  {evaluationResult.flags.abandono ? "Sí" : "No"}
                </li>
                <li>
                  <i className="fa fa-shield-alt text-indigo-500 mr-1" />
                  <span className="font-medium text-indigo-600">
                    Resistencia detectada:
                  </span>{" "}
                  {evaluationResult.flags.resistencia ? "Sí" : "No"}
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start bg-white rounded-2xl shadow-md border border-gray-100 p-6 gap-4 hover:shadow-lg transition-shadow">
            <div className="text-amber-500 text-4xl flex-shrink-0">
              <i className="fa fa-lightbulb" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-amber-600">
                Recomendaciones
              </h3>
              <ul className="text-sm text-gray-800 space-y-1">
                {evaluationResult.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <i className="fa fa-angle-right text-amber-500 mt-0.5" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start bg-white rounded-2xl shadow-md border border-gray-100 p-6 gap-4 hover:shadow-lg transition-shadow">
            <div className="text-sky-500 text-4xl flex-shrink-0">
              <i className="fa fa-code-branch" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-sky-600">
                Reglas Disparadas
              </h3>
              {evaluationResult.triggeredRules.length > 0 ? (
                <ul className="text-sm text-gray-800 space-y-1">
                  {evaluationResult.triggeredRules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <i className="fa fa-tag text-sky-500 mt-0.5" />
                      {rule}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">
                  No se activaron reglas específicas.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start bg-white rounded-2xl shadow-md border border-gray-100 p-6 gap-4 hover:shadow-lg transition-shadow">
            <div className="text-emerald-500 text-4xl flex-shrink-0">
              <i className="fa fa-book-reader" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-emerald-600">
                Educación del Paciente
              </h3>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>
                  <i className="fa fa-book text-emerald-500 mr-1" />
                  <span className="font-semibold text-emerald-600">
                    Contenidos vistos:
                  </span>{" "}
                  {evaluationResult.educationStats.totalViewed}
                </li>
                <li>
                  <i className="fa fa-clock text-slate-500 mr-1" />
                  <span className="font-semibold text-slate-600">
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
  );
}

export default EvaluatePatient;
