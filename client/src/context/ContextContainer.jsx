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
import { UserProvider } from "./UserContext";
import { SocketProvider } from "./SocketContext";

function ContextContainer({ children }) {
  return (
    <AuthProvider>
      <SocketProvider>
        <AiProvider>
          <AlertsProvider>
            <AppointmentProvider>
              <ClinicalDetailsProvider>
                <DoctorProvider>
                  <EducationalProvider>
                    <ExportProvider>
                      <MetricsProvider>
                        <NotificationProvider>
                          <TreatmentProvider>
                            <UserProvider>{children}</UserProvider>
                          </TreatmentProvider>
                        </NotificationProvider>
                      </MetricsProvider>
                    </ExportProvider>
                  </EducationalProvider>
                </DoctorProvider>
              </ClinicalDetailsProvider>
            </AppointmentProvider>
          </AlertsProvider>
        </AiProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default ContextContainer;
