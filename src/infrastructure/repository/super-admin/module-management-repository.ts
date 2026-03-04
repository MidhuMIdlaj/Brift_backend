import type { IModule } from "../../../domain/entities/Module.js";
import type { IModuleManagementRepository } from "../../../domain/repository/super-admin/module-management-repository-impl.js";
import { ModuleModel } from "../../db/model/module-model.js";


export class ModuleManagementRepository implements IModuleManagementRepository {

  async findAll(): Promise<IModule[]> {
    const docs = await ModuleModel.find().lean<IModule[]>();
    return docs.map((d) => ({ ...d, _id: d._id!.toString() }));
  }

  async findById(id: string): Promise<IModule | null> {
    const doc = await ModuleModel.findById(id).lean<IModule>();
    if (!doc) return null;
    return { ...doc, _id: doc._id!.toString() };
  }

  async findByKey(key: string): Promise<IModule | null> {
    const doc = await ModuleModel.findOne({ key }).lean<IModule>();
    if (!doc) return null;
    return { ...doc, _id: doc._id!.toString() };
  }

  async create(data: Omit<IModule, '_id'>): Promise<IModule> {
    const doc = await ModuleModel.create(data);
    return { ...(doc.toObject() as unknown as IModule), _id: doc._id.toString() };
  }

  async update(id: string, data: Partial<Omit<IModule, '_id' | 'key'>>): Promise<IModule> {
    const doc = await ModuleModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).lean<IModule>();
    return { ...doc!, _id: doc!._id!.toString() };
  }

  async delete(id: string): Promise<void> {
    await ModuleModel.findByIdAndDelete(id);
  }
}