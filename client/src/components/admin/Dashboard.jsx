import { useEffect } from "react";
import { useMetrics } from "@/context/MetricsContext";

import CardWrapper from "@/components/common/Dashboard/CardWrapper";
import ChartDonut from "@/components/common/Dashboard/ChartDonut";
import ChartBar from "@/components/common/Dashboard/ChartBar";
import ChartArea from "@/components/common/Dashboard/ChartArea";
import MetricCard from "@/components/common/Dashboard/MetricCard";
import Title from "../Title";

import { Users } from "lucide-react";
import Toast from "../common/Toast/Toast";

function Dashboard() {
  const { adminMetrics, error, fetchAdminMetrics } = useMetrics();

  useEffect(() => {
    fetchAdminMetrics();
  }, []);

  if (!adminMetrics) {
    return (
      <div className="p-4 text-center text-gray-500 animate-pulse">
        Cargando métricas...
      </div>
    );
  }

  const { usuarios, citas, tratamientos, alertas } = adminMetrics.metrics;

  const donutCitasData = Object.entries(citas.porEstado).map(
    ([name, value]) => ({
      name,
      value,
    })
  );
  const donutCitasColors = [
    "#14b8a6",
    "#22c55e",
    "#3b82f6",
    "#f43f5e",
    "#f97316",
    "#eab308",
  ];

  const donutTratamientosData = [
    { name: "Activos", value: tratamientos.activos },
    { name: "Finalizados", value: tratamientos.finalizados },
    { name: "Eliminados", value: tratamientos.eliminados },
  ];
  const donutTratamientosColors = ["#3b82f6", "#22c55e", "#f43f5e"];

  const donutAlertasData = Object.entries(alertas.porSeveridad).map(
    ([k, v]) => ({
      name: k,
      value: v,
    })
  );
  const donutAlertasColors = ["#22c55e", "#facc15", "#ef4444"];

  const barCitasData = citas.evolucionMensual.map((c) => ({
    name: c.mes,
    cantidad: c.cantidad,
  }));

  const areaTratamientosData = tratamientos.evolucionMensual.map((t) => ({
    name: t.mes,
    cantidad: t.nuevos,
  }));

  return (
    <>
      {error.length > 0 &&
        error.map((e, i) => <Toast key={i} type="error" message={e} />)}
      <div className="p-4 max-w-7xl mx-auto space-y-8">
        <Title icon="fa-chart-simple" title="Dashboard" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <MetricCard
            label="Usuarios Totales"
            value={usuarios.total}
            icon={Users}
          />
          <MetricCard
            label="Pendientes de Registro"
            value={usuarios.pendientesRegistro}
            icon={Users}
            color="bg-yellow-500"
          />
          <MetricCard
            label="Doctores"
            value={usuarios.doctores}
            icon={Users}
            color="bg-blue-500"
          />
          <MetricCard
            label="Pacientes"
            value={usuarios.pacientes}
            icon={Users}
            color="bg-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardWrapper title="Tratamientos">
            <ChartDonut
              data={donutTratamientosData}
              colors={donutTratamientosColors}
            />
          </CardWrapper>
          <CardWrapper title="Distribución de Citas">
            <ChartDonut data={donutCitasData} colors={donutCitasColors} />
          </CardWrapper>
          <CardWrapper title="Alertas por Severidad">
            <ChartDonut data={donutAlertasData} colors={donutAlertasColors} />
          </CardWrapper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardWrapper title="Evolución Mensual de Citas">
            <ChartBar data={barCitasData} dataKey="cantidad" />
          </CardWrapper>
          <CardWrapper title="Tratamientos por Mes">
            <ChartArea data={areaTratamientosData} dataKey="cantidad" />
          </CardWrapper>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
