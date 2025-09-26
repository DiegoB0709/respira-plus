import { useEffect } from "react";
import { useMetrics } from "../../context/MetricsContext";

import CardWrapper from "@/components/common/Dashboard/CardWrapper";
import ChartDonut from "@/components/common/Dashboard/ChartDonut";
import ChartBar from "@/components/common/Dashboard/ChartBar";
import ChartArea from "@/components/common/Dashboard/ChartArea";
import MetricCard from "@/components/common/Dashboard/MetricCard";
import Title from "../Title";

import { Users, Calendar, Bell, Activity } from "lucide-react";
import Toast from "../common/Toast/Toast";

function Dashboard() {
  const { doctorMetrics, error, fetchDoctorMetrics } = useMetrics();

  useEffect(() => {
    fetchDoctorMetrics();
  }, []);

  if (!doctorMetrics) {
    return (
      <div className="p-4 text-center text-gray-500 animate-pulse">
        Cargando métricas...
      </div>
    );
  }

  const { pacientes, citas, tratamientos, alertas } = doctorMetrics.metrics;

  const donutCitasData = Object.entries(citas.porEstado).map(
    ([name, value]) => ({ name, value })
  );
  const donutCitasColors = [
    "#14b8a6",
    "#22c55e",
    "#3b82f6",
    "#f43f5e",
    "#f97316",
    "#eab308",
  ];

  const donutRiesgoData = Object.entries(pacientes.riesgo).map(([k, v]) => ({
    name: k,
    value: v,
  }));
  const donutRiesgoColors = ["#22c55e", "#facc15", "#ef4444"];

  const donutAlertasData = Object.entries(alertas.porSeveridad).map(
    ([k, v]) => ({ name: k, value: v })
  );
  const donutAlertasColors = ["#22c55e", "#facc15", "#ef4444"];

  const donutFaseData = Object.entries(pacientes.faseTratamiento).map(
    ([k, v]) => ({ name: k, value: v })
  );
  const donutFaseColors = ["#3b82f6", "#f97316", "#22c55e"];

  const barHistorialData = citas.historialMensual.map((h) => ({
    name: h.mes,
    cantidad: h.cantidad,
  }));

  const areaTratamientosData = tratamientos.nuevosPorMes.map((t) => ({
    name: t.mes,
    cantidad: t.cantidad,
  }));

  return (
    <>
      {error.length > 0 &&
        error.map((e, i) => <Toast key={i} type="error" message={e} />)}
      <div className="p-4 max-w-7xl mx-auto space-y-8">
        <Title icon="fa-chart-simple" title="Dashboard" />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <MetricCard
            label="Pacientes Asignados"
            value={pacientes.asignados}
            icon={Users}
          />
          <MetricCard
            label="Pendientes de Registro"
            value={pacientes.pendientesRegistro}
            icon={Users}
            color="bg-yellow-500"
          />
          <MetricCard
            label="En Tratamiento"
            value={pacientes.enTratamiento}
            icon={Activity}
            color="bg-blue-500"
          />
          <MetricCard
            label="Próximas Citas"
            value={citas.proximas}
            icon={Calendar}
            color="bg-emerald-500"
          />
          <MetricCard
            label="Alertas Activas"
            value={alertas.activas}
            icon={Bell}
            color="bg-rose-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardWrapper title="Riesgo de Pacientes">
            <ChartDonut data={donutRiesgoData} colors={donutRiesgoColors} />
          </CardWrapper>
          <CardWrapper title="Fase de Tratamiento">
            <ChartDonut data={donutFaseData} colors={donutFaseColors} />
          </CardWrapper>
          <CardWrapper title="Alertas por Severidad">
            <ChartDonut data={donutAlertasData} colors={donutAlertasColors} />
          </CardWrapper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardWrapper title="Distribución de Citas">
            <ChartDonut data={donutCitasData} colors={donutCitasColors} />
          </CardWrapper>
          <CardWrapper title="Historial de Citas">
            <ChartBar data={barHistorialData} dataKey="cantidad" />
          </CardWrapper>
        </div>

        <CardWrapper title="Tratamientos por Mes">
          <ChartArea data={areaTratamientosData} dataKey="cantidad" />
        </CardWrapper>
      </div>
    </>
  );
}

export default Dashboard;
