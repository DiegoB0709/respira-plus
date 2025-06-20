import { AuthProvider } from "./AuthContext";
import { AiProvider } from "./AiContext";
import { AlertsProvider } from "./AlertsContext";
import { AppointmentProvider } from "./AppointmentContext";
import { ClinicalDetailsProvider } from "./ClinicalDetailsContext";
import { DoctorProvider } from "./DoctorContext";
import { EducationalProvider } from "./EducationalContext";
import { ExportProvider } from "./ExportContext";
import { MetricsProvider } from "./MetricsContext";
import { NotificationProvider } from "./NotificationContext";
import { TreatmentProvider } from "./TreatmentContext";

function ContextContainer({ children }) {
  return (
    <AuthProvider>
      <AiProvider>
        <AlertsProvider>
          <AppointmentProvider>
            <ClinicalDetailsProvider>
              <DoctorProvider>
                <EducationalProvider>
                  <ExportProvider>
                    <MetricsProvider>
                      <NotificationProvider>
                        <TreatmentProvider>{children}</TreatmentProvider>
                      </NotificationProvider>
                    </MetricsProvider>
                  </ExportProvider>
                </EducationalProvider>
              </DoctorProvider>
            </ClinicalDetailsProvider>
          </AppointmentProvider>
        </AlertsProvider>
      </AiProvider>
    </AuthProvider>
  );
}

export default ContextContainer;
