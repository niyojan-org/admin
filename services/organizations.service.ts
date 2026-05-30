import { createServerApi } from '@/lib/server-api';
import { OrganizationData, OrganizationDataSchema } from '@/types/organizations/organization-data';

class OrganizationService {
  static async fetchOrganization(): Promise<OrganizationData | null> {
    try {
      const api = await createServerApi();
      const res = await api.get('/organizations/admin');
      if (!res.data.organization) return null;
      const organization = OrganizationDataSchema.parse(res.data.organization);
      return organization;
    } catch {
      return null;
    }
  }
}

export default OrganizationService;
