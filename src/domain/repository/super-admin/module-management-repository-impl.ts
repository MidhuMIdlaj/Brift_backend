import type { IModule } from "../../entities/Module.js";

export interface IModuleManagementRepository {
  findAll(): Promise<IModule[]>;
  findById(id: string): Promise<IModule | null>;
  findByKey(key: string): Promise<IModule | null>;
  create(data: Omit<IModule, '_id'>): Promise<IModule>;
  update(id: string, data: Partial<Omit<IModule, '_id' | 'key'>>): Promise<IModule>;
  delete(id: string): Promise<void>;
}