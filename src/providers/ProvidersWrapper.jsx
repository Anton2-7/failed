import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "@/auth/providers/JWTProvider";
import {
  LayoutProvider,
  LoadersProvider,
  MenusProvider,
  SettingsProvider,
  SnackbarProvider,
  TranslationProvider,
  ModalProvider,
  FilterProvider,
  TasksFilterProvider,
  StatisticsFilterProvider,
  FaqPaginationProvider,
  PaginationProvider,
  AccessProvider,
  MailingFilterProvider,
} from "@/providers";

import { HelmetProvider } from "react-helmet-async";
const queryClient = new QueryClient();
const ProvidersWrapper = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <AuthProvider>
          <SettingsProvider>
            <TranslationProvider>
              <HelmetProvider>
                <LayoutProvider>
                  <LoadersProvider>
                    <MenusProvider>
                      <PaginationProvider>
                        <ModalProvider>
                          <FilterProvider>
                            <TasksFilterProvider>
                              <AccessProvider>
                                <StatisticsFilterProvider>
                                  <FaqPaginationProvider>
                                    <MailingFilterProvider>
                                      {children}
                                    </MailingFilterProvider>
                                  </FaqPaginationProvider>
                                </StatisticsFilterProvider>
                              </AccessProvider>
                            </TasksFilterProvider>
                          </FilterProvider>
                        </ModalProvider>
                      </PaginationProvider>
                    </MenusProvider>
                  </LoadersProvider>
                </LayoutProvider>
              </HelmetProvider>
            </TranslationProvider>
          </SettingsProvider>
        </AuthProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
};
export { ProvidersWrapper };
