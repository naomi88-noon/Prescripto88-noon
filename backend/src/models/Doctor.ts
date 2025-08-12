import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/sequelize';

interface DoctorAttrs {
  id: string;
  name: string;
  image: string | null;
  speciality: string;
  degree: string | null;
  experienceYears: number;
  about: string | null;
  fee: number;
  addressLine1: string;
  addressLine2?: string | null;
  active: boolean;
  rating: number;
  availability?: any | null; // JSON schedule rules (future use)
  createdAt?: Date;
  updatedAt?: Date;
}
interface DoctorCreation
  extends Optional<DoctorAttrs, 'id' | 'image' | 'degree' | 'about' | 'addressLine2' | 'active' | 'rating' | 'availability'> {}

export class Doctor extends Model<DoctorAttrs, DoctorCreation> implements DoctorAttrs {
  public id!: string;
  public name!: string;
  public image!: string | null;
  public speciality!: string;
  public degree!: string | null;
  public experienceYears!: number;
  public about!: string | null;
  public fee!: number;
  public addressLine1!: string;
  public addressLine2!: string | null;
  public active!: boolean;
  public rating!: number;
  public availability!: any | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Doctor.init(
  {
    id: { type: DataTypes.STRING(50), primaryKey: true },
    name: { type: DataTypes.STRING(140), allowNull: false },
    image: { type: DataTypes.STRING(255), allowNull: true },
    speciality: { type: DataTypes.STRING(80), allowNull: false },
    degree: { type: DataTypes.STRING(80), allowNull: true },
    experienceYears: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    about: { type: DataTypes.TEXT, allowNull: true },
    fee: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    addressLine1: { type: DataTypes.STRING(160), allowNull: false },
    addressLine2: { type: DataTypes.STRING(160), allowNull: true },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  rating: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  availability: { type: DataTypes.JSON, allowNull: true },
  },
  { sequelize, tableName: 'doctors' }
);
