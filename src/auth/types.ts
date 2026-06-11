export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  projectId?: string;
  roles?: string[];
  approved?: boolean;
  attributes?: Record<string, any>;
}
