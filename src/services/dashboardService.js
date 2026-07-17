// Version estatica: calcula el resumen a partir de los datos locales.
import { store } from '../data/store';
import { ok } from '../data/fakeApi';

export const dashboardService = {
  resumen: () => ok(store.resumenDashboard())
};
